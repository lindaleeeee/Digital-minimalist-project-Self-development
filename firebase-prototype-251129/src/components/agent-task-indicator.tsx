import { Loader2, CheckCircle2, XCircle, Bot } from 'lucide-react';
import { TaskStatus } from '@/hooks/use-task-polling';
import { cn } from '@/lib/utils';

interface AgentTaskIndicatorProps {
    isPolling: boolean;
    status: TaskStatus | null;
    className?: string;
}

export function AgentTaskIndicator({ isPolling, status, className }: AgentTaskIndicatorProps) {
    if (!isPolling && !status) return null;

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] backdrop-blur-md border border-white/20 transition-all duration-300 animate-in slide-in-from-bottom-5",
                status === 'COMPLETED' && "border-green-500/50 bg-green-500/10",
                status === 'FAILED' && "border-red-500/50 bg-red-500/10",
                className
            )}
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 relative overflow-hidden">
                {/* Animated Glow */}
                {isPolling && (
                    <div className="absolute inset-0 bg-primary/30 animate-pulse rounded-full blur-md" />
                )}

                {status === 'FAILED' ? (
                    <XCircle className="h-4 w-4 text-red-400 relative z-10" />
                ) : status === 'COMPLETED' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400 relative z-10" />
                ) : (
                    <Bot className="h-4 w-4 text-primary relative z-10 animate-bounce" />
                )}
            </div>

            <div className="flex flex-col">
                {status === 'FAILED' ? (
                    <span className="text-red-400">작업 실패</span>
                ) : status === 'COMPLETED' ? (
                    <span className="text-green-400">작업 완료!</span>
                ) : (
                    <>
                        <span className="text-white/90">AI가 생각하는 중...</span>
                        <span className="text-xs text-white/50">데이터를 분석하고 있습니다</span>
                    </>
                )}
            </div>

            {isPolling && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin text-white/50" />
            )}
        </div>
    );
}
