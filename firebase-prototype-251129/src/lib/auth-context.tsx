'use client';

/**
 * @file auth-context.tsx
 * @description Firebase Auth Context + useAuth hook
 * 
 * AuthProvider를 layout.tsx에서 래핑하면
 * 모든 하위 컴포넌트에서 useAuth()로 인증 상태 접근 가능
 */

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirebaseAuth, getGoogleProvider, getAuthFunctions, isFirebaseConfigured } from './firebase';

// ============================================================
// Types
// ============================================================

interface AuthContextType {
    /** 현재 로그인된 사용자 (null = 미로그인) */
    user: User | null;
    /** 인증 상태 로딩 중 여부 */
    loading: boolean;
    /** 이메일/비밀번호 로그인 */
    signIn: (email: string, password: string) => Promise<void>;
    /** 이메일/비밀번호 회원가입 */
    signUp: (email: string, password: string, displayName?: string) => Promise<void>;
    /** Google 로그인 */
    signInWithGoogle: () => Promise<void>;
    /** 로그아웃 */
    signOut: () => Promise<void>;
    /** 에러 메시지 */
    error: string | null;
    /** 에러 초기화 */
    clearError: () => void;
}

// ============================================================
// Context
// ============================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// Provider
// ============================================================

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [auth, setAuth] = useState<Auth | null>(null);
    const [googleProviderInstance, setGoogleProviderInstance] = useState<GoogleAuthProvider | null>(null);

    // Firebase 인증 초기화 및 상태 변경 리스너
    useEffect(() => {
        const initAuth = async () => {
            if (!isFirebaseConfigured) {
                setLoading(false);
                return;
            }

            try {
                const authInstance = await getFirebaseAuth();
                const providerInstance = await getGoogleProvider();
                const { onAuthStateChanged } = await getAuthFunctions();

                if (authInstance) {
                    setAuth(authInstance);
                    setGoogleProviderInstance(providerInstance);

                    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
                        setUser(user);
                        setLoading(false);
                    });
                    return unsubscribe;
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error('[AuthContext] 초기화 실패:', err);
                setLoading(false);
            }
        };

        const promise = initAuth();
        return () => {
            promise.then(unsubscribe => {
                if (unsubscribe) unsubscribe();
            });
        };
    }, []);

    const clearError = useCallback(() => setError(null), []);

    /**
     * Firebase 에러 코드를 사용자 친화적 메시지로 변환
     */
    const getErrorMessage = (errorCode: string): string => {
        switch (errorCode) {
            case 'auth/invalid-email':
                return '유효하지 않은 이메일 주소입니다.';
            case 'auth/user-disabled':
                return '비활성화된 계정입니다.';
            case 'auth/user-not-found':
                return '등록되지 않은 이메일입니다.';
            case 'auth/wrong-password':
                return '비밀번호가 올바르지 않습니다.';
            case 'auth/email-already-in-use':
                return '이미 사용 중인 이메일입니다.';
            case 'auth/weak-password':
                return '비밀번호는 6자 이상이어야 합니다.';
            case 'auth/too-many-requests':
                return '너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.';
            case 'auth/popup-closed-by-user':
                return '로그인 팝업이 닫혔습니다.';
            case 'auth/invalid-credential':
                return '이메일 또는 비밀번호가 올바르지 않습니다.';
            default:
                return '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
        }
    };

    // 이메일/비밀번호 로그인
    const signIn = useCallback(async (email: string, password: string) => {
        if (!auth) return;
        try {
            const { signInWithEmailAndPassword } = await getAuthFunctions();
            setError(null);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    }, [auth]);

    // 이메일/비밀번호 회원가입
    const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
        if (!auth) return;
        try {
            const { createUserWithEmailAndPassword, updateProfile } = await getAuthFunctions();
            setError(null);
            const result = await createUserWithEmailAndPassword(auth, email, password);
            if (displayName) {
                await updateProfile(result.user, { displayName });
            }
        } catch (err: any) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    }, [auth]);

    // Google 로그인
    const signInWithGoogle = useCallback(async () => {
        if (!auth || !googleProviderInstance) return;
        try {
            const { signInWithPopup } = await getAuthFunctions();
            setError(null);
            await signInWithPopup(auth, googleProviderInstance);
        } catch (err: any) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    }, [auth, googleProviderInstance]);

    // 로그아웃
    const handleSignOut = useCallback(async () => {
        if (!auth) return;
        try {
            const { signOut: firebaseSignOut } = await getAuthFunctions();
            setError(null);
            await firebaseSignOut(auth);
        } catch (err: any) {
            setError(getErrorMessage(err.code));
            throw err;
        }
    }, [auth]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signIn,
                signUp,
                signInWithGoogle,
                signOut: handleSignOut,
                error,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ============================================================
// Hook
// ============================================================

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
