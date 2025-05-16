'use client';

import { Balance } from './types';

/**
 * Get balances for a wallet address
 * This is a mock function - in a real app this would query the blockchain
 */
export async function getBalances(walletAddress: string): Promise<Balance[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data - in a real app, this would fetch from a blockchain API
  return [
    {
      token: 'Bitcoin',
      symbol: 'BTC',
      amount: 0.0385,
      usdValue: 2347.53,
      icon: '/icons/bitcoin.svg'
    },
    {
      token: 'Solana',
      symbol: 'SOL',
      amount: 2.5,
      usdValue: 342.75,
      icon: '/icons/solana.svg'
    },
    {
      token: 'USD Coin',
      symbol: 'USDC',
      amount: 150,
      usdValue: 150,
      icon: '/icons/usdc.svg'
    }
  ];
}

/**
 * Get total portfolio value in USD
 */
export function getTotalBalance(balances: Balance[]): number {
  return balances.reduce((total, balance) => total + balance.usdValue, 0);
}