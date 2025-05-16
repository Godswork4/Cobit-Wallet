'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import LoadingScreen from '@/components/loading-screen';

export default function Home() {
  const router = useRouter();
  const { wallet, loading } = useWallet();

  useEffect(() => {
    if (!loading) {
      if (wallet) {
        router.push('/dashboard');
      } else {
        router.push('/create-wallet');
      }
    }
  }, [loading, wallet, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  return null;
}