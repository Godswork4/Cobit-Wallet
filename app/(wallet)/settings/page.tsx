'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useWallet } from '@/contexts/WalletContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ChevronRight, 
  Moon, 
  Shield, 
  Bell, 
  Languages, 
  HelpCircle, 
  LogOut,
  Github
} from 'lucide-react';
import { clearWallet } from '@/lib/wallet';

export default function SettingsPage() {
  const router = useRouter();
  const { wallet, refreshWallet } = useWallet();
  const { theme, setTheme } = useTheme();
  
  const handleLogout = () => {
    clearWallet();
    refreshWallet();
    router.push('/');
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
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </div>
      
      <div className="p-4 space-y-4">
        <Card className="divide-y">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Moon className="h-5 w-5 mr-3 text-gray-500" />
              <span>Dark Mode</span>
            </div>
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
            />
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-3 text-gray-500" />
              <span>Security</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-3 text-gray-500" />
              <span>Notifications</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Languages className="h-5 w-5 mr-3 text-gray-500" />
              <span>Language</span>
            </div>
            <div className="text-sm text-gray-500">English</div>
          </div>
        </Card>
        
        <Card className="divide-y">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-3 text-gray-500" />
              <span>Help & Support</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Github className="h-5 w-5 mr-3 text-gray-500" />
              <span>About</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-xs text-gray-500 mb-4">
            <p>Wallet Address</p>
            <p className="font-mono mt-1 break-all">{wallet?.publicKey}</p>
          </div>
          
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </Card>
        
        <div className="text-center text-xs text-gray-500 mt-8">
          <p>Cobit Wallet v1.0.0</p>
          <p>Bitcoin on Solana</p>
        </div>
      </div>
    </div>
  );
}