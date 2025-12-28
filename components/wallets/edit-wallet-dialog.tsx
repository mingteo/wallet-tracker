"use client";

import { useState, useTransition, useEffect } from "react";
import { Loader2, Archive, BarChart3 } from "lucide-react";
import { updateWallet } from "@/app/dashboard/wallets/actions";
import { toast } from "sonner";
import { Wallet, WalletGroup } from "@/types";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/utils/cn";
import { SURPORTED_CURRENCIES } from "@/lib/currencies";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const COLORS = [
  "#22c55e", // Green
  "#3b82f6", // Blue
  "#eab308", // Yellow
  "#ef4444", // Red
  "#a855f7", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
];

type EditWalletDialogProps = {
  wallet: Wallet;
  groups: WalletGroup[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditWalletDialog({
  wallet,
  groups,
  open,
  onOpenChange,
}: EditWalletDialogProps) {
  const [selectedColor, setSelectedColor] = useState(wallet.color || COLORS[0]);
  const [isPending, startTransition] = useTransition();

  const [isArchived, setIsArchived] = useState(wallet.is_archived || false);
  const [isExcluded, setIsExcluded] = useState(
    wallet.exclude_from_stats || false
  );
  const [balance, setBalance] = useState<number>(Number(wallet.balance) || 0);
  const [currency, setCurrency] = useState(wallet.currency || "IDR");

  useEffect(() => {
    setIsArchived(wallet.is_archived || false);
    setIsExcluded(wallet.exclude_from_stats || false);
    setSelectedColor(wallet.color || COLORS[0]);
    setBalance(Number(wallet.balance) || 0);
    setCurrency(wallet.currency || "IDR");
  }, [wallet]);

  async function handleSubmit(formData: FormData) {
    formData.append("color", selectedColor);

    if (!isArchived) formData.append("is_archived", "off");
    if (isArchived) formData.append("is_archived", "on");

    if (!isExcluded) formData.append("exclude_from_stats", "off");
    if (isExcluded) formData.append("exclude_from_stats", "on");

    startTransition(async () => {
      const result = await updateWallet(wallet.id, formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Wallet updated successfully");
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-surface-dark border-white/10">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold text-white text-left">
            Edit Wallet
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Wallet Name
            </label>
            <Input
              name="name"
              type="text"
              defaultValue={wallet.name}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Group
              </label>
              <div className="relative">
                <select
                  name="group_id"
                  defaultValue={wallet.group_id || ""}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-sm h-11"
                >
                  <option value="" className="bg-surface-dark text-text-muted">
                    Select Group
                  </option>
                  {groups.map((group) => (
                    <option
                      key={group.id}
                      value={group.id}
                      className="bg-surface-dark"
                    >
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-sm h-11"
              >
                {SURPORTED_CURRENCIES.map((c) => (
                  <option
                    key={c.code}
                    value={c.code}
                    className="bg-surface-dark"
                  >
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Current Balance
            </label>
            <CurrencyInput
              name="balance"
              value={balance}
              onValueChange={setBalance}
              currencyCode={currency}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Advanced Settings
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-muted">
                  <Archive className="w-4 h-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  Archive Wallet
                </span>
              </div>
              <Switch checked={isArchived} onCheckedChange={setIsArchived} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-muted">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <span className="text-sm text-text-secondary">
                  Exclude from Stats
                </span>
              </div>
              <Switch checked={isExcluded} onCheckedChange={setIsExcluded} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Color Tag
            </label>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all duration-300",
                    selectedColor === color
                      ? "ring-2 ring-white scale-110"
                      : "hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-white/5 text-white py-3 rounded-xl font-medium hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-brand-primary text-white py-3 rounded-xl font-medium hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
