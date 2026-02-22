'use client';

/**
 * @file auth-guard.tsx
 * @description 인증되지 않은 사용자를 /login으로 리다이렉트하는 래퍼 컴포넌트
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // 로딩 중 스피너
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground text-sm">로딩 중...</p>
                </div>
            </div>
        );
    }

    // 미인증 → 빈 화면 (리다이렉트 중)
    if (!user) {
        return null;
    }

    return <>{children}</>;
}
