/**
 * @file habits.ts
 * @description 습관(Habit) 관련 API 함수
 * 
 * 백엔드 응답 형식: { "success": true, "data": [...] }
 * client.ts에서 data 필드를 자동 추출함
 */

import { apiClient } from './client';
import {
  API_ENDPOINTS,
  Habit,
  CreateHabitRequest,
  UpdateHabitRequest,
  BackendHabit,
} from './types';
import type { GoalType } from '@/lib/types';

// ============================================================
// localStorage 키 (Mock 모드용)
// ============================================================

const STORAGE_KEY = 'focus-habit-habits';

// ============================================================
// 백엔드 → 프론트엔드 필드 매핑
// ============================================================

/**
 * 백엔드 습관 데이터를 프론트엔드 Habit 타입으로 변환
 * 스네이크 케이스와 카멜 케이스 모두 지원
 */
function mapBackendHabit(backendHabit: BackendHabit): Habit {
  return {
    id: backendHabit.id,
    name: backendHabit.name,
    icon: backendHabit.icon || 'FileText',
    goalType: (backendHabit.goalType || backendHabit.goal_type || 'time') as GoalType,
    daysPerWeek: backendHabit.daysPerWeek ?? backendHabit.days_per_week ?? 7,
    dailyGoalMinutes: backendHabit.dailyGoalMinutes ?? backendHabit.daily_goal_minutes ?? 30,
    weeklyGoalMinutes: backendHabit.weeklyGoalMinutes ?? backendHabit.weekly_goal_minutes ?? 210,
    monthlyGoalMinutes: backendHabit.monthlyGoalMinutes ?? backendHabit.monthly_goal_minutes,
    yearlyGoalMinutes: backendHabit.yearlyGoalMinutes ?? backendHabit.yearly_goal_minutes,
  };
}

/**
 * 백엔드 습관 배열을 프론트엔드 형식으로 변환
 */
function mapBackendHabits(backendHabits: BackendHabit[]): Habit[] {
  return backendHabits.map(mapBackendHabit);
}

// ============================================================
// Mock 데이터
// ============================================================

const defaultHabits: Habit[] = [
  { id: '1', name: '명상', icon: 'Brain', goalType: 'time', daysPerWeek: 7, dailyGoalMinutes: 30, weeklyGoalMinutes: 210 },
  { id: '2', name: '독서', icon: 'BookOpen', goalType: 'time', daysPerWeek: 7, dailyGoalMinutes: 30, weeklyGoalMinutes: 210 },
  { id: '3', name: '영어', icon: 'SpellCheck', goalType: 'time', daysPerWeek: 7, dailyGoalMinutes: 30, weeklyGoalMinutes: 210 },
  { id: '4', name: '운동', icon: 'Dumbbell', goalType: 'time', daysPerWeek: 7, dailyGoalMinutes: 30, weeklyGoalMinutes: 210 },
  { id: '5', name: '영양제', icon: 'Pill', goalType: 'time', daysPerWeek: 7, dailyGoalMinutes: 5, weeklyGoalMinutes: 35 },
];

// ============================================================
// Mock 함수들 (localStorage 사용)
// ============================================================

/**
 * Mock: localStorage에서 습관 목록 조회
 */
function mockGetHabits(): Habit[] {
  if (typeof window === 'undefined') return defaultHabits;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultHabits;
    }
  }
  return defaultHabits;
}

/**
 * Mock: localStorage에 습관 목록 저장
 */
function mockSaveHabits(habits: Habit[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

// ============================================================
// API 함수들
// ============================================================

/**
 * 습관 API 객체
 */
export const habitApi = {
  /**
   * 모든 습관 조회
   * 백엔드 실패 시 localStorage fallback
   * @returns 습관 배열
   */
  async getAll(): Promise<Habit[]> {
    if (apiClient.isMockMode()) {
      // Mock: localStorage에서 조회
      console.log('[Front-API] Mock 모드: localStorage에서 habits 조회');
      return Promise.resolve(mockGetHabits());
    }
    
    try {
      // 실제 백엔드 API 호출
      const response = await apiClient.get<BackendHabit[] | { data: BackendHabit[] } | { content: BackendHabit[] }>(API_ENDPOINTS.HABITS);
      
      // 응답 구조에 따라 데이터 추출
      let backendHabits: BackendHabit[];
      
      if (Array.isArray(response)) {
        // 응답이 직접 배열인 경우
        backendHabits = response;
      } else if (response && typeof response === 'object' && 'content' in response && Array.isArray(response.content)) {
        // Spring Boot Pageable 응답: { content: [...], pageable: {...}, ... }
        backendHabits = response.content;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        // 응답이 { data: [...] } 형태인 경우
        backendHabits = response.data;
      } else {
        // 예상치 못한 형식인 경우 빈 배열 반환
        console.warn('[Front-API] ⚠️ 예상치 못한 응답 형식, localStorage 사용:', response);
        return mockGetHabits();
      }
      
      // 백엔드 필드명을 프론트엔드 형식으로 매핑
      const habits = mapBackendHabits(backendHabits);
      
      console.log('[Front-API] ✅ 백엔드에서 습관 조회 성공:', habits.length, '개');
      
      return habits;
    } catch (error) {
      // 백엔드 실패 시 localStorage fallback
      console.warn('[Front-API] ⚠️ 백엔드 습관 조회 실패, localStorage 사용:', error);
      return mockGetHabits();
    }
  },
  
  /**
   * 특정 습관 조회
   * @param id 습관 ID
   * @returns 습관 객체
   */
  async getById(id: string): Promise<Habit | null> {
    if (apiClient.isMockMode()) {
      const habits = mockGetHabits();
      return Promise.resolve(habits.find(h => h.id === id) || null);
    }
    
    try {
      const backendHabit = await apiClient.get<BackendHabit>(API_ENDPOINTS.HABIT_BY_ID(id));
      return backendHabit ? mapBackendHabit(backendHabit) : null;
    } catch (error) {
      // Fallback: localStorage에서 찾기
      const habits = mockGetHabits();
      return habits.find(h => h.id === id) || null;
    }
  },
  
  /**
   * 습관 생성
   * @param request 생성 요청 데이터
   * @returns 생성된 습관
   */
  async create(request: CreateHabitRequest): Promise<Habit> {
    if (apiClient.isMockMode()) {
      console.log('[Front-API] Mock 모드: 새 habit 생성', request);
      
      const habits = mockGetHabits();
      const dailyMinutes = request.dailyGoalMinutes || 30;
      const daysPerWeek = request.daysPerWeek || 7;
      
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name: request.name,
        icon: request.icon || 'FileText',
        goalType: request.goalType || 'time',
        daysPerWeek,
        dailyGoalMinutes: dailyMinutes,
        weeklyGoalMinutes: dailyMinutes * daysPerWeek,
        monthlyGoalMinutes: dailyMinutes * daysPerWeek * 4,
        yearlyGoalMinutes: dailyMinutes * daysPerWeek * 52,
      };
      
      const updated = [...habits, newHabit];
      mockSaveHabits(updated);
      
      return Promise.resolve(newHabit);
    }
    
    try {
      const backendHabit = await apiClient.post<BackendHabit>(API_ENDPOINTS.HABITS, request);
      return mapBackendHabit(backendHabit);
    } catch (error) {
      // Fallback: 로컬에서 생성
      console.warn('[Front-API] ⚠️ 습관 생성 API 실패, 로컬에서 생성');
      const habits = mockGetHabits();
      const dailyMinutes = request.dailyGoalMinutes || 30;
      const daysPerWeek = request.daysPerWeek || 7;
      
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        name: request.name,
        icon: request.icon || 'FileText',
        goalType: request.goalType || 'time',
        daysPerWeek,
        dailyGoalMinutes: dailyMinutes,
        weeklyGoalMinutes: dailyMinutes * daysPerWeek,
        monthlyGoalMinutes: dailyMinutes * daysPerWeek * 4,
        yearlyGoalMinutes: dailyMinutes * daysPerWeek * 52,
      };
      
      mockSaveHabits([...habits, newHabit]);
      return newHabit;
    }
  },
  
  /**
   * 습관 수정
   * @param id 습관 ID
   * @param request 수정 요청 데이터
   * @returns 수정된 습관
   */
  async update(id: string, request: UpdateHabitRequest): Promise<Habit> {
    if (apiClient.isMockMode()) {
      console.log('[Front-API] Mock 모드: habit 수정', { id, request });
      
      const habits = mockGetHabits();
      const index = habits.findIndex(h => h.id === id);
      
      if (index === -1) {
        throw new Error(`Habit not found: ${id}`);
      }
      
      const updated: Habit = { ...habits[index], ...request };
      
      // 목표 시간 자동 계산
      if (updated.goalType === 'time') {
        const dailyMinutes = updated.dailyGoalMinutes || 30;
        const daysPerWeek = updated.daysPerWeek || 7;
        updated.weeklyGoalMinutes = dailyMinutes * daysPerWeek;
        updated.monthlyGoalMinutes = dailyMinutes * daysPerWeek * 4;
        updated.yearlyGoalMinutes = dailyMinutes * daysPerWeek * 52;
      }
      
      habits[index] = updated;
      mockSaveHabits(habits);
      
      return Promise.resolve(updated);
    }
    
    try {
      const backendHabit = await apiClient.put<BackendHabit>(API_ENDPOINTS.HABIT_BY_ID(id), request);
      return mapBackendHabit(backendHabit);
    } catch (error) {
      // Fallback: 로컬에서 수정
      console.warn('[Front-API] ⚠️ 습관 수정 API 실패, 로컬에서 수정');
      const habits = mockGetHabits();
      const index = habits.findIndex(h => h.id === id);
      
      if (index === -1) {
        throw new Error(`Habit not found: ${id}`);
      }
      
      const updated: Habit = { ...habits[index], ...request };
      if (updated.goalType === 'time') {
        const dailyMinutes = updated.dailyGoalMinutes || 30;
        const daysPerWeek = updated.daysPerWeek || 7;
        updated.weeklyGoalMinutes = dailyMinutes * daysPerWeek;
      }
      
      habits[index] = updated;
      mockSaveHabits(habits);
      return updated;
    }
  },
  
  /**
   * 습관 삭제
   * @param id 습관 ID
   */
  async delete(id: string): Promise<void> {
    if (apiClient.isMockMode()) {
      console.log('[Front-API] Mock 모드: habit 삭제', { id });
      
      const habits = mockGetHabits();
      const filtered = habits.filter(h => h.id !== id);
      mockSaveHabits(filtered);
      
      return Promise.resolve();
    }
    
    try {
      await apiClient.delete(API_ENDPOINTS.HABIT_BY_ID(id));
    } catch (error) {
      // Fallback: 로컬에서 삭제
      console.warn('[Front-API] ⚠️ 습관 삭제 API 실패, 로컬에서 삭제');
      const habits = mockGetHabits();
      const filtered = habits.filter(h => h.id !== id);
      mockSaveHabits(filtered);
    }
  },
  
  /**
   * 습관 목록 일괄 저장 (Mock 모드 전용)
   * 기존 컴포넌트 호환을 위한 함수
   * @param habits 저장할 습관 배열
   */
  async saveAll(habits: Habit[]): Promise<void> {
    if (apiClient.isMockMode()) {
      console.log('[Front-API] Mock 모드: habits 일괄 저장', habits.length);
      mockSaveHabits(habits);
      return Promise.resolve();
    }
    
    // 실제 API에서는 개별 업데이트 수행
    // 추후 백엔드에 bulk update API 추가 시 변경
    console.warn('[Front-API] saveAll은 Mock 모드에서만 지원됩니다');
  },
};

export default habitApi;



