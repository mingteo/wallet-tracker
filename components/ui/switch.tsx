"use client";

import { useTransition } from "react";
import { cn } from "@/utils/cn";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  name,
  className,
}: SwitchProps) {
  // Use a hidden checkbox to support form submission naturally
  return (
    <div
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background-dark disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-brand-primary" : "bg-white/10",
        className
      )}
      onClick={() => !disabled && onCheckedChange(!checked)}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        name={name}
        // If not checked, we might want to send 'off' or nothing, but standard HTML check sends nothing.
        // Server action handles this by checking !== 'on' or missing.
      />
      <div
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </div>
  );
}
