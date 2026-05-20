export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  importance: 'low' | 'medium' | 'high' | 'critical';
  timeframe: 'weekly' | 'monthly' | 'yearly';
  is_completed: boolean;
  is_archived: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type GoalImportance = Goal['importance'];
export type GoalTimeframe = Goal['timeframe'];
