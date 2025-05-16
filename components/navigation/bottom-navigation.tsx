'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Repeat, MessageCircle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Swap', href: '/swap', icon: Repeat },
  { name: 'Chat', href: '/chat', icon: MessageCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white">
      <nav className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center py-2 px-4',
                isActive
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'w-6 h-6',
                  isActive ? 'text-orange-500' : 'text-gray-500'
                )}
              />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}