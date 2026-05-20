"use client";

import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Settings, Target, Activity, Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
  { icon: Target, label: "Goals", href: "/dashboard/goals" },
  { icon: Activity, label: "Analytics", href: "/dashboard/analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden text-white/70 hover:bg-white/10 hover:text-white border border-white/10 glass"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar Overlay (Mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-background/50 backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-20 items-center px-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 shadow-lg" />
            <span className="text-lg font-bold tracking-tight text-white/90">Mirror</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-white/10 text-white shadow-sm border border-white/10"
                    : "text-white/50 hover:bg-white/5 hover:text-white/90 border border-transparent"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-white/40 group-hover:text-white/70")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link
            href="/dashboard/settings"
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/50 transition-all hover:bg-white/5 hover:text-white/90 border border-transparent"
          >
            <Settings className="h-5 w-5 text-white/40 group-hover:text-white/70" />
            Settings
          </Link>
        </div>
      </aside>
    </>
  );
}
