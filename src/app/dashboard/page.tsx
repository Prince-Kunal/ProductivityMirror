import TaskCard from "@/components/TaskCard";
import ScoreCard from "@/components/ScoreCard";
import AnalyticsPlaceholder from "@/components/AnalyticsPlaceholder";
import { Task } from "@/types";
import { BarChart3, CalendarDays, Moon, Flame } from "lucide-react";

// Mock Data
const mockTasks: Task[] = [
  { id: "1", title: "Deep Work Session: Architecture", duration: "120 min", difficulty: "hard", completed: false },
  { id: "2", title: "Gym & Recovery", duration: "60 min", difficulty: "medium", completed: true },
  { id: "3", title: "AI Project Refactoring", duration: "90 min", difficulty: "hard", completed: false },
  { id: "4", title: "Email & Slack Catchup", duration: "30 min", difficulty: "easy", completed: true },
  { id: "5", title: "Sleep Tracking", duration: "8 hours", difficulty: "sleep", completed: true },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <ScoreCard score={84} label="Daily Productivity" trend={12} />
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
            <h2 className="text-xl font-semibold tracking-tight text-white/90">Today's Focus</h2>
            <span className="text-sm font-medium text-white/40">5 Tasks</span>
          </div>
          
          <div className="flex flex-col gap-3">
            {mockTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
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
