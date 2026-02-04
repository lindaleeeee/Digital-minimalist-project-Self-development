/**
 * @file types.ts
 * @description Core domain definitions for the Digital Minimalist Habit application.
 * 
 * ⚠️ 중요: 이 파일의 타입은 백엔드 DTO와 동기화되어야 합니다.
 * 백엔드 참조: selfdevleop-backend-latest/src/main/java/.../dto/response/
 */
import type { LucideIcon } from "lucide-react";

/**
 * 요일 열거형 (백엔드 java.time.DayOfWeek과 일치)
 */
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

/**
 * 목표 유형: 시간 기반(매일 N분) 또는 일수 기반(주 N일)
 */
export type GoalType = 'time' | 'days';

/**
 * Represents a repeatable habit definition.
 * 
 * 백엔드 동기화: HabitResponse DTO
 * 
 * @property id - Unique ID (Long → string)
 * @property name - Display name (e.g., "Meditation")
 * @property icon - Lucide icon identifier or emoji
 * @property color - Hex color code (e.g., "#4A90E2")
 * @property activeDays - Active days of the week
 * @property defaultDuration - Default duration in minutes
 * @property isArchived - Soft delete flag
 * @property goalType - Goal type: 'time' or 'days'
 * @property dailyGoalMinutes - Daily goal in minutes
 * @property weeklyGoalMinutes - Weekly goal in minutes
 * @property monthlyGoalMinutes - Monthly goal in minutes
 * @property yearlyGoalMinutes - Yearly goal in minutes
 * @property daysPerWeek - Target days per week (1-7)
 * @property createdAt - ISO 8601 timestamp
 * @property updatedAt - ISO 8601 timestamp
 */
export interface Habit {
  id: string;
  name: string;
  icon: string;
  // 백엔드 필드
  color?: string;
  activeDays?: DayOfWeek[];
  defaultDuration?: number;
  isArchived?: boolean;
  // 목표 관련 필드
  goalType?: GoalType;
  dailyGoalMinutes?: number;
  weeklyGoalMinutes?: number;
  monthlyGoalMinutes?: number;
  yearlyGoalMinutes?: number;
  daysPerWeek?: number;
  // 타임스탬프
  createdAt?: string;
  updatedAt?: string;
  // 레거시 필드 (향후 제거 예정)
  targetCount?: number;
}

/**
 * Represents a single execution record of a habit.
 * 
 * 백엔드 동기화: LogEntryResponse DTO (구현 예정)
 * 
 * @property id - Unique ID
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
 * 
 * 백엔드 동기화: AlarmResponse DTO
 * 
 * @property id - Unique ID (Long → string)
 * @property alarmTime - 24h format string "HH:mm" (백엔드: LocalTime)
 * @property label - Alarm label/title
 * @property repeatDays - Repeat days of the week
 * @property habitId - Reference to the habit
 * @property habitName - Habit name (for display)
 * @property isEnabled - Alarm enabled status
 * @property timerDurationMinutes - Timer mode: planned duration in minutes
 * @property soundType - Alarm sound type
 * @property vibrationEnabled - Vibration enabled
 * @property snoozeIntervalMinutes - Snooze interval in minutes
 * @property maxSnoozeCount - Maximum snooze count
 */
export interface Alarm {
  id: string;
  alarmTime: string; // "HH:mm" - 백엔드 필드명과 일치
  label?: string;
  repeatDays?: DayOfWeek[];
  habitId?: string;
  habitName?: string;
  isEnabled?: boolean;
  timerDurationMinutes?: number;
  // 확장 기능 (MVP 이후)
  soundType?: string;
  vibrationEnabled?: boolean;
  snoozeIntervalMinutes?: number;
  maxSnoozeCount?: number;
  // 타임스탬프
  createdAt?: string;
  updatedAt?: string;
  // 레거시 필드 (하위 호환성)
  time?: string; // Deprecated: use alarmTime instead
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
