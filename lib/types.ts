// Core Types
export interface Wallet {
  publicKey: string;
  privateKey?: string;
  bitcoinAddress?: string; // Taproot address
  xOnlyPubKey?: string; // For Taproot
}

export interface Balance {
  token: string;
  symbol: string;
  amount: number;
  usdValue: number;
  icon: string;
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'swapped' | 'deposit' | 'withdraw';
  token: string;
  amount: number;
  date: Date;
  address: string;
  status: InteractionStatus;
  steps?: TransactionStep[];
}

// Zeus Protocol Types
export enum InteractionStatus {
  BitcoinDepositToHotReserve = 'BitcoinDepositToHotReserve',
  VerifyDepositToHotReserveTransaction = 'VerifyDepositToHotReserveTransaction',
  SolanaDepositToHotReserve = 'SolanaDepositToHotReserve',
  AddLockToColdReserveProposal = 'AddLockToColdReserveProposal',
  BitcoinLockToColdReserve = 'BitcoinLockToColdReserve',
  VerifyLockToColdReserveTransaction = 'VerifyLockToColdReserveTransaction',
  SolanaLockToColdReserve = 'SolanaLockToColdReserve',
  Peg = 'Peg',
  AddWithdrawalRequest = 'AddWithdrawalRequest',
  AddUnlockToUserProposal = 'AddUnlockToUserProposal',
  BitcoinUnlockToUser = 'BitcoinUnlockToUser',
  VerifyUnlockToUserTransaction = 'VerifyUnlockToUserTransaction',
  SolanaUnlockToUser = 'SolanaUnlockToUser',
  Unpeg = 'Unpeg',
  DeprecateWithdrawalRequest = 'DeprecateWithdrawalRequest'
}

export interface TransactionStep {
  transaction: string;
  chain: 'Bitcoin' | 'Solana';
  action: string;
  timestamp: number;
}

export interface HotReserveBucket {
  owner: string;
  taprootXOnlyPublicKey: string;
  scriptPathSpendPublicKey: string;
  guardianSetting: string;
  status: 'active' | 'expired' | 'deactivated';
}

export interface Position {
  storedAmount: BN;
  frozenAmount: BN;
  guardianSetting: string;
}

export interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  provider: string;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  active: boolean;
}