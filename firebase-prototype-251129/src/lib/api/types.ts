/**
 * @file types.ts
 * @description API 관련 타입 정의 - 요청/응답 타입 및 엔드포인트 상수
 * 
 * ⚠️ 중요: 이 파일의 타입은 백엔드 DTO와 동기화되어야 합니다.
 * 백엔드 참조: selfdevleop-backend-latest/src/main/java/.../dto/
 */

import type { Habit, HabitLog, Alarm, GoalType, DayOfWeek } from '@/lib/types';

// ============================================================
// API 엔드포인트 상수
// ============================================================

/**
 * API 엔드포인트 경로 상수
 * 백엔드 연동 시 이 상수만 수정하면 됨
 */
export const API_ENDPOINTS = {
  // Health Check
  HEALTH: '/api/v1/health',
  HEALTH_PING: '/api/v1/health/ping',
  
  // Habits
  HABITS: '/api/v1/habits',
  HABIT_BY_ID: (id: string) => `/api/v1/habits/${id}`,
  
  // HabitLogs
  LOGS: '/api/v1/logs',
  LOG_BY_ID: (id: string) => `/api/v1/logs/${id}`,
  
  // Alarms
  ALARMS: '/api/v1/alarms',
  ALARM_BY_ID: (id: string) => `/api/v1/alarms/${id}`,
  ALARM_TOGGLE: (id: string) => `/api/v1/alarms/${id}/toggle`,
} as const;

// ============================================================
// 공통 응답 타입
// ============================================================

/**
 * API 성공 응답 래퍼 (백엔드 ApiResponse<T>와 일치)
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: ApiErrorInfo | null;
}

/**
 * API 에러 정보 (백엔드 ApiResponse.ErrorInfo와 일치)
 */
export interface ApiErrorInfo {
  code: string;
  message: string;
}

/**
 * API 에러 클래스
 */
export class ApiException extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status?: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiException';
  }
}

// ============================================================
// Habit 요청 타입 (백엔드 CreateHabitRequest와 일치)
// ============================================================

/**
 * 습관 생성 요청
 */
export interface CreateHabitRequest {
  name: string;
  icon: string;
  color?: string;
  activeDays: DayOfWeek[];
  defaultDuration?: number;
  // 목표 관련 필드
  goalType?: GoalType;
  dailyGoalMinutes?: number;
  weeklyGoalMinutes?: number;
  monthlyGoalMinutes?: number;
  yearlyGoalMinutes?: number;
  daysPerWeek?: number;
}

/**
 * 습관 수정 요청
 */
export interface UpdateHabitRequest {
  name?: string;
  icon?: string;
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
}

// ============================================================
// HabitLog 요청 타입
// ============================================================

/**
 * 습관 로그 생성 요청
 */
export interface CreateLogRequest {
  habitId: string;
  note: string;
  startTime: number;
  endTime: number;
  actualDurationMinutes?: number;
  alarmTime?: string;
  date?: string;
  skipped?: boolean;
}

// ============================================================
// Alarm 요청 타입 (백엔드 CreateAlarmRequest와 일치)
// ============================================================

/**
 * 알람 생성 요청
 */
export interface CreateAlarmRequest {
  alarmTime: string; // "HH:mm" format (LocalTime)
  label?: string;
  repeatDays: DayOfWeek[];
  habitId?: number; // Long (백엔드)
  // 확장 기능
  soundType?: string;
  vibrationEnabled?: boolean;
  snoozeIntervalMinutes?: number;
  maxSnoozeCount?: number;
  timerDurationMinutes?: number;
}

/**
 * 알람 수정 요청
 */
export interface UpdateAlarmRequest {
  alarmTime?: string;
  label?: string;
  repeatDays?: DayOfWeek[];
  habitId?: number;
  isEnabled?: boolean;
  soundType?: string;
  vibrationEnabled?: boolean;
  snoozeIntervalMinutes?: number;
  maxSnoozeCount?: number;
  timerDurationMinutes?: number;
}

// ============================================================
// 백엔드 응답 타입 (필드명 매핑용)
// ============================================================

/**
 * 백엔드에서 반환하는 습관 데이터 형식 (HabitResponse DTO)
 */
export interface BackendHabit {
  id: number; // Long
  name: string;
  icon: string;
  color?: string;
  activeDays?: DayOfWeek[];
  defaultDuration?: number;
  isArchived?: boolean;
  goalType?: string;
  dailyGoalMinutes?: number;
  weeklyGoalMinutes?: number;
  monthlyGoalMinutes?: number;
  yearlyGoalMinutes?: number;
  daysPerWeek?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 백엔드에서 반환하는 알람 데이터 형식 (AlarmResponse DTO)
 */
export interface BackendAlarm {
  id: number; // Long
  alarmTime: string; // LocalTime → "HH:mm"
  label?: string;
  repeatDays?: DayOfWeek[];
  habitId?: number;
  habitName?: string;
  soundType?: string;
  vibrationEnabled?: boolean;
  snoozeIntervalMinutes?: number;
  maxSnoozeCount?: number;
  isEnabled?: boolean;
  timerDurationMinutes?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// 매핑 함수
// ============================================================

/**
 * 백엔드 Habit → 프론트엔드 Habit 변환
 */
export function mapBackendHabit(backend: BackendHabit): Habit {
  return {
    id: String(backend.id),
    name: backend.name,
    icon: backend.icon,
    color: backend.color,
    activeDays: backend.activeDays,
    defaultDuration: backend.defaultDuration,
    isArchived: backend.isArchived ?? false,
    goalType: (backend.goalType as GoalType) ?? 'time',
    dailyGoalMinutes: backend.dailyGoalMinutes,
    weeklyGoalMinutes: backend.weeklyGoalMinutes,
    monthlyGoalMinutes: backend.monthlyGoalMinutes,
    yearlyGoalMinutes: backend.yearlyGoalMinutes,
    daysPerWeek: backend.daysPerWeek,
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt,
  };
}

/**
 * 백엔드 Alarm → 프론트엔드 Alarm 변환
 */
export function mapBackendAlarm(backend: BackendAlarm): Alarm {
  return {
    id: String(backend.id),
    alarmTime: backend.alarmTime,
    time: backend.alarmTime, // 레거시 호환성
    label: backend.label,
    repeatDays: backend.repeatDays,
    habitId: backend.habitId ? String(backend.habitId) : undefined,
    habitName: backend.habitName,
    soundType: backend.soundType,
    vibrationEnabled: backend.vibrationEnabled,
    snoozeIntervalMinutes: backend.snoozeIntervalMinutes,
    maxSnoozeCount: backend.maxSnoozeCount,
    isEnabled: backend.isEnabled ?? true,
    timerDurationMinutes: backend.timerDurationMinutes,
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt,
  };
}

// ============================================================
// 타입 Re-export (편의상)
// ============================================================

export type { Habit, HabitLog, Alarm, GoalType, DayOfWeek };
