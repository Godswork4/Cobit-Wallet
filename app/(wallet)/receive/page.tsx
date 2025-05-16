'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Copy, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from '@/components/ui/qrcode';

export default function ReceivePage() {
  const router = useRouter();
  const { wallet, balances } = useWallet();
  const [selectedToken, setSelectedToken] = useState('BTC');
  
  const handleCopy = () => {
    if (wallet?.publicKey) {
      navigator.clipboard.writeText(wallet.publicKey);
      toast.success('Address copied to clipboard');
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
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-white">Receive Crypto</h1>
      </div>
      
      <div className="p-4">
        <Tabs defaultValue="BTC" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="BTC" onClick={() => setSelectedToken('BTC')}>Bitcoin</TabsTrigger>
            <TabsTrigger value="SOL" onClick={() => setSelectedToken('SOL')}>Solana</TabsTrigger>
            <TabsTrigger value="USDC" onClick={() => setSelectedToken('USDC')}>USDC</TabsTrigger>
          </TabsList>
          
          <TabsContent value="BTC" className="mt-0">
            <Card className="p-6 flex flex-col items-center">
              <div className="w-full max-w-[250px] aspect-square bg-white p-4 rounded-lg mb-4">
                <QRCode 
                  value={wallet?.publicKey || ''} 
                  size={250}
                />
              </div>
              
              <p className="text-sm text-gray-500 mb-2">Your Bitcoin Address</p>
              <p className="text-xs text-center mb-4 font-mono bg-gray-100 p-2 rounded break-all">
                {wallet?.publicKey}
              </p>
              
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </Card>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Send only Bitcoin (BTC) to this address.</p>
              <p>Sending any other coins may result in permanent loss.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="SOL" className="mt-0">
            <Card className="p-6 flex flex-col items-center">
              <div className="w-full max-w-[250px] aspect-square bg-white p-4 rounded-lg mb-4">
                <QRCode 
                  value={wallet?.publicKey || ''} 
                  size={250}
                />
              </div>
              
              <p className="text-sm text-gray-500 mb-2">Your Solana Address</p>
              <p className="text-xs text-center mb-4 font-mono bg-gray-100 p-2 rounded break-all">
                {wallet?.publicKey}
              </p>
              
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </Card>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Send only Solana (SOL) to this address.</p>
              <p>Sending any other coins may result in permanent loss.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="USDC" className="mt-0">
            <Card className="p-6 flex flex-col items-center">
              <div className="w-full max-w-[250px] aspect-square bg-white p-4 rounded-lg mb-4">
                <QRCode 
                  value={wallet?.publicKey || ''} 
                  size={250}
                />
              </div>
              
              <p className="text-sm text-gray-500 mb-2">Your USDC Address</p>
              <p className="text-xs text-center mb-4 font-mono bg-gray-100 p-2 rounded break-all">
                {wallet?.publicKey}
              </p>
              
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </Card>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Send only USDC to this address.</p>
              <p>Sending any other coins may result in permanent loss.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}