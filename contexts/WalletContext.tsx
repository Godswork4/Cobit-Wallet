"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { getOrCreateWallet } from "@/lib/wallet";
import { getBalances } from "@/lib/balances";
import { getTransactionHistory } from "@/lib/transactions";
import { Wallet, Balance, Transaction } from "@/lib/types";

interface WalletContextType {
  wallet: Wallet | null;
  balances: Balance[];
  transactions: Transaction[];
  loading: boolean;
  refreshWallet: () => Promise<void>;
  sendBitcoin: (to: string, amount: number) => Promise<boolean>;
  swapTokens: (from: string, to: string, amount: number) => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWallet = async () => {
    try {
      setLoading(true);
      // Get or create wallet
      const walletData = await getOrCreateWallet();
      setWallet({ ...walletData, publicKey: walletData.publicKey.toString() });

      // Get balances
      const balanceData = await getBalances(walletData.publicKey.toString());
      setBalances(balanceData);

      // Get transaction history
      const txHistory = await getTransactionHistory(
        walletData.publicKey.toString()
      );
      setTransactions(txHistory);
    } catch (error) {
      console.error("Error refreshing wallet:", error);
      toast.error("Failed to refresh wallet data");
    } finally {
      setLoading(false);
    }
  };

  const sendBitcoin = async (to: string, amount: number): Promise<boolean> => {
    try {
      setLoading(true);
      // Implementation will be added
      toast.success(`Sent ${amount} BTC to ${to.substring(0, 8)}...`);
      await refreshWallet();
      return true;
    } catch (error) {
      console.error("Error sending Bitcoin:", error);
      toast.error("Failed to send Bitcoin");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const swapTokens = async (
    from: string,
    to: string,
    amount: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      // Implementation will be added
      toast.success(`Swapped ${amount} ${from} to ${to}`);
      await refreshWallet();
      return true;
    } catch (error) {
      console.error("Error swapping tokens:", error);
      toast.error("Failed to swap tokens");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWallet();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        balances,
        transactions,
        loading,
        refreshWallet,
        sendBitcoin,
        swapTokens,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
