// services/streaks.ts


import { api } from "./api";

export interface ApiStreak {
  id: string;
  user_id?: string;
  title: string;
  duration_seconds: number;
  cooldown_end: string | null;
  created_at: string;
  updated_at: string | null;
  streak_count: number;
  last_tap_at: string | null;
  paused?: boolean | null;
}

export interface CreateStreakPayload {
  title: string;
  duration_seconds: number;
}

export interface UpdateStreakPayload {
  title?: string;
  duration_seconds?: number;
  cooldown_end?: string | null;
  streak_count?: number;
  last_tap_at?: string | null;
  paused?: boolean | null;
}

export interface CompleteStreakPayload {
  total_intervals: number;
  successful_intervals: number;
  failed_intervals: number;
  calendar_data: Record<string, { status: string; index: number }>;
}

export const StreaksService = {
  list() {
    return api.get<ApiStreak[]>("/streaks");
  },

  create(payload: CreateStreakPayload) {
    return api.post<ApiStreak>("/streaks", payload);
  },

  update(id: string, payload: UpdateStreakPayload) {
    return api.patch<ApiStreak>(`/streaks/${id}`, payload);
  },

  delete(id: string) {
    return api.delete<void>(`/streaks/${id}`);
  },

  tap(id: string) {
    return api.post<ApiStreak>(`/streaks/${id}/tap`);
  },

  expire(id: string) {
    return api.post<ApiStreak>(`/streaks/${id}/expire`);
  },

  pause(id: string, paused: boolean) {
    return api.post<ApiStreak>(`/streaks/${id}/pause`, { paused });
  },

  complete(id: string, payload: CompleteStreakPayload) {
    return api.post<void>(`/streaks/${id}/complete`, payload);
  },
};
