'use client';

import { useWallet } from '@/contexts/WalletContext';
import BottomNavigation from '@/components/navigation/bottom-navigation';
import LoadingScreen from '@/components/loading-screen';

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useWallet();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-16">{children}</main>
      <BottomNavigation />
    </div>
  );
}