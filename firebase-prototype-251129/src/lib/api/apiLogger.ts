/**
 * @file apiLogger.ts
 * @description 프론트엔드 API 호출 시 요청/응답/에러 로그 및 소요 시간을 관리하는 유틸리티.
 * 운영(Production) 환경에서는 로그 출력을 방지할 수 있습니다.
 */

// 개발/운영 환경 로깅 활성화 여부 (.env.local의 NEXT_PUBLIC_API_LOGGING_ENABLED 활용)
// 명시적으로 'true'이거나, 개발 환경일 때 활성화
const IS_LOGGING_ENABLED =
    process.env.NEXT_PUBLIC_API_LOGGING_ENABLED === 'true' ||
    process.env.NODE_ENV !== 'production';

// 요청별 시작 시간(milliseconds)을 추적하기 위한 Map
const requestTimers = new Map<string, number>();

/**
 * 로깅을 위한 고유 요청 ID (ULID)
 * ULID는 시간 정보를 포함하므로 정렬에 유리함
 */
export const apiLogger = {
    /**
     * API 요청 시작 로깅
     */
    logRequest(requestId: string, method: string, url: string, headers?: Record<string, string>, body?: unknown): void {
        if (!IS_LOGGING_ENABLED) return;

        requestTimers.set(requestId, performance.now());

        console.groupCollapsed(`🚀 [API Request] [${requestId}] ${method} ${url}`);

        if (headers && Object.keys(headers).length > 0) {
            console.log('Headers:', headers);
        }

        if (body !== undefined) {
            console.log('Body:', body);
        }

        console.groupEnd();
    },

    /**
     * API 정상 응답 완성 로깅
     */
    logResponse(requestId: string, method: string, url: string, status: number, responseData?: unknown): void {
        if (!IS_LOGGING_ENABLED) return;

        const startTime = requestTimers.get(requestId);
        const duration = startTime ? (performance.now() - startTime).toFixed(2) : 'unknown';

        // 로깅 후 메모리 누수를 막기 위해 타이머 제거
        requestTimers.delete(requestId);

        console.groupCollapsed(`✅ [API Response] [${requestId}] ${method} ${url} (${status}) - ⏱️ ${duration}ms`);

        if (responseData !== undefined) {
            console.log('Response Data:', responseData);
        }

        console.groupEnd();
    },

    /**
     * API 에러 응답 로깅
     */
    logError(requestId: string, method: string, url: string, error: unknown): void {
        if (!IS_LOGGING_ENABLED) return;

        const startTime = requestTimers.get(requestId);
        const duration = startTime ? (performance.now() - startTime).toFixed(2) : 'unknown';

        requestTimers.delete(requestId);

        console.groupCollapsed(`❌ [API Error] [${requestId}] ${method} ${url} - ⏱️ ${duration}ms`);
        console.error('Error Details:', error);
        console.groupEnd();
    }
};
