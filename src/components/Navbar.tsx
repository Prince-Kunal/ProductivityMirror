"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Mirror",
  "/dashboard/calendar": "Schedule",
  "/dashboard/goals": "Intentions",
  "/dashboard/analytics": "Reflections",
  "/dashboard/settings": "Settings",
};

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  // Get matching title or default to Mirror
  const activeTitle = pageTitles[pathname] || "Mirror";

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="flex h-16 items-center px-4 md:px-6 xl:px-10 justify-between select-none">
        <h2 className="text-lg font-bold tracking-tight text-white/95">{activeTitle}</h2>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-medium text-white/55">
            {user?.email}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-white/40 hover:text-white hover:bg-white/10 rounded-full h-8 px-3 gap-1.5 text-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
