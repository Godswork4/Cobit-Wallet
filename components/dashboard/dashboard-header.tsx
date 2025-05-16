"use client";

import { useWallet } from "@/contexts/WalletContext";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import router from "next/router";

export default function DashboardHeader() {
  const { wallet } = useWallet();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (wallet?.publicKey) {
      navigator.clipboard.writeText(wallet.publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-500 to-orange-600">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 bg-white text-orange-600">
          <AvatarFallback>
            {wallet?.publicKey
              ? wallet.publicKey.substring(0, 2).toUpperCase()
              : "??"}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3 text-white">
          <p className="text-sm font-medium">Your Balance</p>
          <p className="text-xs opacity-80">
            {wallet?.publicKey.substring(0, 6)}...
            {wallet?.publicKey.substring(wallet.publicKey.length - 4)}
          </p>
        </div>
      </div>

      <div className="flex">
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={() => router.push("/notifications")}
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
