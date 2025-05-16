'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  ArrowDown, 
  RotateCw, 
  Settings,
  Bitcoin,
  Timer
} from 'lucide-react';

export default function SwapPage() {
  const router = useRouter();
  const { balances, swapTokens } = useWallet();
  
  const [fromToken, setFromToken] = useState('BTC');
  const [toToken, setToToken] = useState('SOL');
  const [fromAmount, setFromAmount] = useState(0.001);
  const [toAmount, setToAmount] = useState(0);
  const [percentage, setPercentage] = useState(25);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [slippage, setSlippage] = useState(0.5);
  const [isSwapping, setIsSwapping] = useState(false);
  
  const fromBalance = balances.find(b => b.symbol === fromToken)?.amount || 0;
  
  useEffect(() => {
    // Simulate exchange rate calculation
    let rate = 0;
    
    if (fromToken === 'BTC' && toToken === 'SOL') {
      rate = 137.1; // 1 BTC = 137.1 SOL
    } else if (fromToken === 'BTC' && toToken === 'USDC') {
      rate = 60975; // 1 BTC = 60975 USDC
    } else if (fromToken === 'SOL' && toToken === 'BTC') {
      rate = 0.0073; // 1 SOL = 0.0073 BTC
    } else if (fromToken === 'SOL' && toToken === 'USDC') {
      rate = 445; // 1 SOL = 445 USDC
    } else if (fromToken === 'USDC' && toToken === 'BTC') {
      rate = 0.000016; // 1 USDC = 0.000016 BTC
    } else if (fromToken === 'USDC' && toToken === 'SOL') {
      rate = 0.00225; // 1 USDC = 0.00225 SOL
    }
    
    setExchangeRate(rate);
    setToAmount(fromAmount * rate);
  }, [fromToken, toToken, fromAmount]);
  
  const handleTokenSwap = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
  };
  
  const handleSliderChange = (value: number[]) => {
    const percent = value[0];
    setPercentage(percent);
    setFromAmount(Number(((fromBalance * percent) / 100).toFixed(8)));
  };
  
  const handlePresetPercentage = (percent: number) => {
    setPercentage(percent);
    setFromAmount(Number(((fromBalance * percent) / 100).toFixed(8)));
  };
  
  const handleSwap = async () => {
    setIsSwapping(true);
    
    // Simulate transaction processing
    setTimeout(async () => {
      const success = await swapTokens(fromToken, toToken, fromAmount);
      setIsSwapping(false);
      if (success) {
        router.push('/dashboard');
      }
    }, 2000);
  };
  
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="p-4 bg-orange-500 flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white mr-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Swap</h1>
        </div>
        
        <Button variant="ghost" size="icon" className="text-white">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-4">
        <Card className="p-4 mb-4">
          {/* From Token */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>From</span>
              <span>Balance: {fromBalance.toFixed(fromToken === 'BTC' ? 8 : 2)} {fromToken}</span>
            </div>
            
            <div className="flex gap-2">
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                className="flex-1 text-right"
                value={fromAmount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFromAmount(value);
                  setPercentage(Math.min(100, (value / fromBalance) * 100));
                }}
                type="number"
                step={fromToken === 'BTC' ? '0.00000001' : '0.01'}
                min="0"
                max={fromBalance}
              />
            </div>
            
            <div className="mt-2">
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
          </div>
          
          {/* Swap Button */}
          <div className="flex justify-center my-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="bg-orange-100 hover:bg-orange-200 rounded-full"
              onClick={handleTokenSwap}
            >
              <ArrowDown className="h-5 w-5 text-orange-500" />
            </Button>
          </div>
          
          {/* To Token */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>To (estimated)</span>
              <span></span>
            </div>
            
            <div className="flex gap-2">
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                className="flex-1 text-right"
                value={toAmount.toFixed(toToken === 'BTC' ? 8 : 2)}
                readOnly
              />
            </div>
          </div>
          
          {/* Exchange Rate */}
          <div className="text-sm text-gray-500 mb-4">
            <div className="flex justify-between mb-1">
              <span>Exchange Rate</span>
              <span>1 {fromToken} ≈ {exchangeRate.toFixed(toToken === 'BTC' ? 8 : 2)} {toToken}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Network Fee</span>
              <span>0.00005 BTC</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Slippage Tolerance</span>
              <span>{slippage}%</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Minimum Received</span>
              <span>{(toAmount * (1 - slippage / 100)).toFixed(toToken === 'BTC' ? 8 : 2)} {toToken}</span>
            </div>
          </div>
          
          {/* Provider List */}
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">Provider</div>
            <Card className="p-3 flex items-center bg-blue-50 border-blue-200">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">J</div>
              </div>
              
              <div className="flex-1">
                <div className="font-medium">Jupiter</div>
                <div className="text-xs text-gray-500">Best Price</div>
              </div>
              
              <div className="text-sm font-medium">
                {toAmount.toFixed(toToken === 'BTC' ? 8 : 2)} {toToken}
              </div>
            </Card>
          </div>
        </Card>
        
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={handleSwap}
          disabled={isSwapping || fromAmount <= 0 || fromAmount > fromBalance}
        >
          {isSwapping ? (
            <>
              <RotateCw className="h-4 w-4 mr-2 animate-spin" />
              Swapping...
            </>
          ) : (
            `Swap ${fromAmount.toFixed(fromToken === 'BTC' ? 8 : 2)} ${fromToken} to ${toAmount.toFixed(toToken === 'BTC' ? 8 : 2)} ${toToken}`
          )}
        </Button>
      </div>
    </div>
  );
}