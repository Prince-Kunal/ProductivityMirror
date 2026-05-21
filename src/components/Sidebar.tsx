"use client";

import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Settings, Target, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Calendar", href: "/dashboard/calendar" },
  { icon: Target, label: "Goals", href: "/dashboard/goals" },
  { icon: Activity, label: "Analytics", href: "/dashboard/analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-white/5 bg-background/50 backdrop-blur-xl shrink-0">
      <div className="flex h-20 items-center px-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg" />
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
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all select-none",
                isActive
                  ? "bg-white/10 text-white shadow-sm border border-white/10"
                  : "text-white/50 hover:bg-white/5 hover:text-white/90 border border-transparent"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-blue-400" : "text-white/40 group-hover:text-white/70")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <Link
          href="/dashboard/settings"
          className={cn(
            "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all select-none",
            pathname.startsWith("/dashboard/settings")
              ? "bg-white/10 text-white shadow-sm border border-white/10"
              : "text-white/50 hover:bg-white/5 hover:text-white/90 border border-transparent"
          )}
        >
          <Settings className={cn("h-5 w-5", pathname.startsWith("/dashboard/settings") ? "text-blue-400" : "text-white/40 group-hover:text-white/70")} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
