// services/stats.ts

import { api } from "./api";

export interface CompletedTask {
  id: string;
  user_id: string;
  title: string;
  color: string | null;
  due_date: string | null;
  completed_at: string;
}

export interface CalendarDataEntry {
  status: string;
  index: number;
}

export type CalendarData = Record<string, CalendarDataEntry>;

export interface CompletedStreak {
  id: string;
  user_id: string;
  title: string;
  streak_count: number;
  duration_seconds: number;
  created_at: string;
  completed_at: string;
  total_intervals: number;
  successful_intervals: number;
  failed_intervals: number;
  calendar_data: CalendarData | null;
}

export const StatsService = {
  completedTasks() {
    return api.get<CompletedTask[]>("/stats/tasks");
  },

  completedStreaks() {
    return api.get<CompletedStreak[]>("/stats/streaks");
  },
};
