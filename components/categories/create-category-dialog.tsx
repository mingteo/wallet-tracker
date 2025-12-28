"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { createCategory } from "@/app/dashboard/categories/actions";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const EMOJIS = [
  "💰",
  "💸",
  "💳",
  "🏦",
  "🧾",
  "🛍️",
  "🛒",
  "🥩",
  "🍔",
  "🍕",
  "🚗",
  "⛽",
  "🚌",
  "🏠",
  "💡",
  "💧",
  "📱",
  "💊",
  "🎓",
  "✈️",
  "🎮",
  "🎵",
  "🎁",
  "👶",
  "🐶",
];

export function CreateCategoryDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(EMOJIS[0]);
  const [type, setType] = useState<"income" | "expense">("expense");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    // Enforce colors: Income = Green (#22c55e), Expense = Red (#ef4444)
    const color = type === "income" ? "#22c55e" : "#ef4444";
    formData.append("color", color);
    formData.append("icon", selectedIcon);
    formData.append("type", type);

    startTransition(async () => {
      const result = await createCategory(formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Category created successfully");
        setIsOpen(false);
        // Reset form defaults
        setSelectedIcon(EMOJIS[0]);
        setType("expense");
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-brand-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-surface-dark border-white/10">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold text-white text-left">
            Add New Category
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-white/5 rounded-xl">
            <button
              type="button"
              onClick={() => setType("income")}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                type === "income"
                  ? "bg-green-500/20 text-green-500 shadow-sm"
                  : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <ArrowUpCircle className="w-4 h-4" />
              Income
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                type === "expense"
                  ? "bg-red-500/20 text-red-500 shadow-sm"
                  : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <ArrowDownCircle className="w-4 h-4" />
              Expense
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Category Name
            </label>
            <Input
              name="name"
              type="text"
              required
              placeholder={type === "income" ? "e.g. Salary" : "e.g. Food"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">
              Icon
            </label>
            <div className="grid grid-cols-8 gap-2 p-3 bg-white/5 rounded-xl border border-white/10 h-40 overflow-y-auto custom-scrollbar">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedIcon(emoji)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-all",
                    selectedIcon === emoji
                      ? "bg-brand-primary/20 ring-2 ring-brand-primary"
                      : "hover:bg-white/5"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
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
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
