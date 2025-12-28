"use client";

import { useState, useTransition, useEffect } from "react";
import { Loader2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { updateCategory } from "@/app/dashboard/categories/actions";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { Input } from "@/components/ui/input";
import { Category } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

type EditCategoryDialogProps = {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
}: EditCategoryDialogProps) {
  const [selectedIcon, setSelectedIcon] = useState(category.icon || EMOJIS[0]);
  const [type, setType] = useState<"income" | "expense">(
    category.type || "expense"
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSelectedIcon(category.icon || EMOJIS[0]);
    setType(category.type || "expense");
  }, [category]);

  async function handleSubmit(formData: FormData) {
    // Enforce colors: Income = Green (#22c55e), Expense = Red (#ef4444)
    const color = type === "income" ? "#22c55e" : "#ef4444";
    formData.append("color", color);
    formData.append("icon", selectedIcon);
    formData.append("type", type);

    startTransition(async () => {
      const result = await updateCategory(category.id, formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Category updated successfully");
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-surface-dark border-white/10">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-bold text-white text-left">
            Edit Category
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
              defaultValue={category.name}
              required
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

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-white/5 text-white py-3 rounded-xl font-medium hover:bg-white/10 transition-all font-medium"
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
