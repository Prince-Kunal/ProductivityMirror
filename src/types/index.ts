export type TaskDifficulty = 'hard' | 'medium' | 'easy' | 'sleep';

export interface Task {
  id: string;
  title: string;
  duration: string;
  difficulty: TaskDifficulty;
  completed: boolean;
}
