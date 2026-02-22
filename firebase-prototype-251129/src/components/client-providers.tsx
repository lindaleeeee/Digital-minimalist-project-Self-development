'use client';

/**
 * @file client-providers.tsx
 * @description Client bridge component that uses next/dynamic with ssr:false
 * to completely prevent server-side execution of Auth/Coin providers.
 */

import dynamic from 'next/dynamic';
import { type ReactNode } from 'react';

// AuthProvider와 CoinProvider를 완전히 클라이언트에서만 실행
const AuthProviderNoSSR = dynamic(
    () => import('@/lib/auth-context').then(mod => mod.AuthProvider),
    { ssr: false }
);

const CoinProviderNoSSR = dynamic(
    () => import('@/lib/coin-context').then(mod => mod.CoinProvider),
    { ssr: false }
);

export function ClientProviders({ children }: { children: ReactNode }) {
    return (
        <AuthProviderNoSSR>
            <CoinProviderNoSSR>
                {children}
            </CoinProviderNoSSR>
        </AuthProviderNoSSR>
    );
}
