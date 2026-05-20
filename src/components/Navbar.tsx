"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-6 xl:px-10 justify-between">
        <h2 className="text-lg font-semibold text-white/90">Dashboard</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-white/70">
            {user?.email}
          </span>
          <Button variant="ghost" size="icon" onClick={signOut} className="text-white/60 hover:text-white hover:bg-white/10 rounded-full">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
