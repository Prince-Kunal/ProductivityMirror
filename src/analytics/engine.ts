import { getStartOfDay, getEndOfDay, formatLocalDate } from "@/lib/date";
import { isWithinInterval, subDays, addDays } from "date-fns";

export const TASK_WEIGHTS: Record<string, number> = {
  hard: 3,
  medium: 2,
  easy: 1,
  sleep: 0,
};

export interface DailyStats {
  date: string;
  plannedPoints: number;
  completedPoints: number;
  score: number;
  completedTasks: number;
  totalTasks: number;
  deepWorkMinutes: number;
}

export function calculateEffortPoints(tasks: any[]): { planned: number; completed: number } {
  let planned = 0;
  let completed = 0;

  tasks.forEach(task => {
    const weight = TASK_WEIGHTS[task.color_indicator] || 0;
    if (weight > 0) { // Exclude sleep
      planned += weight;
      if (task.is_completed) {
        completed += weight;
      }
    }
  });

  return { planned, completed };
}

export function getDailyScore(tasks: any[]): number {
  const { planned, completed } = calculateEffortPoints(tasks);
  return planned > 0 ? Math.round((completed / planned) * 100) : 0;
}

export function analyzeDailyProductivity(tasks: any[], targetDate: Date = new Date()): DailyStats {
  const start = getStartOfDay(targetDate);
  const end = getEndOfDay(targetDate);

  const dayTasks = tasks.filter(t => {
    const taskDate = new Date(t.start_time);
    return isWithinInterval(taskDate, { start, end });
  });

  const { planned, completed } = calculateEffortPoints(dayTasks);
  const score = planned > 0 ? Math.round((completed / planned) * 100) : 0;

  const deepWorkMinutes = dayTasks
    .filter(t => t.color_indicator === "hard" && t.is_completed)
    .reduce((sum, t) => sum + t.duration_minutes, 0);

  return {
    date: formatLocalDate(targetDate, "yyyy-MM-dd"),
    plannedPoints: planned,
    completedPoints: completed,
    score,
    completedTasks: dayTasks.filter(t => t.is_completed && t.color_indicator !== "sleep").length,
    totalTasks: dayTasks.filter(t => t.color_indicator !== "sleep").length,
    deepWorkMinutes,
  };
}

export function generateWeeklyTrend(tasks: any[], referenceDate: Date = new Date()): DailyStats[] {
  // Last 7 days in the user's local timezone
  const trend: DailyStats[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const day = subDays(referenceDate, i);
    trend.push(analyzeDailyProductivity(tasks, day));
  }
  
  return trend;
}

export function getSleepCorrelation(tasks: any[], referenceDate: Date = new Date()) {
  // Sleep duration from previous night vs today's score
  const todayStart = getStartOfDay(referenceDate);
  const yesterdayStart = getStartOfDay(subDays(referenceDate, 1));
  
  // Sleep usually happens from yesterday evening to today morning
  const yesterdaySleep = tasks.find(t => 
    t.color_indicator === "sleep" && 
    isWithinInterval(new Date(t.start_time), { start: yesterdayStart, end: todayStart })
  );

  const todayStats = analyzeDailyProductivity(tasks, referenceDate);

  return {
    sleepMinutes: yesterdaySleep ? yesterdaySleep.duration_minutes : null,
    productivityScore: todayStats.score,
    deepWorkMinutes: todayStats.deepWorkMinutes,
  };
}
