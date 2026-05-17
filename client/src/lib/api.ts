import type { Module, Unit, Activity, Flashcard, QuizQuestion, ActivityProgress } from '@/types';

const BASE = '/api';

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  modules: () => fetchJSON<Module[]>('/modules'),
  module: (id: number) => fetchJSON<Module>(`/modules/${id}`),
  unit: (id: number) => fetchJSON<Unit & { topics: any[]; activities: Activity[] }>(`/units/${id}`),

  activity: (id: number) =>
    fetchJSON<Activity & { data?: Flashcard[] | QuizQuestion[] }>(`/activities/${id}`),

  flashcards: (activityId: number) => fetchJSON<Flashcard[]>(`/flashcards/${activityId}`),
  quizQuestions: (activityId: number) => fetchJSON<QuizQuestion[]>(`/quiz/${activityId}`),

  submitProgress: (activityId: number, data: Partial<ActivityProgress>) =>
    fetchJSON<ActivityProgress>('/progress', {
      method: 'POST',
      body: JSON.stringify({ activity_id: activityId, ...data }),
    }),

  progress: () => fetchJSON<ActivityProgress[]>('/progress'),
  settings: () => fetchJSON<{ theme: string }>('/settings'),
  updateSettings: (data: { theme: string }) =>
    fetchJSON('/settings', { method: 'PUT', body: JSON.stringify(data) }),
};
