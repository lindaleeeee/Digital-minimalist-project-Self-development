/**
 * @file index.ts
 * @description API 모듈 통합 export
 * 
 * 사용 예시:
 * ```typescript
 * import { habitApi, logApi, alarmApi } from '@/lib/api';
 * 
 * // 습관 조회
 * const habits = await habitApi.getAll();
 * 
 * // 로그 생성
 * const newLog = await logApi.create({ ... });
 * 
 * // 알람 삭제
 * await alarmApi.delete(alarmId);
 * ```
 */

// API 클라이언트
export { apiClient } from './client';

// 도메인별 API
export { habitApi } from './habits';
export { logApi } from './logs';
export { alarmApi } from './alarms';

// 타입 및 상수
export {
  API_ENDPOINTS,
  ApiException,
  type ApiResponse,
  type ApiError,
  type CreateHabitRequest,
  type UpdateHabitRequest,
  type CreateLogRequest,
  type CreateAlarmRequest,
  type BackendAlarm,
  type BackendHabit,
  type Habit,
  type HabitLog,
  type Alarm,
} from './types';



