"use client";

import { Wallet, WalletGroup } from "@/types";
import { formatCurrency } from "@/utils/format";
import {
  CreditCard,
  Wallet as WalletIcon,
  Landmark,
  Smartphone,
  Archive,
  Ban,
  EyeOff,
} from "lucide-react";
import { WalletActionsMenu } from "./wallet-actions-menu";

const iconMap: Record<string, any> = {
  banknote: WalletIcon,
  landmark: Landmark,
  smartphone: Smartphone,
  "credit-card": CreditCard,
};

export function WalletCard({
  wallet,
  groups,
}: {
  wallet: Wallet;
  groups: WalletGroup[];
}) {
  const Icon =
    wallet.wallet_groups?.icon && iconMap[wallet.wallet_groups.icon]
      ? iconMap[wallet.wallet_groups.icon]
      : WalletIcon;

  // Visual tweaks based on state
  const isArchived = wallet.is_archived;
  const isExcluded = wallet.exclude_from_stats;

  return (
    <div
      className={`glass-panel rounded-2xl group hover:border-brand-primary/30 transition-all duration-300 relative ${
        isArchived ? "opacity-70 grayscale-[0.5]" : ""
      }`}
    >
      {/* Background Gradient Blob Container - Handles Overflow */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl z-0 pointer-events-none">
        <div
          className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl transition-all group-hover:opacity-20"
          style={{ backgroundColor: wallet.color }}
        />
      </div>

      <div className="p-5 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg relative"
              style={{ backgroundColor: wallet.color }}
            >
              <Icon className="w-5 h-5" />
              {isArchived && (
                <div className="absolute -bottom-1 -right-1 bg-surface-dark rounded-full p-0.5 border border-white/10">
                  <Archive className="w-3 h-3 text-text-muted" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-white font-medium ${
                    isArchived ? " decoration-white/30" : ""
                  }`}
                >
                  {wallet.name}
                </h3>
                {isExcluded && !isArchived && (
                  <div className="group/tooltip relative">
                    <EyeOff className="w-3 h-3 text-text-muted cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all pointer-events-none z-20">
                      Excluded from stats
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-text-muted">
                {wallet.wallet_groups?.name || "Uncategorized"}
                {isArchived ? (
                  <span className="text-white"> • Archived</span>
                ) : (
                  ""
                )}
              </p>
            </div>
          </div>

          <WalletActionsMenu wallet={wallet} groups={groups} />
        </div>

        <div>
          <p className="text-xs text-text-muted mb-1">Current Balance</p>
          <p className="text-xl font-bold text-white tracking-tight">
            {formatCurrency(wallet.balance, wallet.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}
