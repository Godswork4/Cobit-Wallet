'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  ChevronRight, 
  Search, 
  Scan, 
  Clipboard, 
  Bitcoin 
} from 'lucide-react';
import { toast } from 'sonner';

const mockContacts = [
  { id: '1', name: 'Satoshi', avatar: '', address: 'bc1q9s4zpzftf6z9mxwu' },
  { id: '2', name: 'Vitalik', avatar: '', address: 'bc1q7kw2uepjrz3m9u8h' },
  { id: '3', name: 'Alice', avatar: '', address: 'bc1q3s4tpzftf6z9m2wq' },
  { id: '4', name: 'Bob', avatar: '', address: 'bc1q5r7tuepjrz3m4r9j' },
  { id: '5', name: 'Charlie', avatar: '', address: 'bc1q8y6ipzftf6z9m7sz' },
];

export default function SendPage() {
  const router = useRouter();
  const { balances, sendBitcoin } = useWallet();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0.001);
  const [percentage, setPercentage] = useState(25);
  const [step, setStep] = useState(1);
  
  const bitcoinBalance = balances.find(b => b.symbol === 'BTC')?.amount || 0;
  const usdValue = amount * (balances.find(b => b.symbol === 'BTC')?.usdValue || 0) / bitcoinBalance;
  
  const handleRecipientSelect = (address: string) => {
    setRecipient(address);
    setStep(2);
  };
  
  const handleSliderChange = (value: number[]) => {
    const percent = value[0];
    setPercentage(percent);
    setAmount(Number(((bitcoinBalance * percent) / 100).toFixed(8)));
  };
  
  const handlePresetPercentage = (percent: number) => {
    setPercentage(percent);
    setAmount(Number(((bitcoinBalance * percent) / 100).toFixed(8)));
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(value);
    setPercentage(Math.min(100, (value / bitcoinBalance) * 100));
  };
  
  const handleSend = async () => {
    setStep(3);
    
    // Simulate transaction processing
    setTimeout(async () => {
      const success = await sendBitcoin(recipient, amount);
      if (success) {
        router.push('/dashboard');
      }
    }, 2000);
  };
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRecipient(text);
      toast.success('Address pasted from clipboard');
    } catch (err) {
      toast.error('Failed to read clipboard');
    }
  };
  
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="p-4 bg-orange-500 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white mr-2"
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-white">Send Bitcoin</h1>
      </div>
      
      {/* Step 1: Select Recipient */}
      {step === 1 && (
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Send to</p>
            <div className="flex gap-2 mb-4">
              <Input
                className="flex-1"
                placeholder="Bitcoin address or name"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
              <Button variant="outline" size="icon" onClick={handlePaste}>
                <Clipboard className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Scan className="h-5 w-5" />
              </Button>
            </div>
            
            {recipient && (
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            )}
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Recent contacts</h2>
            <div className="space-y-2">
              {mockContacts.map((contact) => (
                <Card 
                  key={contact.id} 
                  className="p-3 flex items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRecipientSelect(contact.address)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-orange-100 text-orange-800">
                      {contact.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-xs text-gray-500">
                      {contact.address.substring(0, 12)}...
                    </div>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Step 2: Enter Amount */}
      {step === 2 && (
        <div className="p-4">
          <Card className="p-4 mb-4">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">Available: {bitcoinBalance.toFixed(8)} BTC</p>
              <div className="flex items-center justify-center mt-2">
                <Bitcoin className="h-6 w-6 text-orange-500 mr-2" />
                <Input
                  className="w-32 text-center font-bold text-lg"
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
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Recipient</span>
                <span className="font-medium">
                  {recipient.substring(0, 8)}...{recipient.substring(recipient.length - 4)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Network Fee</span>
                <span className="font-medium">0.00005 BTC</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-medium">{(amount + 0.00005).toFixed(8)} BTC</span>
              </div>
            </div>
          </Card>
          
          <Button 
            className="w-full bg-orange-500 hover:bg-orange-600"
            onClick={handleSend}
            disabled={amount <= 0 || amount > bitcoinBalance}
          >
            Review Send
          </Button>
        </div>
      )}
      
      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="p-4 text-center">
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Processing Transaction</h2>
          <p className="text-gray-500 mb-4">Please wait while we process your transaction...</p>
          <Card className="p-4 mb-4 text-left">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">{amount.toFixed(8)} BTC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Recipient</span>
                <span className="font-medium">
                  {recipient.substring(0, 8)}...{recipient.substring(recipient.length - 4)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Network Fee</span>
                <span className="font-medium">0.00005 BTC</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-medium">{(amount + 0.00005).toFixed(8)} BTC</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}