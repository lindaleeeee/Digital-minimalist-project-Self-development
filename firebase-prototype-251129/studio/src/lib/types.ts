/**
 * @file types.ts
 * @description Core domain definitions for the Digital Minimalist Habit application.
 */
import type { LucideIcon } from "lucide-react";

/**
 * 목표 유형: 시간 기반(매일 N분) 또는 일수 기반(주 N일)
 */
export type GoalType = 'time' | 'days';

/**
 * Represents a repeatable habit definition.
 * @property id - Unique UUID
 * @property name - Display name (e.g., "Meditation")
 * @property icon - Lucide icon identifier
 * @property goalType - 목표 유형: 'time'(시간) 또는 'days'(일수)
 * @property daysPerWeek - 주당 목표 일수 (1-7, 7이면 매일)
 * @property dailyGoalMinutes - 일일 목표 시간(분), goalType='time'일 때만 사용
 */
export interface Habit {
  id: string;
  name: string;
  icon: string; // Lucide icon name as string
  targetCount?: number;
  goalType?: GoalType; // 'time' | 'days'
  daysPerWeek?: number; // 주당 목표 일수 (1-7)
  dailyGoalMinutes?: number; // 일일 목표 시간(분) - goalType='time'일 때
  weeklyGoalMinutes?: number; // 주간 목표
  monthlyGoalMinutes?: number; // 월간 목표
  yearlyGoalMinutes?: number; // 연간 목표
}

/**
 * Represents a single execution record of a habit.
 * @property id - Unique UUID
 * @property habitId - Reference to the parent Habit
 * @property note - User reflection/notes
 * @property keywords - AI-extracted tags from the note
 */
export interface HabitLog {
  id: string;
  habitId: string;
  note: string;
  startTime: number; // UTC timestamp
  endTime: number; // UTC timestamp
  duration: string;
  keywords: string[];
  actualDurationMinutes?: number; // Actual time spent on habit
  alarmTime?: string; // Original alarm time "HH:mm"
  date?: string; // Date of the log "yyyy-MM-dd"
  skipped?: boolean; // Whether the user chose "Did Not Do"
}

/**
 * Represents a scheduled daily reminder.
 * @property time - 24h format string "HH:mm"
 * @property timerDurationMinutes - Timer mode: planned duration in minutes
 */
export interface Alarm {
  id: string;
  time: string; // "HH:mm"
  label?: string;
  habitId?: string; // Reference to the habit
  timerDurationMinutes?: number; // 타이머 모드에서 설정한 시간(분)
}

/**
 * Represents a row in the history DB (Excel export format)
 */
export interface HistoryRecord {
  date: string; // 알람 세팅한 날짜
  alarmTime: string; // 알람 세팅한 시간
  habitName: string; // 세팅한 목표
  actualDuration: number; // 목표를 얼마나 시행했는지 실행시간
  yearlyGoal: number; // 기존 세팅된 연목표 시간
  yearlyActual: number; // 연 실행시간(누적)
  monthlyGoal: number; // 월목표시간
  monthlyActual: number; // 월 실행시간(누적)
  weeklyGoal: number; // 주 목표시간
  weeklyActual: number; // 주 실행시간(누적)
  dailyGoal: number; // 일 목표시간
  dailyActual: number; // 일 실행시간
}
