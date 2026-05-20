"use client";

import { DailyStats } from "@/analytics/engine";

export default function ProductivityHeatmap({ data }: { data: DailyStats[] }) {
  // A simple 7x5 or continuous grid. Let's make it a wrapping flex container or simple grid
  // We want to render blocks based on 'score'
  
  const getColorForScore = (score: number) => {
    if (score === 0) return "bg-white/5 border-white/5";
    if (score < 40) return "bg-white/20 border-white/10";
    if (score < 70) return "bg-white/40 border-white/20";
    if (score < 90) return "bg-white/70 border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.3)]";
    return "bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] border-white/50";
  };

  return (
    <div className="flex flex-col gap-2 pt-4">
      <div className="flex flex-wrap gap-2">
          {data.map((day, i) => (
            <div 
              key={i}
              title={`${new Date(day.date).toLocaleDateString()} - Score: ${day.score}% - Deep Work: ${Math.round(day.deepWorkMinutes/60)}h`}
              className={`h-6 w-6 sm:h-8 sm:w-8 rounded-md border transition-all duration-300 hover:scale-110 cursor-pointer ${getColorForScore(day.score)}`}
            />
          ))}
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-white/40">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-white/5"></div>
        <div className="h-3 w-3 rounded-sm bg-white/20"></div>
        <div className="h-3 w-3 rounded-sm bg-white/40"></div>
        <div className="h-3 w-3 rounded-sm bg-white/70"></div>
        <div className="h-3 w-3 rounded-sm bg-white"></div>
        <span>More</span>
      </div>
    </div>
  );
}
