import { createClient } from "@/utils/supabase/server";
import {
  analyzeDailyProductivity,
  generateWeeklyTrend,
  calculateEffortPoints,
  DailyStats,
} from "@/analytics/engine";
import { Activity, Flame, BarChart3, Clock, Brain } from "lucide-react";
import WeeklyTrendChart from "@/components/WeeklyTrendChart";
import ProductivityHeatmap from "@/components/ProductivityHeatmap";
import EffortBreakdownChart from "@/components/EffortBreakdownChart";
import { getToday, getStartOfDay } from "@/lib/date";
import { subDays } from "date-fns";

function formatWeekday(dateStr: string) {
  // dateStr is "yyyy-MM-dd"
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const today = getToday();
  const thirtyDaysAgo = getStartOfDay(subDays(new Date(), 29));

  const { data: allTasks } = await supabase
    .from("tasks")
    .select("*")
    .gte("start_time", thirtyDaysAgo.toISOString())
    .lte("start_time", today.end.toISOString())
    .order("start_time", { ascending: true });

  const tasks = allTasks || [];

  // Heatmap (28 days)
  const heatmapData: DailyStats[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = subDays(new Date(), i);
    heatmapData.push(analyzeDailyProductivity(tasks, d));
  }

  // Weekly trend
  const weeklyTrend = generateWeeklyTrend(tasks, new Date());
  const avgScore = Math.round(weeklyTrend.reduce((a, d) => a + d.score, 0) / 7);
  const totalDeepWork = Math.round(weeklyTrend.reduce((a, d) => a + d.deepWorkMinutes, 0) / 60);

  // Effort breakdown
  const hardTasks = tasks.filter(t => t.color_indicator === "hard");
  const medTasks = tasks.filter(t => t.color_indicator === "medium");
  const easyTasks = tasks.filter(t => t.color_indicator === "easy");
  const sleepTasks = tasks.filter(t => t.color_indicator === "sleep");

  const completedHard = hardTasks.filter(t => t.is_completed).length;
  const completedMed = medTasks.filter(t => t.is_completed).length;
  const completedEasy = easyTasks.filter(t => t.is_completed).length;

  const effortData = [
    { name: "Deep Work", planned: hardTasks.length, completed: completedHard, color: "#ef4444" },
    { name: "Medium", planned: medTasks.length, completed: completedMed, color: "#f97316" },
    { name: "Light", planned: easyTasks.length, completed: completedEasy, color: "#3b82f6" },
  ];

  // Best & worst days
  const sortedWeek = [...weeklyTrend].filter(d => d.totalTasks > 0).sort((a, b) => b.score - a.score);
  const bestDay = sortedWeek[0];
  const worstDay = sortedWeek[sortedWeek.length - 1];

  // Overplanning detection
  const totalPlanned = tasks.filter(t => t.color_indicator !== "sleep").length;
  const totalCompleted = tasks.filter(t => t.is_completed && t.color_indicator !== "sleep").length;
  const overallRate = totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0;
  const isOverplanning = overallRate < 60 && totalPlanned > 5;

  // Sleep stats
  const avgSleepMinutes = sleepTasks.length > 0
    ? Math.round(sleepTasks.reduce((a, t) => a + t.duration_minutes, 0) / sleepTasks.length)
    : null;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white/90">Analytics</h1>
        <p className="mt-1 text-sm text-white/40">
          A calm reflection of the last 30 days.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Avg Score", value: `${avgScore}%`, icon: Activity, color: "text-white/70" },
          { label: "Deep Work (7d)", value: `${totalDeepWork}h`, icon: Brain, color: "text-red-400" },
          { label: "Completion Rate", value: `${overallRate}%`, icon: Flame, color: "text-orange-400" },
          { label: "Avg Sleep", value: avgSleepMinutes ? `${(avgSleepMinutes / 60).toFixed(1)}h` : "—", icon: Clock, color: "text-purple-400" },
        ].map(stat => (
          <div key={stat.label} className="glass-card flex flex-col rounded-2xl border p-5 gap-2">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
            <div className="mt-2">
              <span className="text-3xl font-bold text-white/90">{stat.value}</span>
              <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Weekly Trend */}
        <div className="glass-card rounded-3xl border p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-5 w-5 text-white/50" />
            <div>
              <h3 className="font-semibold text-white/80">Weekly Score Trend</h3>
              <p className="text-xs text-white/40">Last 7 days</p>
            </div>
          </div>
          <div className="h-[180px]">
            <WeeklyTrendChart data={weeklyTrend} />
          </div>
        </div>

        {/* Effort Breakdown */}
        <div className="glass-card rounded-3xl border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-5 w-5 text-white/50" />
            <div>
              <h3 className="font-semibold text-white/80">Effort Breakdown</h3>
              <p className="text-xs text-white/40">Planned vs. Completed (30d)</p>
            </div>
          </div>
          <EffortBreakdownChart data={effortData} />
        </div>
      </div>

      {/* Consistency Heatmap (full-width) */}
      <div className="glass-card rounded-3xl border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Flame className="h-5 w-5 text-orange-400" />
          <div>
            <h3 className="font-semibold text-white/80">Consistency Map</h3>
            <p className="text-xs text-white/40">28-day activity</p>
          </div>
        </div>
        <ProductivityHeatmap data={heatmapData} />
      </div>

      {/* Behavioral Insights */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Best day */}
        {bestDay && (
          <div className="glass-card rounded-2xl border p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">Best Day</p>
            <p className="text-2xl font-bold text-white/90">
              {formatWeekday(bestDay.date)}
            </p>
            <p className="text-sm text-white/50 mt-1">{bestDay.score}% execution rate</p>
          </div>
        )}

        {/* Worst day */}
        {worstDay && worstDay.date !== bestDay?.date && (
          <div className="glass-card rounded-2xl border p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">Lowest Day</p>
            <p className="text-2xl font-bold text-white/90">
              {formatWeekday(worstDay.date)}
            </p>
            <p className="text-sm text-white/50 mt-1">{worstDay.score}% execution rate</p>
          </div>
        )}

        {/* Overplanning alert */}
        <div className="glass-card rounded-2xl border p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
            {isOverplanning ? "Overplanning Detected" : "Planning Quality"}
          </p>
          <p className="text-2xl font-bold text-white/90">{overallRate}%</p>
          <p className="text-sm text-white/50 mt-1">
            {isOverplanning
              ? "You're consistently scheduling more than you complete. Consider planning less."
              : "Your planning aligns well with execution."}
          </p>
        </div>
      </div>
    </div>
  );
}
