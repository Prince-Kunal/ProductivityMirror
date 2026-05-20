import { cn } from "@/lib/utils";

export default function ScoreCard({ score, label, trend }: { score: number, label: string, trend?: number }) {
  return (
    <div className="glass-card flex flex-col justify-between overflow-hidden rounded-3xl border p-6 relative">
      <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
      
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-sm font-medium text-white/50">{label}</span>
        {trend && (
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", trend > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      
      <div className="relative z-10 mt-6 flex items-baseline gap-2">
        <span className="text-5xl font-bold tracking-tight text-white/90">{score}</span>
        <span className="text-sm font-medium text-white/40">/ 100</span>
      </div>
      
      <div className="relative z-10 mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-primary transition-all duration-1000 ease-out" 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
}
