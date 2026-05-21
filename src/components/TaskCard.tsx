"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toggleTaskCompletion } from "@/app/actions/updateTask";
import { useRouter } from "next/navigation";
import { TaskDifficulty } from "@/services/calendar";

const difficultyColors: Record<string, string> = {
  hard: "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  easy: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  sleep: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const indicatorColors: Record<string, string> = {
  hard: "bg-red-500",
  medium: "bg-orange-500",
  easy: "bg-blue-500",
  sleep: "bg-purple-500",
};

export default function TaskCard({ task }: { task: any }) {
  const [completed, setCompleted] = useState(task.is_completed);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const router = useRouter();

  const handleToggle = async (checked: boolean) => {
    setCompleted(checked);
    setIsUpdating(true);
    if (checked) {
      setSparkle(true);
      setTimeout(() => setSparkle(false), 600);
    }
    try {
      await toggleTaskCompletion(task.id, checked);
      router.refresh();
    } catch (error) {
      console.error("Failed to update task", error);
      // revert optimistic update
      setCompleted(!checked);
    } finally {
      setIsUpdating(false);
    }
  };

  const durationStr = task.duration_minutes >= 60 
    ? `${Math.floor(task.duration_minutes / 60)}h ${task.duration_minutes % 60 > 0 ? (task.duration_minutes % 60) + 'm' : ''}`
    : `${task.duration_minutes}m`;

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300",
        "glass-card hover:border-white/10 hover:shadow-xl select-none active:scale-[0.99] touch-manipulation",
        completed ? "opacity-45 bg-white/[0.005]" : "opacity-100",
        isUpdating && "pointer-events-none opacity-40",
        sparkle && "ring-1 ring-blue-500/30 scale-[1.01]"
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full transition-all duration-300",
          indicatorColors[task.color_indicator] || "bg-gray-500",
          completed && "h-1/3 opacity-30"
        )}
      />
      
      {/* Comfortable touch target for checking items */}
      <div className="flex items-center justify-center p-2 -m-2 mr-0 rounded-full hover:bg-white/5 active:bg-white/10 transition-colors">
        <Checkbox
          checked={completed}
          onCheckedChange={(c) => handleToggle(c as boolean)}
          className="h-6 w-6 rounded-[8px] border-white/20 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white transition-all cursor-pointer"
        />
      </div>
      
      <div className="flex flex-1 flex-col gap-1 min-w-0" onClick={() => handleToggle(!completed)}>
        <span
          className={cn(
            "text-base font-medium tracking-wide transition-all truncate cursor-pointer",
            completed ? "text-white/30 line-through decoration-white/20" : "text-white/90"
          )}
        >
          {task.title}
        </span>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs font-semibold text-white/45">{durationStr}</span>
        <div
          className={cn(
            "flex h-6 items-center justify-center rounded-full border px-2.5 text-[9px] font-bold uppercase tracking-wider",
            difficultyColors[task.color_indicator] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
          )}
        >
          {task.color_indicator}
        </div>
      </div>
    </div>
  );
}
