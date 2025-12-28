import { getWallets, getWalletGroups } from "./actions";
import { WalletCard } from "@/components/wallets/wallet-card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { CreateWalletDialog } from "@/components/wallets/create-wallet-dialog";

export default async function WalletsPage() {
  const [wallets, groups] = await Promise.all([
    getWallets(),
    getWalletGroups(),
  ]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Wallets</h1>
          <p className="text-text-muted text-sm mt-1">
            Manage all your accounts in one place
          </p>
        </div>

        <CreateWalletDialog groups={groups} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.length > 0 ? (
          wallets.map((wallet: any, index: number) => (
            <div
              key={wallet.id}
              className="animate-in fade-in zoom-in-95 duration-500 fill-mode-backwards"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <WalletCard wallet={wallet} groups={groups} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center glass-panel rounded-2xl border-dashed border-white/10 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-white font-medium mb-1">No wallets found</h3>
            <p className="text-text-muted text-sm max-w-sm mx-auto">
              Start by creating your first wallet to track your finances.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
