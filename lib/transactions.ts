'use client';

import { Transaction } from './types';

/**
 * Get transaction history for a wallet address
 * This is a mock function - in a real app this would query the blockchain
 */
export async function getTransactionHistory(walletAddress: string): Promise<Transaction[]> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Mock data - in a real app, this would fetch from a blockchain API
  const now = new Date();
  
  return [
    {
      id: 'tx1',
      type: 'received',
      token: 'BTC',
      amount: 0.0021,
      date: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      address: 'bc1q9s4zpzftf6z9mxwu',
      status: 'completed'
    },
    {
      id: 'tx2',
      type: 'sent',
      token: 'BTC',
      amount: 0.0015,
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      address: 'bc1q7kw2uepjrz3m9u8h',
      status: 'completed'
    },
    {
      id: 'tx3',
      type: 'swapped',
      token: 'SOL',
      amount: 1.5,
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      address: 'sol1a2b3c4d5e6f7g8h9i',
      status: 'completed'
    }
  ];
}