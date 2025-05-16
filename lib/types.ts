// Wallet Types
export interface Wallet {
  publicKey: string;
  privateKey?: string; // Only in memory, never stored directly
}

export interface Balance {
  token: string;
  symbol: string;
  amount: number;
  usdValue: number;
  icon: string;
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'swapped';
  token: string;
  amount: number;
  date: Date;
  address: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface Contact {
  id: string;
  name: string;
  address: string;
  avatar: string;
}

export interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  provider: string;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  active: boolean;
}