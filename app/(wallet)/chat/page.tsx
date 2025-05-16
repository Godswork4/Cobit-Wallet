'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Phone, Video, Send } from 'lucide-react';
import Link from 'next/link';

const mockContacts = [
  { id: '1', name: 'Satoshi', avatar: '', address: 'bc1q9s4zpzftf6z9mxwu' },
  { id: '2', name: 'Vitalik', avatar: '', address: 'bc1q7kw2uepjrz3m9u8h' },
  { id: '3', name: 'Alice', avatar: '', address: 'bc1q3s4tpzftf6z9m2wq' },
  { id: '4', name: 'Bob', avatar: '', address: 'bc1q5r7tuepjrz3m4r9j' },
  { id: '5', name: 'Charlie', avatar: '', address: 'bc1q8y6ipzftf6z9m7sz' },
];

export default function ChatPage() {
  const { wallet } = useWallet();
  const [message, setMessage] = useState('');
  
  return (
    <div className="pb-6">
      {/* Header */}
      <div className="p-4 bg-orange-500 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Chat</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-white">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Contact List */}
      <div className="p-4">
        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
          {mockContacts.map((contact) => (
            <Link 
              key={contact.id}
              href={`/chat/${contact.id}`}
              className="flex flex-col items-center min-w-[60px]"
            >
              <Avatar className="h-12 w-12 mb-1 border-2 border-orange-500">
                <AvatarFallback className="bg-orange-100 text-orange-800">
                  {contact.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-center">{contact.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent Chats */}
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-2">Recent</h2>
        
        <div className="space-y-2">
          {mockContacts.map((contact) => (
            <Link key={contact.id} href={`/chat/${contact.id}`}>
              <Card className="p-3 flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback className="bg-orange-100 text-orange-800">
                    {contact.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-gray-500">
                    {contact.id === '1' 
                      ? 'Hey, could you send me 0.001 BTC?' 
                      : 'Last message...'}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  {contact.id === '1' ? '2m ago' : '1d ago'}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}