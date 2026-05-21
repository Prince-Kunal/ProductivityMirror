"use client";

import { DailyStats } from "@/analytics/engine";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

export default function WeeklyTrendChart({ data }: { data: DailyStats[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format data for chart
  const chartData = data.map(d => {
    // date-fns safe parsing for weekday format
    const [year, month, day] = d.date.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    return {
      name: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
      score: d.score,
      completed: d.completedPoints,
      planned: d.plannedPoints
    };
  });

  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center text-white/10 text-xs select-none">
        Loading chart...
      </div>
    );
  }

  return (
    <div className="h-full w-full pt-4 min-h-[100px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
            dy={8}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} 
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(3,7,18,0.95)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
            itemStyle={{ color: '#fff', fontSize: '12px' }}
            labelStyle={{ color: 'rgba(255,255,255,0.4)', marginBottom: '4px', fontSize: '11px' }}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#3b82f6" 
            strokeWidth={1.5}
            fillOpacity={1} 
            fill="url(#colorScore)" 
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
