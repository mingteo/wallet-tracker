"use client";

import { useTransition } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { deleteWallet } from "@/app/dashboard/wallets/actions";
import { toast } from "sonner";
import { Wallet } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type DeleteWalletDialogProps = {
  wallet: Wallet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteWalletDialog({
  wallet,
  open,
  onOpenChange,
}: DeleteWalletDialogProps) {
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      const result = await deleteWallet(wallet.id);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Wallet deleted successfully");
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-surface-dark border-red-500/20 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500 ring-4 ring-red-500/5">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <DialogTitle className="text-xl font-bold text-white mb-2">
            Delete Wallet
          </DialogTitle>
          <p className="text-text-secondary text-sm mb-6 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-bold text-white">"{wallet.name}"</span>? This
            action cannot be undone and all associated transactions will be
            lost.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 bg-white/5 text-white py-2.5 rounded-xl font-medium hover:bg-white/10 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600 transition-all flex justify-center items-center gap-2 active:scale-[0.98] shadow-lg shadow-red-500/20"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
