export interface Module {
  id: number;
  number: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  duration_weeks: string | null;
  icon: string | null;
  sort_order: number;
  progress?: number;
}

export interface Unit {
  id: number;
  module_id: number;
  number: string;
  title: string;
  objective: string | null;
  sort_order: number;
  progress?: number;
}

export interface Topic {
  id: number;
  unit_id: number;
  title: string;
  content: string | null;
  sort_order: number;
}

export type ActivityType =
  | 'flashcard'
  | 'quiz'
  | 'fill-blanks'
  | 'matching'
  | 'writing'
  | 'dictation'
  | 'roleplay'
  | 'audio';

export interface ActivityConfig {
  [key: string]: unknown;
}

export interface Activity {
  id: number;
  unit_id: number;
  code: string;
  title: string;
  description: string | null;
  activity_type: ActivityType;
  config: ActivityConfig | null;
  sort_order: number;
  completed?: boolean;
  score?: number | null;
}

export interface Flashcard {
  id: number;
  activity_id: number;
  front: string;
  back: string;
  hints: string | null;
  sort_order: number;
}

export interface QuizQuestion {
  id: number;
  activity_id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string | null;
  sort_order: number;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface ActivityProgress {
  activityId: number;
  completed: boolean;
  score: number | null;
  attempts: number;
}

export interface AppSettings {
  theme: 'dark' | 'light';
}
