"use client";

import { Keypair } from "@solana/web3.js";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";

const WALLET_STORAGE_KEY = "cobit-wallet";
const MNEMONIC_KEY = "cobit-mnemonic";

export interface WalletData {
  publicKey: string;
  mnemonic?: string;
}

/**
 * Generate a 24-word mnemonic phrase
 */
export function generateMnemonic(): string {
  return bip39.generateMnemonic(256); // 24 words
}

/**
 * Create a Solana Keypair from a mnemonic using the standard Solana derivation path
 */
export async function createWalletFromMnemonic(
  mnemonic: string
): Promise<Keypair> {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString("hex")).key;
  return Keypair.fromSeed(Uint8Array.from(derivedSeed));
}

/**
 * Validate if a given mnemonic phrase is valid
 */
export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}

/**
 * Store wallet data in localStorage
 */
export function storeWallet(wallet: WalletData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
}

/**
 * Retrieve wallet data from localStorage
 */
export function getStoredWallet(): WalletData | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(WALLET_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Clear wallet data from localStorage
 */
export function clearWallet(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(WALLET_STORAGE_KEY);
  localStorage.removeItem(MNEMONIC_KEY);
}

/**
 * Get or create a new Solana wallet
 */
export async function getOrCreateWallet(): Promise<Keypair> {
  const stored = getStoredWallet();

  if (stored?.mnemonic && validateMnemonic(stored.mnemonic)) {
    return await createWalletFromMnemonic(stored.mnemonic);
  }

  const mnemonic = generateMnemonic();
  const keypair = await createWalletFromMnemonic(mnemonic);
  storeWallet({
    publicKey: keypair.publicKey.toBase58(),
    mnemonic,
  });

  return keypair;
}
