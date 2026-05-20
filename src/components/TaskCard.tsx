"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toggleTaskCompletion } from "@/app/actions/updateTask";
import { useRouter } from "next/navigation";
import { TaskDifficulty } from "@/services/calendar";

const difficultyColors: Record<string, string> = {
  hard: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  easy: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  sleep: "bg-purple-500/20 text-purple-400 border-purple-500/30",
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
  const router = useRouter();

  const handleToggle = async (checked: boolean) => {
    setCompleted(checked);
    setIsUpdating(true);
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
        "glass-card hover:border-white/10 hover:shadow-xl",
        completed ? "opacity-50" : "opacity-100",
        isUpdating && "pointer-events-none opacity-50"
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full",
          indicatorColors[task.color_indicator] || "bg-gray-500"
        )}
      />
      
      <Checkbox
        checked={completed}
        onCheckedChange={(c) => handleToggle(c as boolean)}
        className="h-5 w-5 rounded-[6px] border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
      />
      
      <div className="flex flex-1 flex-col gap-1">
        <span
          className={cn(
            "text-base font-medium tracking-wide transition-all",
            completed ? "text-white/40 line-through" : "text-white/90"
          )}
        >
          {task.title}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-white/50">{durationStr}</span>
        <div
          className={cn(
            "flex h-6 items-center justify-center rounded-full border px-2.5 text-[10px] font-semibold uppercase tracking-wider",
            difficultyColors[task.color_indicator] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
          )}
        >
          {task.color_indicator}
        </div>
      </div>
    </div>
  );
}
