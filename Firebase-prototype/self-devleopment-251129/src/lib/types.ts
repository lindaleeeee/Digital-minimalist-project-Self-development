import type { LucideIcon } from "lucide-react";

export interface Habit {
  id: string;
  name: string;
  icon: string; // Lucide icon name as string
  targetCount?: number;
}

export interface HabitLog {
  id: string;
  habitId: string;
  note: string;
  startTime: number; // UTC timestamp
  endTime: number; // UTC timestamp
  duration: string;
  keywords: string[];
}

export interface Alarm {
  id:string;
  time: string; // "HH:mm"
  label?: string;
}
