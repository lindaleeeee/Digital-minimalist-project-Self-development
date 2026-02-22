'use client';

/**
 * @file login/page.tsx
 * @description 로그인/회원가입 페이지
 * 이메일/비밀번호 + Google 로그인 지원
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const { user, loading, signIn, signUp, signInWithGoogle, error, clearError } = useAuth();
    const router = useRouter();

    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 이미 로그인된 경우 대시보드로 이동
    useEffect(() => {
        if (user && !loading) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (isSignUp) {
                await signUp(email, password, displayName || undefined);
            } else {
                await signIn(email, password);
            }
            router.push('/dashboard');
        } catch {
            // Error is handled in auth context
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        try {
            await signInWithGoogle();
            router.push('/dashboard');
        } catch {
            // Error is handled in auth context
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        clearError();
        setEmail('');
        setPassword('');
        setDisplayName('');
    };

    // 로딩 중
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // 이미 로그인됨
    if (user) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
            {/* Background glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/15 blur-[120px] rounded-full -z-10 pointer-events-none" />

            {/* Back to landing */}
            <div className="container mx-auto px-4 pt-6">
                <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    홈으로 돌아가기
                </Link>
            </div>

            <div className="flex-grow flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-md shadow-2xl">
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center gap-2">
                                <Logo />
                                <span className="text-xl font-bold text-primary">Focus Habit</span>
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-white">
                            {isSignUp ? '회원가입' : '로그인'}
                        </CardTitle>
                        <CardDescription className="text-white/50">
                            {isSignUp
                                ? '계정을 만들고 습관 관리를 시작하세요'
                                : '계정에 로그인하여 습관 달성률을 확인하세요'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Error message */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        {/* Google Login */}
                        <Button
                            variant="outline"
                            className="w-full h-12 bg-white/5 border-white/20 hover:bg-white/10 text-white font-medium"
                            onClick={handleGoogleLogin}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            ) : (
                                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            Google로 {isSignUp ? '가입하기' : '로그인'}
                        </Button>

                        {/* Divider */}
                        <div className="relative">
                            <Separator className="bg-white/10" />
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] px-3 text-xs text-white/30">
                                또는
                            </span>
                        </div>

                        {/* Email/Password Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Display Name (signup only) */}
                            {isSignUp && (
                                <div className="space-y-2">
                                    <Label htmlFor="displayName" className="text-white/70 text-sm">이름</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <Input
                                            id="displayName"
                                            type="text"
                                            placeholder="이름을 입력하세요"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-white/70 text-sm">이메일</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-white/70 text-sm">비밀번호</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={isSignUp ? '6자 이상 입력하세요' : '비밀번호를 입력하세요'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={isSignUp ? 6 : undefined}
                                        className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-lg shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all hover:shadow-[0_0_25px_rgba(var(--primary),0.5)]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                ) : null}
                                {isSignUp ? '회원가입' : '로그인'}
                            </Button>
                        </form>

                        {/* Toggle login/signup */}
                        <div className="text-center text-sm text-white/50">
                            {isSignUp ? (
                                <>
                                    이미 계정이 있으신가요?{' '}
                                    <button
                                        onClick={toggleMode}
                                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                                    >
                                        로그인
                                    </button>
                                </>
                            ) : (
                                <>
                                    계정이 없으신가요?{' '}
                                    <button
                                        onClick={toggleMode}
                                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                                    >
                                        회원가입
                                    </button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Footer */}
            <div className="text-center pb-8 text-white/20 text-xs">
                © 2026 Focus Habit. All rights reserved.
            </div>
        </div>
    );
}
