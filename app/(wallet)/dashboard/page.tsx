"use client";

import { useWallet } from "@/contexts/WalletContext";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import BalanceCard from "@/components/dashboard/balance-card";
import AssetList from "@/components/dashboard/asset-list";
import ActivityList from "@/components/dashboard/activity-list";
import { getTotalBalance } from "@/lib/balances";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ArrowUpFromLine, coins, Repeat } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { balances, transactions } = useWallet();
  const router = useRouter();

  const totalBalance = getTotalBalance(balances);

  return (
    <div className="pb-6">
      <DashboardHeader />

      <div className="px-4">
        <BalanceCard
          totalBalance={totalBalance}
          bitcoinBalance={balances.find((b) => b.symbol === "BTC")?.amount || 0}
        />

        <div className="flex justify-between gap-2 mt-6">
          <Button
            variant="outline"
            className="flex-1 flex flex-col items-center bg-purple-50 border-purple-100 hover:bg-purple-100 py-3"
            onClick={() => router.push("/receive")}
          >
            <ArrowDownToLine className="h-5 w-5 text-purple-600 mb-1" />
            <span className="text-xs text-purple-700">Receive</span>
          </Button>

          <Button
            variant="outline"
            className="flex-1 flex flex-col items-center bg-orange-50 border-orange-100 hover:bg-orange-100 py-3"
            onClick={() => router.push("/send")}
          >
            <ArrowUpFromLine className="h-5 w-5 text-orange-600 mb-1" />
            <span className="text-xs text-orange-700">Send</span>
          </Button>

          <Button
            variant="outline"
            className="flex-1 flex flex-col items-center bg-blue-50 border-blue-100 hover:bg-blue-100 py-3"
            onClick={() => router.push("/swap")}
          >
            <Repeat className="h-5 w-5 text-blue-600 mb-1" />
            <span className="text-xs text-blue-700">Swap</span>
          </Button>

          <Button
            variant="outline"
            className="flex-1 flex flex-col items-center bg-green-50 border-green-100 hover:bg-green-100 py-3"
          >
            <coins className="h-5 w-5 text-green-600 mb-1" />
            <span className="text-xs text-green-700">Mint</span>
          </Button>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Assets</h2>
            <Button variant="link" size="sm" className="text-orange-500">
              See all
            </Button>
          </div>
          <AssetList assets={balances} />
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Button variant="link" size="sm" className="text-orange-500">
              See all
            </Button>
          </div>
          <ActivityList activities={transactions} />
        </div>
      </div>
    </div>
  );
}
