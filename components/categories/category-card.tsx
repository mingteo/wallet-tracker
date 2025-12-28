"use client";

import { useState } from "react";
import { Category } from "@/types";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditCategoryDialog } from "./edit-category-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";

export function CategoryCard({ category }: { category: Category }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="bg-surface-dark border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-white/10 transition-all relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden rounded-2xl z-0 pointer-events-none">
          <div
            className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl transition-all group-hover:opacity-20"
            style={{ backgroundColor: category.color || "#ffffff" }}
          />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner"
            style={{
              backgroundColor: category.color
                ? `${category.color}20`
                : "#ffffff10",
              color: category.color || undefined,
            }}
          >
            {category.icon || "📁"}
          </div>
          <div>
            <h3 className="font-semibold text-white">{category.name}</h3>
            <p className="text-xs text-text-muted capitalize">
              {category.type}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 outline-none relative z-10">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-surface-dark border-white/10"
          >
            <DropdownMenuItem
              onClick={() => setShowEditDialog(true)}
              className="text-text-secondary hover:text-white hover:bg-white/5 cursor-pointer"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <EditCategoryDialog
        category={category}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <DeleteCategoryDialog
        category={category}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
