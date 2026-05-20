import { createClient } from "@/utils/supabase/server";
import GoalCard from "@/components/GoalCard";
import CreateGoalForm from "@/components/CreateGoalForm";
import { Goal } from "@/types/goals";
import { Target, CheckCircle2 } from "lucide-react";

const timeframeLabels: Record<string, string> = {
  weekly: "This Week",
  monthly: "This Month",
  yearly: "This Year",
};

export default async function GoalsPage() {
  const supabase = await createClient();
  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  const allGoals: Goal[] = (goals || []) as Goal[];
  const grouped = {
    weekly: allGoals.filter(g => g.timeframe === "weekly"),
    monthly: allGoals.filter(g => g.timeframe === "monthly"),
    yearly: allGoals.filter(g => g.timeframe === "yearly"),
  };

  const totalActive = allGoals.filter(g => !g.is_completed).length;
  const totalCompleted = allGoals.filter(g => g.is_completed).length;
  const completionRate = allGoals.length > 0
    ? Math.round((totalCompleted / allGoals.length) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white/90">Goals</h1>
          <p className="mt-1 text-sm text-white/40">
            Intentions, not obligations. Track what matters.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card flex flex-col items-center rounded-2xl border px-6 py-3">
            <span className="text-2xl font-bold text-white/90">{totalActive}</span>
            <span className="text-xs text-white/40 mt-0.5">Active</span>
          </div>
          <div className="glass-card flex flex-col items-center rounded-2xl border px-6 py-3">
            <span className="text-2xl font-bold text-white/90">{completionRate}%</span>
            <span className="text-xs text-white/40 mt-0.5">Completed</span>
          </div>
        </div>
      </div>

      {/* Goal Sections */}
      {(["weekly", "monthly", "yearly"] as const).map(timeframe => (
        <section key={timeframe} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white/80">{timeframeLabels[timeframe]}</h2>
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-sm text-white/30">
              {grouped[timeframe].filter(g => g.is_completed).length}/{grouped[timeframe].length}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {grouped[timeframe].length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 border-dashed py-8 text-center">
                <Target className="mb-2 h-8 w-8 text-white/10" />
                <p className="text-sm text-white/30">No {timeframe} goals yet.</p>
              </div>
            ) : (
              grouped[timeframe].map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))
            )}
            <CreateGoalForm defaultTimeframe={timeframe} />
          </div>
        </section>
      ))}
    </div>
  );
}
