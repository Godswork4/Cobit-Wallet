'use client';

import { Card } from '@/components/ui/card';
import { Bitcoin } from 'lucide-react';

interface BalanceCardProps {
  totalBalance: number;
  bitcoinBalance: number;
}

export default function BalanceCard({ totalBalance, bitcoinBalance }: BalanceCardProps) {
  return (
    <Card className="w-full p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl overflow-hidden relative mt-4">
      <div className="absolute top-0 right-0 opacity-10">
        <Bitcoin className="h-32 w-32 -mt-8 -mr-8" />
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium opacity-80">Total Balance</p>
        <h2 className="text-3xl font-bold">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
      </div>
      
      <div>
        <p className="text-sm font-medium opacity-80">Bitcoin Balance</p>
        <div className="flex items-center">
          <Bitcoin className="h-5 w-5 mr-1" />
          <h3 className="text-xl font-semibold">{bitcoinBalance.toFixed(4)} BTC</h3>
        </div>
      </div>
    </Card>
  );
}