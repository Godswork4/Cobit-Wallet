'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Video, MoreVertical, Send, ArrowLeft, Bitcoin } from 'lucide-react';
import Link from 'next/link';
import ChatMessage from '@/components/chat/chat-message';
import BitcoinTransfer from '@/components/chat/bitcoin-transfer';

const mockContacts = [
  { id: '1', name: 'Satoshi', avatar: '', address: 'bc1q9s4zpzftf6z9mxwu' },
  { id: '2', name: 'Vitalik', avatar: '', address: 'bc1q7kw2uepjrz3m9u8h' },
  { id: '3', name: 'Alice', avatar: '', address: 'bc1q3s4tpzftf6z9m2wq' },
  { id: '4', name: 'Bob', avatar: '', address: 'bc1q5r7tuepjrz3m4r9j' },
  { id: '5', name: 'Charlie', avatar: '', address: 'bc1q8y6ipzftf6z9m7sz' },
];

const mockMessages = [
  { id: '1', sender: 'contact', content: 'Hey there!', timestamp: '10:30 AM' },
  { id: '2', sender: 'me', content: 'Hi! How are you?', timestamp: '10:31 AM' },
  { id: '3', sender: 'contact', content: 'I\'m good, thanks. Could you send me 0.001 BTC?', timestamp: '10:32 AM' },
  { id: '4', sender: 'me', content: 'Sure, I can do that.', timestamp: '10:33 AM' },
];

export default function ChatDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { wallet, sendBitcoin } = useWallet();
  
  const [message, setMessage] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);
  
  const contact = mockContacts.find(c => c.id === id);
  
  if (!contact) {
    return <div>Contact not found</div>;
  }
  
  const handleSend = () => {
    if (message.trim()) {
      // Add message to chat
      setMessage('');
    }
  };
  
  const handleSendBitcoin = async (amount: number) => {
    const success = await sendBitcoin(contact.address, amount);
    if (success) {
      setShowTransfer(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
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
          
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback className="bg-orange-100 text-orange-800">
              {contact.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-lg font-bold text-white">{contact.name}</h1>
            <p className="text-xs text-white text-opacity-80">Online</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-white">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {mockMessages.map((msg) => (
          <ChatMessage
            key={msg.id}
            content={msg.content}
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
        ))}
      </div>
      
      {/* Bitcoin Transfer */}
      {showTransfer && (
        <BitcoinTransfer
          contactName={contact.name}
          onClose={() => setShowTransfer(false)}
          onSend={handleSendBitcoin}
        />
      )}
      
      {/* Input Area */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            className="text-orange-500 border-orange-200"
            onClick={() => setShowTransfer(true)}
          >
            <Bitcoin className="h-5 w-5" />
          </Button>
          
          <Input
            className="flex-1"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-orange-500"
            onClick={handleSend}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}