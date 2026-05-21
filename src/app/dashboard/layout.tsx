"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/Loading";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background selection:bg-primary/30">
      {/* Desktop only sidebar, mobile layout handled by bottom navigation */}
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-6 xl:p-10 pb-24 md:pb-6">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
      {/* Mobile only bottom nav bar */}
      <MobileNav />
    </div>
  );
}
