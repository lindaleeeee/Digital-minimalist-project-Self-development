/**
 * @file types.ts
 * @description API 관련 타입 정의 - 요청/응답 타입 및 엔드포인트 상수
 */

import type { Habit, HabitLog, Alarm, GoalType } from '@/lib/types';

// ============================================================
// API 엔드포인트 상수
// ============================================================

/**
 * API 엔드포인트 경로 상수
 * 백엔드 연동 시 이 상수만 수정하면 됨
 */
export const API_ENDPOINTS = {
  // Habits
  HABITS: '/api/v1/habits',
  HABIT_BY_ID: (id: string) => `/api/v1/habits/${id}`,
  
  // HabitLogs
  LOGS: '/api/v1/logs',
  LOG_BY_ID: (id: string) => `/api/v1/logs/${id}`,
  
  // Alarms
  ALARMS: '/api/v1/alarms',
  ALARM_BY_ID: (id: string) => `/api/v1/alarms/${id}`,
} as const;

// ============================================================
// 공통 응답 타입
// ============================================================

/**
 * API 성공 응답 래퍼
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * API 에러 응답
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
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
// Habit 요청 타입
// ============================================================

/**
 * 습관 생성 요청
 */
export interface CreateHabitRequest {
  name: string;
  icon?: string;
  goalType?: GoalType;
  daysPerWeek?: number;
  dailyGoalMinutes?: number;
}

/**
 * 습관 수정 요청
 */
export interface UpdateHabitRequest {
  name?: string;
  icon?: string;
  goalType?: GoalType;
  daysPerWeek?: number;
  dailyGoalMinutes?: number;
  weeklyGoalMinutes?: number;
  monthlyGoalMinutes?: number;
  yearlyGoalMinutes?: number;
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
// Alarm 요청 타입
// ============================================================

/**
 * 알람 생성 요청
 */
export interface CreateAlarmRequest {
  time: string; // "HH:mm"
  label?: string;
  habitId?: string;
  timerDurationMinutes?: number;
}

// ============================================================
// 백엔드 응답 타입 (필드명 매핑용)
// ============================================================

/**
 * 백엔드에서 반환하는 알람 데이터 형식
 * 프론트엔드 Alarm 타입으로 변환 필요
 */
export interface BackendAlarm {
  id: string;
  alarmTime?: string;  // 백엔드: alarmTime
  time?: string;       // 또는 time
  label?: string;
  habitId?: string;
  habit_id?: string;   // 스네이크 케이스 지원
  timerDurationMinutes?: number;
  timer_duration_minutes?: number;
}

/**
 * 백엔드에서 반환하는 습관 데이터 형식
 */
export interface BackendHabit {
  id: string;
  name: string;
  icon?: string;
  goalType?: string;
  goal_type?: string;
  daysPerWeek?: number;
  days_per_week?: number;
  dailyGoalMinutes?: number;
  daily_goal_minutes?: number;
  weeklyGoalMinutes?: number;
  weekly_goal_minutes?: number;
  monthlyGoalMinutes?: number;
  monthly_goal_minutes?: number;
  yearlyGoalMinutes?: number;
  yearly_goal_minutes?: number;
}

// ============================================================
// 타입 Re-export (편의상)
// ============================================================

export type { Habit, HabitLog, Alarm };

