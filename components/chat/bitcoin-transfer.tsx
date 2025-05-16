'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Bitcoin, X } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

interface BitcoinTransferProps {
  contactName: string;
  onClose: () => void;
  onSend: (amount: number) => void;
}

export default function BitcoinTransfer({ contactName, onClose, onSend }: BitcoinTransferProps) {
  const { balances } = useWallet();
  const [amount, setAmount] = useState(0.001);
  const [percentage, setPercentage] = useState(25);
  
  const bitcoinBalance = balances.find(b => b.symbol === 'BTC')?.amount || 0;
  const usdValue = amount * (balances.find(b => b.symbol === 'BTC')?.usdValue || 0) / bitcoinBalance;
  
  const handleSliderChange = (value: number[]) => {
    const percent = value[0];
    setPercentage(percent);
    setAmount(Number(((bitcoinBalance * percent) / 100).toFixed(8)));
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(value);
    setPercentage(Math.min(100, (value / bitcoinBalance) * 100));
  };
  
  const handlePresetPercentage = (percent: number) => {
    setPercentage(percent);
    setAmount(Number(((bitcoinBalance * percent) / 100).toFixed(8)));
  };
  
  return (
    <Card className="m-4 p-4 bg-orange-50 border-orange-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Send Bitcoin</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">Balance: {bitcoinBalance.toFixed(8)} BTC</p>
        <div className="flex items-center justify-center mt-2">
          <Bitcoin className="h-6 w-6 text-orange-500 mr-2" />
          <Input
            className="w-32 text-center font-bold text-lg bg-transparent border-none focus-visible:ring-0"
            value={amount}
            onChange={handleAmountChange}
            type="number"
            step="0.00000001"
            min="0"
            max={bitcoinBalance}
          />
        </div>
        <p className="text-sm text-gray-500">${usdValue.toFixed(2)} USD</p>
      </div>
      
      <div className="mb-6">
        <Slider
          value={[percentage]}
          onValueChange={handleSliderChange}
          max={100}
          step={1}
        />
        
        <div className="flex justify-between mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => handlePresetPercentage(25)}
          >
            25%
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => handlePresetPercentage(50)}
          >
            50%
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => handlePresetPercentage(75)}
          >
            75%
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => handlePresetPercentage(100)}
          >
            Max
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <p className="text-xs text-gray-500">Network Fee: 0.00005 BTC</p>
        <p className="text-xs text-gray-500">Total Amount: {(amount + 0.00005).toFixed(8)} BTC</p>
      </div>
      
      <Button 
        className="w-full mt-4 bg-orange-500 hover:bg-orange-600"
        onClick={() => onSend(amount)}
      >
        Send {amount} BTC to {contactName}
      </Button>
    </Card>
  );
}