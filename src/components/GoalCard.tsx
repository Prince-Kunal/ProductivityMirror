"use client";

import { useState } from "react";
import { Goal } from "@/types/goals";
import { cn } from "@/lib/utils";
import { updateGoal, deleteGoal } from "@/app/actions/goals";
import { CheckCircle2, Circle, Trash2, ChevronDown, ChevronUp, Archive } from "lucide-react";

const importanceConfig = {
  low: { label: "Low", color: "text-white/40 border-white/10 bg-white/5" },
  medium: { label: "Medium", color: "text-blue-400 border-blue-500/20 bg-blue-500/10" },
  high: { label: "High", color: "text-orange-400 border-orange-500/20 bg-orange-500/10" },
  critical: { label: "Critical", color: "text-red-400 border-red-500/20 bg-red-500/10" },
};

export default function GoalCard({ goal }: { goal: Goal }) {
  const [expanded, setExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const cfg = importanceConfig[goal.importance];

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    await updateGoal(goal.id, { is_completed: !goal.is_completed });
    setIsUpdating(false);
  };

  const handleArchive = async () => {
    setIsUpdating(true);
    await updateGoal(goal.id, { is_archived: true });
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    setIsUpdating(true);
    await deleteGoal(goal.id);
    setIsUpdating(false);
  };

  return (
    <div className={cn(
      "glass-card group flex flex-col rounded-2xl border p-5 transition-all duration-300",
      goal.is_completed && "opacity-60",
      isUpdating && "pointer-events-none opacity-50"
    )}>
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggleComplete}
          className="mt-0.5 shrink-0 text-white/40 hover:text-white/80 transition-colors"
        >
          {goal.is_completed
            ? <CheckCircle2 className="h-5 w-5 text-white/60" />
            : <Circle className="h-5 w-5" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={cn(
              "text-base font-medium text-white/90 transition-all",
              goal.is_completed && "line-through text-white/40"
            )}>
              {goal.title}
            </p>
            <span className={cn(
              "shrink-0 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border",
              cfg.color
            )}>
              {cfg.label}
            </span>
          </div>

          {goal.description && (
            <div className={cn("overflow-hidden transition-all duration-300", expanded ? "max-h-40 mt-2" : "max-h-0")}>
              <p className="text-sm text-white/50 leading-relaxed">{goal.description}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {goal.description && (
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
          {goal.is_completed && (
            <button onClick={handleArchive} className="p-1.5 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all">
              <Archive className="h-4 w-4" />
            </button>
          )}
          <button onClick={handleDelete} className="p-1.5 rounded-lg text-white/40 hover:text-red-400/70 hover:bg-red-500/5 transition-all">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
