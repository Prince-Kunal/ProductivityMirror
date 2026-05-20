import TaskCard from "@/components/TaskCard";
import ScoreCard from "@/components/ScoreCard";
import AnalyticsPlaceholder from "@/components/AnalyticsPlaceholder";
import SyncButton from "@/components/SyncButton";
import { BarChart3, CalendarDays, Moon, Flame } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Get start and end of today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .gte('start_time', startOfDay.toISOString())
    .lte('start_time', endOfDay.toISOString())
    .order('start_time', { ascending: true });

  const displayTasks = tasks || [];
  
  // Simple completion calculation for the score card
  const completedTasks = displayTasks.filter(t => t.is_completed).length;
  const totalTasks = displayTasks.length;
  const score = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ScoreCard score={score} label="Daily Productivity" trend={0} />
        <AnalyticsPlaceholder 
          title="Weekly Overview" 
          icon={<CalendarDays />} 
          className="lg:col-span-2"
        />
        <AnalyticsPlaceholder 
          title="Sleep Quality" 
          icon={<Moon />} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Left Column: Tasks */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white/90">Today's Focus</h2>
              <p className="text-sm font-medium text-white/40">{totalTasks} Tasks</p>
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
        </div>

        {/* Right Column: Analytics / Heatmap */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-white/90">Insights</h2>
          </div>
          
          <AnalyticsPlaceholder 
            title="Productivity Heatmap" 
            icon={<Flame />} 
            className="h-[300px]"
          />
          
          <AnalyticsPlaceholder 
            title="Monthly Trends" 
            icon={<BarChart3 />} 
            className="h-[300px]"
          />
        </div>
      </div>

    </div>
  );
}
