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
  date: string;
  alarmTime: string;
  habitName: string;
  actualDuration: number;
  yearlyGoal: number;
  yearlyActual: number;
  monthlyGoal: number;
  monthlyActual: number;
  weeklyGoal: number;
  weeklyActual: number;
  dailyGoal: number;
  dailyActual: number;
}

// ============================================================
// Habit Coin 시스템 타입
// ============================================================

/** 목표 우선순위 */
export type GoalPriority = 'urgent' | 'medium' | 'habit';

/** Studymate 유형 */
export type Studymate = 'mom' | 'dad' | 'sibling' | 'friend';

/** 우선순위 한글 라벨 */
export const PRIORITY_LABELS: Record<GoalPriority, string> = {
  urgent: '긴급',
  medium: '중급',
  habit: '습관만들기',
};

/** Studymate 한글 라벨 */
export const STUDYMATE_LABELS: Record<Studymate, string> = {
  mom: '엄마',
  dad: '아빠',
  sibling: '동생',
  friend: '친구',
};

/** 우선순위별 색상 */
export const PRIORITY_COLORS: Record<GoalPriority, string> = {
  urgent: '#EF4444',
  medium: '#F59E0B',
  habit: '#22C55E',
};

/**
 * 날짜별 목표
 */
export interface Goal {
  id: string;
  name: string;
  priority: GoalPriority;
  studymate: Studymate;
  timerMinutes: number;
  date: string; // yyyy-MM-dd
  achievementPercent?: number;
  verified: boolean;
  verifyNote?: string;
  createdAt: string;
}

/**
 * 일일 코인 기록
 */
export interface DailyRecord {
  date: string; // yyyy-MM-dd
  attendanceCoins: number;
  urgentDeduction: number;
  bonusCoins: number;
  totalCoins: number;
  loginRecorded: boolean;
}

/**
 * 코인 거래 내역
 */
export interface CoinTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
}

/**
 * 상점 상품
 */
export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  description: string;
}

/** 기본 상점 상품 리스트 */
export const SHOP_ITEMS: ShopItem[] = [
  { id: 'phone-1h', name: '휴대폰 1시간', icon: '📱', price: 200, description: '1시간 동안 자유롭게 휴대폰 사용' },
  { id: 'phone-2h', name: '휴대폰 2시간', icon: '📱', price: 400, description: '2시간 동안 자유롭게 휴대폰 사용' },
  { id: 'chicken', name: '치킨', icon: '🍗', price: 2000, description: '맛있는 치킨 한 마리' },
  { id: 'concert', name: '콘서트 티켓', icon: '🎵', price: 10000, description: '좋아하는 아티스트 콘서트' },
];

/** 긴급 목표 하루 최대 개수 */
export const MAX_URGENT_GOALS_PER_DAY = 5;

/** 하루 최대 코인 */
export const MAX_DAILY_COINS = 200;

/** 출석 보상 코인 */
export const ATTENDANCE_COINS = 100;

/** 달성 보상 최대 코인 */
export const ACHIEVEMENT_MAX_COINS = 100;

