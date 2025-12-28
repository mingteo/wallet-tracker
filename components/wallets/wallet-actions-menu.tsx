import { useState, useRef } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Wallet, WalletGroup } from "@/types";
import { EditWalletDialog } from "./edit-wallet-dialog";
import { DeleteWalletDialog } from "./delete-wallet-dialog";
import { useClickOutside } from "@/hooks/use-click-outside";

export function WalletActionsMenu({
  wallet,
  groups,
}: {
  wallet: Wallet;
  groups: WalletGroup[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    if (isMenuOpen) setIsMenuOpen(false);
  });

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-text-muted hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-surface-dark border border-white/10 rounded-xl shadow-xl z-30 py-1 animate-in slide-in-from-top-2 fade-in duration-200 origin-top-right">
          <button
            onClick={() => {
              setIsMenuOpen(false);
              setIsEditOpen(true);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 flex items-center gap-2 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit Wallet
          </button>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              setIsDeleteOpen(true);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Wallet
          </button>
        </div>
      )}

      <EditWalletDialog
        wallet={wallet}
        groups={groups}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <DeleteWalletDialog
        wallet={wallet}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
}
