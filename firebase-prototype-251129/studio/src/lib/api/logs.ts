/**
 * @file logs.ts
 * @description 습관 로그(HabitLog) 관련 API 함수
 */

import { apiClient } from './client';
import {
  API_ENDPOINTS,
  HabitLog,
  CreateLogRequest,
} from './types';

// ============================================================
// localStorage 키 (Mock 모드용)
// ============================================================

const STORAGE_KEY = 'focus-habit-logs';

// ============================================================
// Mock 함수들 (localStorage 사용)
// ============================================================

/**
 * Mock: localStorage에서 로그 목록 조회
 */
function mockGetLogs(): HabitLog[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Mock: localStorage에 로그 목록 저장
 */
function mockSaveLogs(logs: HabitLog[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

/**
 * 밀리초를 시간 문자열로 변환
 */
function formatDuration(milliseconds: number): string {
  if (milliseconds < 0) milliseconds = 0;

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

// ============================================================
// API 함수들
// ============================================================

/**
 * 로그 API 객체
 */
export const logApi = {
  /**
   * 모든 로그 조회
   * @returns 로그 배열 (최신순)
   */
  async getAll(): Promise<HabitLog[]> {
    if (apiClient.isMockMode()) {
      console.log('[Front-API] Mock 모드: localStorage에서 logs 조회');
      return Promise.resolve(mockGetLogs());
    }
    
    try {
      const response = await apiClient.get<HabitLog[] | { content: HabitLog[] } | { data: HabitLog[] }>(API_ENDPOINTS.LOGS);
      
      let logs: HabitLog[];
      
      if (Array.isArray(response)) {
        logs = response;
      } else if (response && typeof response === 'object' && 'content' in response && Array.isArray(response.content)) {
        // Spring Boot Pageable 응답
        logs = response.content;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        logs = response.data;
      } else {
        console.warn('[Front-API] ⚠️ 예상치 못한 로그 응답 형식, localStorage 사용:', response);
        return mockGetLogs();
      }
      
      console.log('[Front-API] ✅ 백엔드에서 로그 조회 성공:', logs.length, '개');
      return logs;
    } catch (error) {
      console.warn('[Front-API] ⚠️ 백엔드 로그 조회 실패, localStorage 사용:', error);
      return mockGetLogs();
    }
  },
  
  /**
   * 특정 습관의 로그 조회
   * @param habitId 습관 ID
   * @returns 해당 습관의 로그 배열
   */
  async getByHabitId(habitId: string): Promise<HabitLog[]> {
    if (apiClient.isMockMode()) {
      const logs = mockGetLogs();
      return Promise.resolve(logs.filter(log => log.habitId === habitId));
    }
    
    try {
      const response = await apiClient.get<HabitLog[] | { content: HabitLog[] } | { data: HabitLog[] }>(`${API_ENDPOINTS.LOGS}?habitId=${habitId}`);
      
      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object' && 'content' in response && Array.isArray(response.content)) {
        return response.content;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('[Front-API] ⚠️ 예상치 못한 로그 응답 형식:', response);
        return [];
      }
    } catch (error) {
      console.warn('[Front-API] ⚠️ 습관별 로그 조회 실패:', error);
      const logs = mockGetLogs();
      return logs.filter(log => log.habitId === habitId);
    }
  },
  
  /**
   * 로그 생성
   * @param request 생성 요청 데이터
   * @returns 생성된 로그
   */
  async create(request: CreateLogRequest): Promise<HabitLog> {
    if (apiClient.isMockMode()) {
      console.log('[Front-API] Mock 모드: 새 log 생성', request);
      
      const logs = mockGetLogs();
      const durationMs = request.endTime - request.startTime;
      
      const newLog: HabitLog = {
        id: crypto.randomUUID(),
        habitId: request.habitId,
        note: request.note,
        startTime: request.startTime,
        endTime: request.endTime,
        duration: formatDuration(durationMs),
        keywords: [], // 백엔드에서 AI 추출 예정
        actualDurationMinutes: request.actualDurationMinutes,
        alarmTime: request.alarmTime,
        date: request.date,
        skipped: request.skipped,
      };
      
      // 최신 로그가 앞에 오도록 추가
      const updated = [newLog, ...logs];
      mockSaveLogs(updated);
      
      return Promise.resolve(newLog);
    }
    
    return apiClient.post<HabitLog>(API_ENDPOINTS.LOGS, request);
  },
  
  /**
   * 로그 삭제
   * @param id 로그 ID
   */
  async delete(id: string): Promise<void> {
    if (apiClient.isMockMode()) {
      console.log('[Front-API] Mock 모드: log 삭제', { id });
      
      const logs = mockGetLogs();
      const filtered = logs.filter(log => log.id !== id);
      mockSaveLogs(filtered);
      
      return Promise.resolve();
    }
    
    return apiClient.delete(API_ENDPOINTS.LOG_BY_ID(id));
  },
  
  /**
   * 로그 목록 일괄 저장 (Mock 모드 전용)
   * 기존 컴포넌트 호환을 위한 함수
   * @param logs 저장할 로그 배열
   */
  async saveAll(logs: HabitLog[]): Promise<void> {
    if (apiClient.isMockMode()) {
      console.log('[Front-API] Mock 모드: logs 일괄 저장', logs.length);
      mockSaveLogs(logs);
      return Promise.resolve();
    }
    
    console.warn('[Front-API] saveAll은 Mock 모드에서만 지원됩니다');
  },
};

export default logApi;



