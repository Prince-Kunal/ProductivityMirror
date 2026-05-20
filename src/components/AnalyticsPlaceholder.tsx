import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function AnalyticsPlaceholder({ title, icon, className }: { title: string; icon: ReactNode; className?: string }) {
  return (
    <div className={cn("glass-card group flex flex-col justify-between overflow-hidden rounded-3xl border p-6 relative min-h-[200px]", className)}>
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/50 group-hover:text-white/80 transition-colors">
          {icon}
        </div>
        <span className="font-medium text-white/70 group-hover:text-white/90 transition-colors">{title}</span>
      </div>
      
      <div className="relative z-10 mt-auto flex flex-col items-center justify-center py-8">
        <div className="flex items-center gap-2 text-sm text-white/30 font-medium tracking-wide">
          <span className="h-px w-8 bg-white/10"></span>
          COMING SOON
          <span className="h-px w-8 bg-white/10"></span>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
