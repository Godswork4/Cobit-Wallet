import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { BN } from 'bn.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { HotReserveBucket, Position } from './types';

export class ZplClient {
  private connection: Connection;
  private walletPublicKey: PublicKey;
  private signTransaction: (tx: any) => Promise<any>;
  private twoWayPegProgramId: PublicKey;
  private liquidityManagementProgramId: PublicKey;
  private assetMint: PublicKey;

  constructor(
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (tx: any) => Promise<any>,
    twoWayPegProgramId: PublicKey,
    liquidityManagementProgramId: PublicKey,
    assetMint: PublicKey
  ) {
    this.connection = connection;
    this.walletPublicKey = walletPublicKey;
    this.signTransaction = signTransaction;
    this.twoWayPegProgramId = twoWayPegProgramId;
    this.liquidityManagementProgramId = liquidityManagementProgramId;
    this.assetMint = assetMint;
  }

  // PDA Derivation Methods
  deriveLiquidityManagementGuardianSettingAddress(guardianSetting: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('guardian_setting'), guardianSetting.toBuffer()],
      this.liquidityManagementProgramId
    );
    return pda;
  }

  deriveSplTokenVaultAuthorityAddress(guardianSetting: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault_authority'), guardianSetting.toBuffer()],
      this.liquidityManagementProgramId
    );
    return pda;
  }

  // Hot Reserve Bucket Methods
  async getHotReserveBucketsByBitcoinXOnlyPubkey(xOnlyPubkey: Buffer): Promise<HotReserveBucket[]> {
    const accounts = await this.connection.getProgramAccounts(this.twoWayPegProgramId, {
      filters: [
        { memcmp: { offset: 32, bytes: xOnlyPubkey.toString('hex') } }
      ]
    });

    return accounts.map(account => ({
      owner: new PublicKey(account.account.data.slice(0, 32)).toString(),
      taprootXOnlyPublicKey: account.account.data.slice(32, 64).toString('hex'),
      scriptPathSpendPublicKey: account.account.data.slice(64, 96).toString('hex'),
      guardianSetting: new PublicKey(account.account.data.slice(96, 128)).toString(),
      status: account.account.data[128] === 1 ? 'active' : account.account.data[128] === 2 ? 'expired' : 'deactivated'
    }));
  }

  async getHotReserveBucketsByOwner(owner: PublicKey): Promise<HotReserveBucket[]> {
    const accounts = await this.connection.getProgramAccounts(this.twoWayPegProgramId, {
      filters: [
        { memcmp: { offset: 0, bytes: owner.toBuffer().toString('hex') } }
      ]
    });

    return accounts.map(account => ({
      owner: owner.toString(),
      taprootXOnlyPublicKey: account.account.data.slice(32, 64).toString('hex'),
      scriptPathSpendPublicKey: account.account.data.slice(64, 96).toString('hex'),
      guardianSetting: new PublicKey(account.account.data.slice(96, 128)).toString(),
      status: account.account.data[128] === 1 ? 'active' : account.account.data[128] === 2 ? 'expired' : 'deactivated'
    }));
  }

  // Position Methods
  async getPositions(owner: PublicKey): Promise<Position[]> {
    const accounts = await this.connection.getProgramAccounts(this.liquidityManagementProgramId, {
      filters: [
        { memcmp: { offset: 0, bytes: owner.toBuffer().toString('hex') } }
      ]
    });

    return accounts.map(account => ({
      storedAmount: new BN(account.account.data.slice(32, 40), 'le'),
      frozenAmount: new BN(account.account.data.slice(40, 48), 'le'),
      guardianSetting: new PublicKey(account.account.data.slice(48, 80)).toString()
    }));
  }

  // Instruction Construction Methods
  constructRetrieveIx(
    amount: BN,
    guardianSetting: PublicKey,
    receiverAta?: PublicKey
  ): TransactionInstruction {
    const positionPda = this.deriveLiquidityManagementGuardianSettingAddress(guardianSetting);
    const splTokenVaultAuthority = this.deriveSplTokenVaultAuthorityAddress(guardianSetting);
    const vaultAta = getAssociatedTokenAddressSync(this.assetMint, splTokenVaultAuthority, true);
    
    if (!receiverAta) {
      receiverAta = getAssociatedTokenAddressSync(this.assetMint, this.walletPublicKey);
    }

    const instructionData = Buffer.from([
      0x01, // Instruction index for retrieve
      ...amount.toArray('le', 8)
    ]);

    return new TransactionInstruction({
      keys: [
        { pubkey: this.walletPublicKey, isSigner: true, isWritable: true },
        { pubkey: receiverAta, isSigner: false, isWritable: true },
        { pubkey: positionPda, isSigner: false, isWritable: true },
        { pubkey: splTokenVaultAuthority, isSigner: false, isWritable: false },
        { pubkey: vaultAta, isSigner: false, isWritable: true },
        { pubkey: this.assetMint, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: ASSOCIATED_TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }
      ],
      programId: this.liquidityManagementProgramId,
      data: instructionData
    });
  }

  constructAddWithdrawalRequestIx(
    owner: PublicKey,
    amount: BN,
    bitcoinAddress: Buffer,
    guardianSetting: PublicKey,
    feeCollector: PublicKey
  ): TransactionInstruction {
    const instructionData = Buffer.from([
      0x02, // Instruction index for withdrawal request
      ...amount.toArray('le', 8),
      ...bitcoinAddress
    ]);

    return new TransactionInstruction({
      keys: [
        { pubkey: owner, isSigner: true, isWritable: true },
        { pubkey: guardianSetting, isSigner: false, isWritable: false },
        { pubkey: feeCollector, isSigner: false, isWritable: true }
      ],
      programId: this.twoWayPegProgramId,
      data: instructionData
    });
  }

  // Transaction Methods
  async signAndSendTransactionWithInstructions(
    instructions: TransactionInstruction[]
  ): Promise<string> {
    const transaction = new Transaction().add(...instructions);
    transaction.feePayer = this.walletPublicKey;
    transaction.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

    const signedTransaction = await this.signTransaction(transaction);
    return await this.connection.sendRawTransaction(signedTransaction.serialize());
  }
}