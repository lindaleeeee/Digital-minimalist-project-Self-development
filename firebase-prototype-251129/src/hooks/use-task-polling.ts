import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface TaskResponse<T = any> {
    taskId: string;
    status: TaskStatus;
    result?: T;
    error?: string;
    progress?: number;
}

interface UseTaskPollingOptions {
    intervalMs?: number;
    onSuccess?: (result: any) => void;
    onError?: (error: string) => void;
    maxRetries?: number;
}

export function useTaskPolling(options: UseTaskPollingOptions = {}) {
    const {
        intervalMs = 3000,
        onSuccess,
        onError,
        maxRetries = 100 // 무한 폴링 방지
    } = options;

    const [taskId, setTaskId] = useState<string | null>(null);
    const [status, setStatus] = useState<TaskStatus | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { toast } = useToast();
    const retryCount = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const startPolling = useCallback((newTaskId: string) => {
        setTaskId(newTaskId);
        setStatus('PENDING');
        setIsPolling(true);
        setResult(null);
        setError(null);
        retryCount.current = 0;

        toast({
            title: "작업을 시작했습니다",
            description: "에이전트가 처리 중입니다. 잠시만 기다려주세요.",
        });
    }, [toast]);

    const stopPolling = useCallback(() => {
        setIsPolling(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const clearTask = useCallback(() => {
        stopPolling();
        setTaskId(null);
        setStatus(null);
        setResult(null);
        setError(null);
    }, [stopPolling]);

    useEffect(() => {
        if (!isPolling || !taskId) return;

        const checkStatus = async () => {
            try {
                const response = await apiClient.get<TaskResponse>(`/api/v1/projects/tasks/${taskId}/status`);
                const newStatus = response.status;
                setStatus(newStatus);

                if (newStatus === 'COMPLETED') {
                    setResult(response.result);
                    setIsPolling(false);
                    toast({
                        title: "작업 완료",
                        description: "성공적으로 처리가 완료되었습니다.",
                    });
                    if (onSuccess) onSuccess(response.result);
                    return;
                }

                if (newStatus === 'FAILED') {
                    const errMsg = response.error || '알 수 없는 오류가 발생했습니다.';
                    setError(errMsg);
                    setIsPolling(false);
                    toast({
                        variant: "destructive",
                        title: "작업 실패",
                        description: errMsg,
                    });
                    if (onError) onError(errMsg);
                    return;
                }

                // PENDING or IN_PROGRESS -> 계속 폴링
                retryCount.current += 1;
                if (retryCount.current >= maxRetries) {
                    setError('작업 시간이 초과되었습니다.');
                    setIsPolling(false);
                    toast({
                        variant: "destructive",
                        title: "작업 시간 초과",
                        description: "요청하신 작업이 너무 오래 걸려 중단되었습니다.",
                    });
                    if (onError) onError('Timeout');
                    return;
                }

                // 다음 폴링 스케줄링
                timeoutRef.current = setTimeout(checkStatus, intervalMs);
            } catch (err: any) {
                // 네트워크 에러 등 발생 시 일시적 오류일 수 있으므로 카운트 증가 후 재시도
                console.error('Task polling error:', err);
                retryCount.current += 1;

                if (retryCount.current >= maxRetries) {
                    const errMsg = err.message || '상태 확인 중 오류가 발생했습니다.';
                    setError(errMsg);
                    setIsPolling(false);
                    toast({
                        variant: "destructive",
                        title: "네트워크 오류",
                        description: "작업 상태를 확인할 수 없습니다.",
                    });
                    if (onError) onError(errMsg);
                    return;
                }

                timeoutRef.current = setTimeout(checkStatus, intervalMs);
            }
        };

        // 첫 폴링 시작
        timeoutRef.current = setTimeout(checkStatus, intervalMs);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [taskId, isPolling, intervalMs, onSuccess, onError, toast, maxRetries]);

    return {
        taskId,
        status,
        isPolling,
        result,
        error,
        startPolling,
        stopPolling,
        clearTask
    };
}
