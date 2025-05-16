'use client';

import { Balance } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Bitcoin, Coins } from 'lucide-react';

interface AssetListProps {
  assets: Balance[];
}

export default function AssetList({ assets }: AssetListProps) {
  // Function to get appropriate icon for each asset
  const getAssetIcon = (symbol: string) => {
    switch (symbol) {
      case 'BTC':
        return <Bitcoin className="h-8 w-8 text-orange-500" />;
      case 'SOL':
        return <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">SOL</div>;
      case 'USDC':
        return <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">USD</div>;
      default:
        return <Coins className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-3">
      {assets.map((asset) => (
        <Card key={asset.symbol} className="p-3 flex items-center">
          <div className="bg-gray-100 rounded-full p-2 mr-3">
            {getAssetIcon(asset.symbol)}
          </div>
          
          <div className="flex-1">
            <div className="font-medium">{asset.token}</div>
            <div className="text-sm text-gray-500">{asset.symbol}</div>
          </div>
          
          <div className="text-right">
            <div className="font-semibold">{asset.amount.toLocaleString(undefined, {
              minimumFractionDigits: asset.symbol === 'BTC' ? 4 : 2,
              maximumFractionDigits: asset.symbol === 'BTC' ? 4 : 2,
            })} {asset.symbol}</div>
            <div className="text-sm text-gray-500">${asset.usdValue.toLocaleString()}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}