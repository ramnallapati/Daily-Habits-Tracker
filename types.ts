
export enum Category {
  HEALTH = 'Health',
  WORK = 'Work',
  LEARNING = 'Learning',
  MINDFULNESS = 'Mindfulness',
  OTHER = 'Other'
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: Category;
  targetDuration: number; // in minutes
  targetTime?: string; // e.g., "05:00"
  createdAt: number;
  isActive: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // ISO Date YYYY-MM-DD
  completed: boolean;
  timeSpent: number; // in seconds
}
