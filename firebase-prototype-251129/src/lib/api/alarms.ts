/**
 * @file alarms.ts
 * @description 알람(Alarm) 관련 API 함수
 * 백엔드 API: GET /api/v1/alarms
 * 
 * 백엔드 응답 형식: { "success": true, "data": [...] }
 * client.ts에서 data 필드를 자동 추출함
 */

import { apiClient } from './client';
import {
  API_ENDPOINTS,
  Alarm,
  CreateAlarmRequest,
  BackendAlarm,
} from './types';

// ============================================================
// localStorage 키 (백엔드 실패 시 fallback)
// ============================================================

const STORAGE_KEY = 'focus-habit-alarms';

// ============================================================
// 백엔드 → 프론트엔드 필드 매핑
// ============================================================

/**
 * 백엔드 알람 데이터를 프론트엔드 Alarm 타입으로 변환
 * 백엔드 필드명(alarmTime, habit_id 등)을 프론트엔드 형식으로 매핑
 */
function mapBackendAlarm(backendAlarm: BackendAlarm): Alarm {
  return {
    id: backendAlarm.id,
    // 백엔드가 alarmTime 또는 time을 사용할 수 있음
    time: backendAlarm.alarmTime || backendAlarm.time || '00:00',
    label: backendAlarm.label,
    // 스네이크 케이스와 카멜 케이스 모두 지원
    habitId: backendAlarm.habitId || backendAlarm.habit_id,
    timerDurationMinutes: backendAlarm.timerDurationMinutes || backendAlarm.timer_duration_minutes,
  };
}

/**
 * 백엔드 알람 배열을 프론트엔드 형식으로 변환
 */
function mapBackendAlarms(backendAlarms: BackendAlarm[]): Alarm[] {
  return backendAlarms.map(mapBackendAlarm);
}

/**
 * localStorage에서 알람 조회 (fallback)
 */
function getLocalAlarms(): Alarm[] {
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

// ============================================================
// API 함수들
// ============================================================

/**
 * 알람 API 객체
 */
export const alarmApi = {
  /**
   * 모든 알람 조회
   * 백엔드 API: GET /api/v1/alarms
   * 백엔드 실패 시 localStorage에서 조회
   * @returns 알람 배열 (시간순 정렬)
   */
  async getAll(): Promise<Alarm[]> {
    try {
      // 실제 백엔드 API 호출
      const response = await apiClient.get<BackendAlarm[] | { content: BackendAlarm[] } | { data: BackendAlarm[] }>(API_ENDPOINTS.ALARMS);
      
      let backendAlarms: BackendAlarm[];
      
      if (Array.isArray(response)) {
        backendAlarms = response;
      } else if (response && typeof response === 'object' && 'content' in response && Array.isArray(response.content)) {
        // Spring Boot Pageable 응답
        backendAlarms = response.content;
      } else if (response && typeof response === 'object' && 'data' in response && Array.isArray(response.data)) {
        backendAlarms = response.data;
      } else {
        console.warn('[Front-API] ⚠️ 예상치 못한 알람 응답 형식, localStorage 사용:', response);
        return getLocalAlarms();
      }
      
      // 백엔드 필드명을 프론트엔드 형식으로 매핑
      const alarms = mapBackendAlarms(backendAlarms);
      
      console.log('[Front-API] ✅ 백엔드에서 알람 조회 성공:', alarms.length, '개');
      
      return alarms.sort((a, b) => a.time.localeCompare(b.time));
    } catch (error) {
      // 백엔드 실패 시 localStorage fallback
      console.warn('[Front-API] ⚠️ 백엔드 알람 조회 실패, localStorage 사용:', error);
      return getLocalAlarms();
    }
  },
  
  /**
   * 특정 알람 조회
   * @param id 알람 ID
   * @returns 알람 객체
   */
  async getById(id: string): Promise<Alarm | null> {
    try {
      const backendAlarm = await apiClient.get<BackendAlarm>(API_ENDPOINTS.ALARM_BY_ID(id));
      return backendAlarm ? mapBackendAlarm(backendAlarm) : null;
    } catch (error) {
      // Fallback: localStorage에서 찾기
      const localAlarms = getLocalAlarms();
      return localAlarms.find(a => a.id === id) || null;
    }
  },
  
  /**
   * 알람 생성
   * 백엔드 API: POST /api/v1/alarms
   * @param request 생성 요청 데이터
   * @returns 생성된 알람
   */
  async create(request: CreateAlarmRequest): Promise<Alarm> {
    try {
      const backendAlarm = await apiClient.post<BackendAlarm>(API_ENDPOINTS.ALARMS, request);
      return mapBackendAlarm(backendAlarm);
    } catch (error) {
      // Fallback: 로컬에서 생성
      console.warn('[Front-API] ⚠️ 알람 생성 실패, 로컬에서 임시 생성');
      return {
        id: crypto.randomUUID(),
        time: request.time,
        label: request.label,
        habitId: request.habitId,
        timerDurationMinutes: request.timerDurationMinutes,
      };
    }
  },
  
  /**
   * 알람 삭제
   * 백엔드 API: DELETE /api/v1/alarms/{id}
   * @param id 알람 ID
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.ALARM_BY_ID(id));
    } catch (error) {
      console.warn('[Front-API] ⚠️ 알람 삭제 API 실패 (로컬에서만 삭제됨)');
    }
  },
};

export default alarmApi;
