/**
 * @file client.ts
 * @description API 클라이언트 - fetch 기반 HTTP 요청 래퍼
 * 모든 API 호출은 이 클라이언트를 통해 수행됨
 */

import { ApiException } from './types';

// ============================================================
// 환경 설정
// ============================================================

/**
 * API 기본 URL
 * - 개발: 프록시 사용 시 빈 문자열
 * - 프로덕션: 백엔드 서버 주소
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/**
 * Mock 모드 여부
 * true일 경우 실제 API 호출 대신 localStorage 사용
 */
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_API_MOCK === 'true';

/**
 * API 요청 타임아웃 (ms)
 */
const REQUEST_TIMEOUT = 10000;

// ============================================================
// 로깅 유틸리티
// ============================================================

/**
 * API 호출 로깅
 * @param method HTTP 메서드
 * @param url 요청 URL
 * @param phase 호출 단계 (시작/완료/에러)
 * @param details 추가 정보
 */
function logApiCall(
  method: string,
  url: string,
  phase: 'start' | 'complete' | 'error',
  details?: unknown
): void {
  const prefix = '[Front-API]';
  
  switch (phase) {
    case 'start':
      console.log(`${prefix} 데이터 가져오기 시작: ${method} ${url}`);
      break;
    case 'complete':
      console.log(`${prefix} 데이터 가져오기 완료: ${method} ${url}`, details ?? '');
      break;
    case 'error':
      console.error(`${prefix} 에러 발생!`, { method, url, error: details });
      break;
  }
}

// ============================================================
// HTTP 클라이언트
// ============================================================

/**
 * HTTP 요청 옵션
 */
interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * 타임아웃 적용된 fetch
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 응답 파싱 및 에러 처리
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  // JSON 응답이 아닌 경우
  if (!contentType?.includes('application/json')) {
    if (!response.ok) {
      throw new ApiException(
        'PARSE_ERROR',
        `서버 응답을 처리할 수 없습니다 (${response.status})`,
        response.status
      );
    }
    return {} as T;
  }
  
  const data = await response.json();
  
  // HTTP 에러 상태
  if (!response.ok) {
    throw new ApiException(
      data.error?.code || 'API_ERROR',
      data.error?.message || `API 요청 실패 (${response.status})`,
      response.status,
      data.error?.details
    );
  }
  
  // 성공 응답에서 data 필드 추출 (있는 경우)
  return data.data !== undefined ? data.data : data;
}

/**
 * API 클라이언트 객체
 * 모든 HTTP 메서드 제공
 */
export const apiClient = {
  /**
   * Mock 모드 여부 확인
   */
  isMockMode(): boolean {
    return IS_MOCK_MODE;
  },
  
  /**
   * GET 요청
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    logApiCall('GET', url, 'start');
    
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        },
        options?.timeout ?? REQUEST_TIMEOUT
      );
      
      const data = await parseResponse<T>(response);
      logApiCall('GET', url, 'complete', { status: response.status });
      return data;
    } catch (error) {
      logApiCall('GET', url, 'error', error);
      throw error;
    }
  },
  
  /**
   * POST 요청
   */
  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    logApiCall('POST', url, 'start');
    
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        },
        options?.timeout ?? REQUEST_TIMEOUT
      );
      
      const data = await parseResponse<T>(response);
      logApiCall('POST', url, 'complete', { status: response.status });
      return data;
    } catch (error) {
      logApiCall('POST', url, 'error', error);
      throw error;
    }
  },
  
  /**
   * PUT 요청
   */
  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    logApiCall('PUT', url, 'start');
    
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        },
        options?.timeout ?? REQUEST_TIMEOUT
      );
      
      const data = await parseResponse<T>(response);
      logApiCall('PUT', url, 'complete', { status: response.status });
      return data;
    } catch (error) {
      logApiCall('PUT', url, 'error', error);
      throw error;
    }
  },
  
  /**
   * PATCH 요청
   */
  async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    logApiCall('PATCH', url, 'start');
    
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        },
        options?.timeout ?? REQUEST_TIMEOUT
      );
      
      const data = await parseResponse<T>(response);
      logApiCall('PATCH', url, 'complete', { status: response.status });
      return data;
    } catch (error) {
      logApiCall('PATCH', url, 'error', error);
      throw error;
    }
  },
  
  /**
   * DELETE 요청
   */
  async delete<T = void>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    logApiCall('DELETE', url, 'start');
    
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        },
        options?.timeout ?? REQUEST_TIMEOUT
      );
      
      const data = await parseResponse<T>(response);
      logApiCall('DELETE', url, 'complete', { status: response.status });
      return data;
    } catch (error) {
      logApiCall('DELETE', url, 'error', error);
      throw error;
    }
  },
};

export default apiClient;

