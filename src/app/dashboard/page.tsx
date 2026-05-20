import TaskCard from "@/components/TaskCard";
import ScoreCard from "@/components/ScoreCard";
import SyncButton from "@/components/SyncButton";
import WeeklyTrendChart from "@/components/WeeklyTrendChart";
import ProductivityHeatmap from "@/components/ProductivityHeatmap";
import GoalsWidget from "@/components/GoalsWidget";
import { analyzeDailyProductivity, generateWeeklyTrend, getSleepCorrelation } from "@/analytics/engine";
import { BarChart3, CalendarDays, Moon, Flame } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { Goal } from "@/types/goals";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Get start and end of today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch 30 days of historical data for analytics
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const { data: allTasks } = await supabase
    .from('tasks')
    .select('*')
    .gte('start_time', thirtyDaysAgo.toISOString())
    .lte('start_time', endOfDay.toISOString())
    .order('start_time', { ascending: true });

  const tasks = allTasks || [];

  // Yesterday boundaries
  const startOfYesterday = new Date();
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  startOfYesterday.setHours(0, 0, 0, 0);
  const endOfYesterday = new Date();
  endOfYesterday.setDate(endOfYesterday.getDate() - 1);
  endOfYesterday.setHours(23, 59, 59, 999);

  // Fetch weekly goals for widget
  const { data: weeklyGoals } = await supabase
    .from("goals")
    .select("*")
    .eq("timeframe", "weekly")
    .eq("is_archived", false)
    .order("created_at", { ascending: false });
  const goals: Goal[] = (weeklyGoals || []) as Goal[];

  // Filter tasks for today (excluding sleep)
  const displayTasks = tasks.filter(t => {
    const taskDate = new Date(t.start_time);
    return taskDate >= startOfDay && taskDate <= endOfDay && t.color_indicator !== 'sleep';
  });

  // Filter tasks for yesterday (excluding sleep)
  const yesterdayTasks = tasks.filter(t => {
    const taskDate = new Date(t.start_time);
    return taskDate >= startOfYesterday && taskDate <= endOfYesterday && t.color_indicator !== 'sleep';
  });

  
  // Calculate analytics
  const todayStats = analyzeDailyProductivity(tasks, new Date());
  const weeklyTrendData = generateWeeklyTrend(tasks, new Date());
  
  // Heatmap data (last 28 days for a nice 4-week grid)
  const heatmapData = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    heatmapData.push(analyzeDailyProductivity(tasks, d));
  }

  const sleepStats = getSleepCorrelation(tasks, new Date());
  
  // Weekly insights
  const avgWeeklyScore = Math.round(weeklyTrendData.reduce((acc, d) => acc + d.score, 0) / 7);
  const totalWeeklyDeepWork = Math.round(weeklyTrendData.reduce((acc, d) => acc + d.deepWorkMinutes, 0) / 60);

  let sleepInsight = "No sleep data recorded.";
  if (sleepStats.sleepMinutes) {
    const sleepHours = (sleepStats.sleepMinutes / 60).toFixed(1);
    sleepInsight = `You had ${sleepHours}h of sleep. Focus on maintaining 7-8 hours for optimal deep work.`;
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ScoreCard score={todayStats.score} label="Daily Productivity" trend={0} />
        
        <div className="glass-card flex flex-col justify-between rounded-3xl border p-6 lg:col-span-2 relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70">
                <CalendarDays className="h-5 w-5" />
              </div>
              <h3 className="font-medium text-white/80">7-Day Trend</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-white">{avgWeeklyScore}%</span>
              <p className="text-xs text-white/40">Avg Score</p>
            </div>
          </div>
          <div className="h-[100px] mt-2 relative z-10">
             <WeeklyTrendChart data={weeklyTrendData} />
          </div>
        </div>

        <div className="glass-card flex flex-col justify-between rounded-3xl border p-6 relative overflow-hidden group">
          <div className="relative z-10 flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
              <Moon className="h-5 w-5" />
            </div>
            <h3 className="font-medium text-white/80">Sleep Context</h3>
          </div>
          <div className="relative z-10 mt-auto">
            <p className="text-sm text-white/60 leading-relaxed">
              {sleepInsight}
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-all duration-500" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column: Tasks */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white/90">Today's Execution</h2>
              <p className="text-sm font-medium text-white/40">{todayStats.completedTasks} / {todayStats.totalTasks} Tasks Completed</p>
            </div>
            <SyncButton />
          </div>
          
          <div className="flex flex-col gap-3">
            {displayTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 py-12 text-center glass-card">
                <CalendarDays className="mb-4 h-10 w-10 text-white/20" />
                <h3 className="text-lg font-medium text-white/80">No deep work planned</h3>
                <p className="mt-1 text-sm text-white/40">Sync your Google Calendar to populate your tasks.</p>
              </div>
            ) : (
              displayTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))
            )}
          </div>

          {/* Yesterday's Execution — editable */}
          {yesterdayTasks.length > 0 && (
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold text-white/40 tracking-wide">Yesterday</h3>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-white/25">
                  {yesterdayTasks.filter(t => t.is_completed).length}/{yesterdayTasks.length} done
                </span>
              </div>
              <div className="flex flex-col gap-3 opacity-70">
                {yesterdayTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>


        {/* Right Column: Analytics / Heatmap */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-white/90">Consistency</h2>
          </div>
          
          <div className="glass-card flex flex-col rounded-3xl border p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-white/80">Activity Map</h3>
                <p className="text-xs text-white/40">Last 28 Days</p>
              </div>
            </div>
            <ProductivityHeatmap data={heatmapData} />
          </div>
          
          <div className="glass-card flex flex-col rounded-3xl border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-white/80">Deep Work</h3>
                <p className="text-xs text-white/40">Weekly Accumulation</p>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-white">{totalWeeklyDeepWork}</span>
              <span className="text-white/40 mb-1">hours</span>
            </div>
            <p className="mt-4 text-sm text-white/60">
              Focus on increasing your deep work hours steadily rather than sudden spikes.
            </p>
          </div>

          <GoalsWidget goals={goals} />
        </div>
      </div>


    </div>
  );
}
