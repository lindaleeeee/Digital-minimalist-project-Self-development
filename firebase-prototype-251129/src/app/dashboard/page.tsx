'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { AuthGuard } from '@/components/auth-guard';
import { CalendarView } from '@/components/calendar-view';
import { GoalSetter } from '@/components/goal-setter';
import { CoinShop } from '@/components/coin-shop';
import { HistoryView } from '@/components/history-view';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useCoin } from '@/lib/coin-context';
import { useAuth } from '@/lib/auth-context';
import { PRIORITY_COLORS, PRIORITY_LABELS, ATTENDANCE_COINS, ACHIEVEMENT_MAX_COINS } from '@/lib/types';
import { Coins, Target, TrendingUp, CalendarDays, BarChart3, ShoppingBag, History, Loader2, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { totalCoins, todayGoals, todayRecord, loading } = useCoin();
  const [activeTab, setActiveTab] = useState('dashboard');

  // 오늘 달성률(%) 계산
  const todayAchievement = useMemo(() => {
    if (todayGoals.length === 0) return 0;
    const verifiedGoals = todayGoals.filter(g => g.verified);
    if (verifiedGoals.length === 0) return 0;
    const avg = verifiedGoals.reduce((sum, g) => sum + (g.achievementPercent || 0), 0) / todayGoals.length;
    return Math.round(avg);
  }, [todayGoals]);

  // 오늘 코인 내역 계산
  const todayCoins = todayRecord?.totalCoins || 0;
  const verifiedCount = todayGoals.filter(g => g.verified).length;
  const totalGoalCount = todayGoals.length;

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-6 space-y-6">

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 max-w-[700px]">
              <TabsTrigger value="dashboard" className="gap-1 text-xs sm:text-sm">
                <BarChart3 className="w-3.5 h-3.5 hidden sm:block" />
                대시보드
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-1 text-xs sm:text-sm">
                <CalendarDays className="w-3.5 h-3.5 hidden sm:block" />
                캘린더
              </TabsTrigger>
              <TabsTrigger value="goals" className="gap-1 text-xs sm:text-sm">
                <Target className="w-3.5 h-3.5 hidden sm:block" />
                목표설정
              </TabsTrigger>
              <TabsTrigger value="shop" className="gap-1 text-xs sm:text-sm">
                <ShoppingBag className="w-3.5 h-3.5 hidden sm:block" />
                상점
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-1 text-xs sm:text-sm">
                <History className="w-3.5 h-3.5 hidden sm:block" />
                히스토리
              </TabsTrigger>
            </TabsList>

            {/* ======================================== */}
            {/* 대시보드 탭 */}
            {/* ======================================== */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* 인사말 */}
              <div>
                <h1 className="text-2xl font-bold">
                  안녕하세요, {user?.displayName || '사용자'}님! 👋
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  오늘도 목표를 달성해보세요.
                </p>
              </div>

              {/* 코인 잔액 + 오늘 달성률 카드 */}
              <div className="grid gap-4 md:grid-cols-3">
                {/* 코인 잔액 */}
                <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-yellow-500/20">
                        <Coins className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">총 코인 잔액</p>
                        <p className="text-3xl font-bold text-yellow-500">{totalCoins.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 오늘 코인 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-green-500/20">
                        <TrendingUp className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">오늘 획득 코인</p>
                        <p className="text-3xl font-bold text-green-500">+{todayCoins}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      출석 {todayRecord?.attendanceCoins || 0} | 달성 +{todayRecord?.bonusCoins || 0} | 차감 -{todayRecord?.urgentDeduction || 0}
                    </div>
                  </CardContent>
                </Card>

                {/* 오늘 달성률 */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/20">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">오늘 달성률</p>
                        <p className="text-3xl font-bold text-primary">{todayAchievement}%</p>
                      </div>
                    </div>
                    <Progress value={todayAchievement} className="mt-3 h-2" />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {verifiedCount}/{totalGoalCount} 목표 완료
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* 오늘의 목표 리스트 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    오늘의 목표
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayGoals.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground text-sm mb-3">오늘 설정된 목표가 없습니다.</p>
                      <button
                        onClick={() => setActiveTab('goals')}
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        목표 설정하러 가기 →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {todayGoals.map(goal => (
                        <div
                          key={goal.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: PRIORITY_COLORS[goal.priority] }}
                            />
                            <div>
                              <div className="text-sm font-medium">{goal.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {PRIORITY_LABELS[goal.priority]} · {goal.timerMinutes}분
                              </div>
                            </div>
                          </div>
                          {goal.verified ? (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <CheckCircle2 className="w-3 h-3" />
                              {goal.achievementPercent}%
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              진행 중
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ======================================== */}
            {/* 캘린더 탭 */}
            {/* ======================================== */}
            <TabsContent value="calendar">
              <CalendarView
                onAddGoal={() => setActiveTab('goals')}
              />
            </TabsContent>

            {/* ======================================== */}
            {/* 목표설정 탭 */}
            {/* ======================================== */}
            <TabsContent value="goals">
              <GoalSetter />
            </TabsContent>

            {/* ======================================== */}
            {/* 상점 탭 */}
            {/* ======================================== */}
            <TabsContent value="shop">
              <CoinShop />
            </TabsContent>

            {/* ======================================== */}
            {/* 히스토리 탭 */}
            {/* ======================================== */}
            <TabsContent value="history">
              <HistoryView logs={[]} habits={[]} isPaidUser={true} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  );
}
