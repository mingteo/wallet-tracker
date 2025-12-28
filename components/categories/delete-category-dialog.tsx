"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteCategory } from "@/app/dashboard/categories/actions";
import { Category } from "@/types";

type DeleteCategoryDialogProps = {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCategory(category.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Category deleted successfully");
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-surface-dark border-white/10">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <DialogTitle className="text-xl font-bold text-center text-white">
            Delete Category?
          </DialogTitle>
          <DialogDescription className="text-center text-text-secondary pt-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">"{category.name}"</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-white/5 text-white py-3 rounded-xl font-medium hover:bg-white/10 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
