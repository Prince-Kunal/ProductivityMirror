"use client";

import { useState } from "react";
import { createGoal } from "@/app/actions/goals";
import { GoalImportance, GoalTimeframe } from "@/types/goals";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreateGoalForm({ defaultTimeframe = "weekly" }: { defaultTimeframe?: GoalTimeframe }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    importance: "medium" as GoalImportance,
    timeframe: defaultTimeframe,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setIsSubmitting(true);
    await createGoal(form);
    setForm({ title: "", description: "", importance: "medium", timeframe: "weekly" });
    setIsSubmitting(false);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-white/5 border-dashed p-4 text-white/40 hover:border-white/10 hover:text-white/60 transition-all duration-200 group"
      >
        <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium">Add a goal</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl border p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80">New Goal</h3>
        <button type="button" onClick={() => setOpen(false)} className="text-white/40 hover:text-white/70 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <input
        type="text"
        placeholder="What do you want to accomplish?"
        value={form.title}
        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors"
        autoFocus
        required
      />

      <textarea
        placeholder="Description (optional)"
        value={form.description}
        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        rows={2}
        className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/90 placeholder:text-white/30 focus:border-white/20 focus:outline-none transition-colors"
      />

      <div className="flex gap-3 flex-wrap">
        <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
          <label className="text-xs text-white/40 font-medium">Importance</label>
          <select
            value={form.importance}
            onChange={e => setForm(f => ({ ...f, importance: e.target.value as GoalImportance }))}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-white/20"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
          <label className="text-xs text-white/40 font-medium">Timeframe</label>
          <select
            value={form.timeframe}
            onChange={e => setForm(f => ({ ...f, timeframe: e.target.value as GoalTimeframe }))}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-white/20"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !form.title.trim()}
          className="px-4 py-2 rounded-xl bg-white/10 text-sm font-medium text-white/90 hover:bg-white/20 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          {isSubmitting ? "Saving..." : "Save Goal"}
        </button>
      </div>
    </form>
  );
}
