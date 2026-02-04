'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  ShieldCheck,
  BarChart3,
  Bell,
  Smartphone,
  Clock,
  Trophy,
  Star
} from 'lucide-react';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold tracking-tight text-primary">Focus Habit</span>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
              로그인
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-primary-foreground mb-6 animate-fade-in">
              <Zap className="w-4 h-4 text-accent" />
              <span>의지력이 필요 없는 습관 형성 시스템</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 leading-tight">
              알람만 끄면,<br />습관이 완성됩니다
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              복잡한 기록 앱은 이제 그만. <br className="hidden md:block" />
              기상 알람과 동시에 실행되는 강제 런처로 당신의 아침을 생산성 모드로 전환하세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-full shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all hover:scale-105">
                  지금 무료로 시작하기 <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <p className="text-sm text-white/40">카드 등록 없이 즉시 시작</p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-1">10,000+</div>
                <div className="text-sm text-white/40">누적 사용자</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">150만+</div>
                <div className="text-sm text-white/40">달성된 습관</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">4.8/5.0</div>
                <div className="text-sm text-white/40">사용자 만족도</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-sm text-white/40">시간 절약 효과</div>
              </div>
            </div>
          </div>
        </section>

        {/* C-Type: Input-Output Diagram */}
        <section className="py-24 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">가장 단순한 프로세스</h2>
              <p className="text-white/50">복잡한 과정은 엔진이 처리합니다. 당신은 터치만 하세요.</p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 relative z-10">
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/30">
                      <Bell className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">1. 알람 울림</h3>
                    <p className="text-sm text-white/50">지정한 시간에 <br />강제 런처 실행</p>
                  </CardContent>
                </Card>

                <Card className="bg-primary border-primary shadow-[0_0_30px_rgba(var(--primary),0.4)]">
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30">
                      <Zap className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">2. YES / NO 선택</h3>
                    <p className="text-sm text-white/80">의지력 소모 없이 <br />단 한 번의 터치</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-accent/30">
                      <CheckCircle2 className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">3. 기록 완료</h3>
                    <p className="text-sm text-white/50">자동 데이터 저장 및 <br />성취 리포트 생성</p>
                  </CardContent>
                </Card>
              </div>

              {/* Connecting lines for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 -z-0" />
            </div>
          </div>
        </section>

        {/* C-Type: Before & After */}
        <section className="py-24 bg-white/[0.02]">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">당신의 아침이 <br /><span className="text-primary">완전히 달라집니다</span></h2>
                  <p className="text-white/60 mb-8 leading-relaxed">
                    기존의 습관 앱들은 당신에게 너무 많은 것을 요구했습니다.
                    Focus Habit은 당신의 시간을 아끼고 결과를 만들어내는 데 집중합니다.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      <span>기존 30분 기록 과정을 3초로 단축</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      <span>의지력 고갈 방지 시스템 탑재</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      <span>스마트폰 중독 원천 차단</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <div className="text-red-500 text-sm font-bold mb-2 uppercase tracking-wider">Before</div>
                    <ul className="space-y-2 text-white/60 text-sm">
                      <li>❌ 습관 앱 7개 설치 후 방치</li>
                      <li>❌ 매일 기록하는 것을 까먹음</li>
                      <li>❌ 1주일 후 의지력 고갈로 포기</li>
                      <li>❌ 아침마다 SNS로 30분 낭비</li>
                    </ul>
                  </div>
                  <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                      <Trophy className="w-12 h-12 text-accent/20" />
                    </div>
                    <div className="text-accent text-sm font-bold mb-2 uppercase tracking-wider">After</div>
                    <ul className="space-y-2 text-white/90 text-sm font-medium">
                      <li>✅ Focus Habit 하나로 통합 관리</li>
                      <li>✅ 알람이 울리면 자동으로 기록 시작</li>
                      <li>✅ 90일 이상 연속 달성률 85%</li>
                      <li>✅ 3초 터치 후 즉시 목표 행동 실행</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* C-Type: Result Gallery */}
        <section className="py-24 bg-black overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">실제 사용자들의 성과</h2>
              <p className="text-white/50">당신도 이런 결과를 얻을 수 있습니다.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: '명상', value: '120일', icon: '🧘', color: 'bg-purple-500/20' },
                { label: '독서', value: '52권', icon: '📚', color: 'bg-pink-500/20' },
                { label: '운동', value: '180일', icon: '💪', color: 'bg-blue-500/20' },
                { label: '기상', value: '365일', icon: '🌅', color: 'bg-orange-500/20' },
              ].map((item, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:-translate-y-2">
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-3xl mb-6`}>
                    {item.icon}
                  </div>
                  <div className="text-white/50 text-sm mb-1">{item.label}</div>
                  <div className="text-3xl font-bold text-white group-hover:text-primary transition-colors">{item.value}</div>
                  <div className="mt-4 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-accent text-accent" />)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link href="/dashboard">
                <Button variant="outline" className="rounded-full border-white/20 hover:bg-white/10 text-white">
                  더 많은 사례 보기
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-white/[0.01]">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <Smartphone className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-3">강제 개입 런처</h3>
                <p className="text-white/50 leading-relaxed">알람 해제 시 시스템 UI를 덮어 다른 앱 진입을 차단하고 습관 기록을 유도합니다.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <BarChart3 className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-3">시각적 동기부여</h3>
                <p className="text-white/50 leading-relaxed">실시간 그래프와 달성률 애니메이션으로 당신의 성장을 매일 눈으로 확인하세요.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                <ShieldCheck className="w-10 h-10 text-primary mb-6" />
                <h3 className="text-xl font-bold mb-3">Local-First 보안</h3>
                <p className="text-white/50 leading-relaxed">모든 데이터는 당신의 기기에만 저장됩니다. 개인정보 유출 걱정 없이 안심하고 사용하세요.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 -z-10" />
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">오늘부터 당신의 아침이 <br />바뀌기 시작합니다</h2>
            <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
              첫 습관 기록까지 단 3초. <br />
              지금 바로 무료로 시작하고 변화를 경험하세요.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="h-16 px-12 text-xl font-bold bg-primary hover:bg-primary/90 text-white rounded-full shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all hover:scale-110">
                지금 무료로 시작하기
              </Button>
            </Link>
            <div className="mt-8 flex items-center justify-center gap-8 text-white/40 text-sm">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 평생 무료 플랜</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 광고 없음</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 데이터 무제한</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="font-bold text-white/50">Focus Habit Launcher</span>
            </div>
            <div className="text-white/30 text-sm">
              © 2026 Focus Habit. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-white/40">
              <a href="#" className="hover:text-white">이용약관</a>
              <a href="#" className="hover:text-white">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
