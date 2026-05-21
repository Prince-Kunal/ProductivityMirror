"use client";

import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Target, Activity, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const mobileItems = [
  { icon: LayoutDashboard, label: "Mirror", href: "/dashboard" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/calendar" },
  { icon: Target, label: "Goals", href: "/dashboard/goals" },
  { icon: Activity, label: "Reflect", href: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gray-950/70 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center justify-around px-2">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-all relative select-none",
                isActive ? "text-blue-400" : "text-white/40 active:scale-95"
              )}
            >
              {/* Highlight bar above active item */}
              {isActive && (
                <div className="absolute top-0 w-8 h-0.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-md shadow-blue-400/50" />
              )}
              <Icon className={cn("h-5 w-5 mb-1 transition-transform duration-200", isActive && "scale-110 text-blue-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
