// services/tasks.ts


import { api } from "./api";

export interface ApiTask {
  id: string;
  user_id?: string;
  title: string;
  is_completed: boolean;
  color: string;
  due_date: string | null;
  order_index?: number;
}

export interface UiTask {
  id: string;
  text: string;
  completed: boolean;
  color: string;
  dueDate: Date;
}

export interface CreateTaskPayload {
  title: string;
  color: string;
  due_date: string | null;
  order_index: number;
}

export interface UpdateTaskPayload {
  title?: string;
  color?: string;
  due_date?: string | null;
  order_index?: number;
  is_completed?: boolean;
}

export interface ReorderEntry {
  id: string;
  order_index: number;
}

export function toUiTask(t: ApiTask): UiTask {
  return {
    id: String(t.id),
    text: t.title,
    completed: !!t.is_completed,
    color: t.color,
    dueDate: t.due_date ? new Date(t.due_date) : new Date(),
  };
}

export const TasksService = {
  async list(): Promise<UiTask[]> {
    const data = await api.get<ApiTask[]>("/tasks");
    return (data ?? []).map(toUiTask);
  },

  async create(payload: CreateTaskPayload): Promise<UiTask> {
    const data = await api.post<ApiTask>("/tasks", payload);
    return toUiTask(data);
  },

  async update(id: string, payload: UpdateTaskPayload): Promise<UiTask> {
    const data = await api.patch<ApiTask>(`/tasks/${id}`, payload);
    return toUiTask(data);
  },

  delete(id: string): Promise<void> {
    return api.delete(`/tasks/${id}`);
  },

  complete(id: string): Promise<void> {
    return api.post(`/tasks/${id}/complete`);
  },

  undoComplete(id: string): Promise<void> {
    return api.post(`/tasks/${id}/undo-complete`);
  },

  reorder(entries: ReorderEntry[]): Promise<void> {
    return api.patch("/tasks/reorder", { tasks: entries });
  },
};
