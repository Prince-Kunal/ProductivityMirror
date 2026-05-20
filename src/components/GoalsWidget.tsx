import { Goal } from "@/types/goals";
import { Target, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const importanceDot: Record<string, string> = {
  low: "bg-white/20",
  medium: "bg-blue-400",
  high: "bg-orange-400",
  critical: "bg-red-400",
};

export default function GoalsWidget({ goals }: { goals: Goal[] }) {
  const active = goals.filter(g => !g.is_completed && !g.is_archived);
  const completed = goals.filter(g => g.is_completed && !g.is_archived).length;
  const rate = goals.length > 0 ? Math.round((completed / goals.length) * 100) : 0;

  return (
    <div className="glass-card flex flex-col rounded-3xl border p-6 gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
            <Target className="h-5 w-5 text-white/60" />
          </div>
          <div>
            <h3 className="font-semibold text-white/80">Weekly Goals</h3>
            <p className="text-xs text-white/40">{completed}/{goals.length} complete</p>
          </div>
        </div>
        <Link
          href="/dashboard/goals"
          className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          All Goals <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-white/30 to-white/60 transition-all duration-700"
          style={{ width: `${rate}%` }}
        />
      </div>

      {/* Goal list */}
      <div className="flex flex-col gap-2">
        {active.length === 0 ? (
          <Link
            href="/dashboard/goals"
            className="flex items-center gap-2 rounded-xl border border-white/5 border-dashed py-3 px-4 text-sm text-white/30 hover:text-white/50 hover:border-white/10 transition-all"
          >
            <Target className="h-4 w-4" />
            Set a goal for this week
          </Link>
        ) : (
          active.slice(0, 4).map(goal => (
            <div key={goal.id} className="flex items-center gap-3 rounded-xl px-1 py-1.5 group">
              <div className={cn("h-2 w-2 rounded-full shrink-0", importanceDot[goal.importance])} />
              <span className="text-sm text-white/70 truncate flex-1">{goal.title}</span>
            </div>
          ))
        )}
        {active.length > 4 && (
          <Link href="/dashboard/goals" className="text-xs text-white/30 hover:text-white/50 pl-5 transition-colors">
            +{active.length - 4} more
          </Link>
        )}
      </div>
    </div>
  );
}
