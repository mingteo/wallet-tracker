"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, Archive, BarChart3 } from "lucide-react";
import { createWallet } from "@/app/dashboard/wallets/actions";
import { toast } from "sonner";
import { WalletGroup } from "@/types";
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
  DialogTrigger,
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

export function CreateWalletDialog({ groups }: { groups: WalletGroup[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isPending, startTransition] = useTransition();
  const [isArchived, setIsArchived] = useState(false);
  const [isExcluded, setIsExcluded] = useState(false);
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [currency, setCurrency] = useState("IDR");

  async function handleSubmit(formData: FormData) {
    formData.append("color", selectedColor);

    if (!isArchived) formData.append("is_archived", "off");
    if (isArchived) formData.append("is_archived", "on");

    if (!isExcluded) formData.append("exclude_from_stats", "off");
    if (isExcluded) formData.append("exclude_from_stats", "on");

    startTransition(async () => {
      const result = await createWallet(formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Wallet created successfully");
        setIsOpen(false);
        setIsArchived(false);
        setIsExcluded(false);
        setSelectedColor(COLORS[0]);
        setInitialBalance(0);
        setCurrency("IDR");
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-brand-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Add Wallet
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-surface-dark border-white/10">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold text-white text-left">
            Add New Wallet
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Wallet Name
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Main Account"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
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
                <div className="absolute right-3 top-3 pointer-events-none">
                  <Plus className="w-4 h-4 text-text-muted rotate-45" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                name="currency"
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
              Initial Balance
            </label>
            <CurrencyInput
              name="balance"
              value={initialBalance}
              onValueChange={setInitialBalance}
              currencyCode={currency}
              placeholder="0"
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

          <div className="pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-brand-primary text-white py-3 rounded-xl font-medium hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Wallet"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
