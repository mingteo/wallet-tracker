"use client";

import {
  Bell,
  User,
  Menu,
  X,
  LayoutDashboard,
  Wallet,
  Receipt,
  Settings,
  PieChart,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { signOut } from "@/app/login/actions";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { name: "Wallets", href: "/dashboard/wallets", icon: Wallet },
  { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Header({ userEmail }: { userEmail?: string | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="h-16 border-b border-white/5 bg-background-dark/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6 lg:pl-72 transition-all duration-300">
        {/* Logo - Always Left (but hidden on desktop since sidebar has it, or keep it?) 
            Actually sidebar has it on desktop. On mobile, we need it. 
        */}
        <div className="flex items-center gap-3 lg:hidden">
          <span className="font-bold text-gradient text-xl whitespace-nowrap">
            Your Wallet Tracker
          </span>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center justify-end w-full gap-4">
          <button className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          {/* Desktop Profile - Hidden on Mobile/Tablet */}
          <div className="hidden lg:flex items-center gap-3 pl-4 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">
                {userEmail?.split("@")[0]}
              </p>
              <p className="text-xs text-text-muted">Pro Plan</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary p-[1px]">
              <div className="w-full h-full rounded-full bg-surface-dark flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Mobile Hamburger - Right Side */}
          <div className="lg:hidden flex items-center border-l border-white/10 pl-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-text-secondary hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Navigation Drawer (Right Side) */}
      <div
        className={clsx(
          "fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ease-in-out",
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Sidebar Drawer - Slide from Right */}
        <div
          className={clsx(
            "absolute top-0 right-0 bottom-0 w-72 bg-surface-dark border-l border-white/10 p-6 shadow-2xl transform transition-transform duration-300 ease-out",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gradient">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-text-secondary hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Profile Section */}
          <div className="mb-8 p-4 rounded-xl bg-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary p-[1px] shrink-0">
              <div className="w-full h-full rounded-full bg-surface-dark flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {userEmail}
              </p>
              <p className="text-xs text-text-muted">Pro Plan</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                      : "text-text-secondary hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut();
                }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 rounded-xl hover:bg-red-400/10 hover:text-red-300 w-full transition-all"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
