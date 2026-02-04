'use client';

import { useState, useMemo } from 'react';
import { Habit, HabitLog, HistoryRecord } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Cell, PieChart, Pie, Tooltip } from 'recharts';
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear, isWithinInterval } from 'date-fns';
import { Download, BarChart3, PieChart as PieChartIcon, Target } from 'lucide-react';
import { downloadHabitLogs } from '@/lib/export';
import { calculateHistoryRecords } from '@/lib/history-utils';
import { Progress } from './ui/progress';

interface HistoryViewProps {
    logs: HabitLog[];
    habits: Habit[];
    isPaidUser: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function HistoryView({ logs, habits, isPaidUser }: HistoryViewProps) {
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('year');
    const [selectedHabitId, setSelectedHabitId] = useState<string>('all');
    // 현재 연도를 기본값으로 설정
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    // 로그에서 사용 가능한 연도 목록 추출
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        logs.forEach(log => {
            const year = new Date(log.endTime).getFullYear();
            years.add(year);
        });
        // 현재 연도는 항상 포함
        years.add(currentYear);
        // 내림차순 정렬 (최신 연도가 먼저)
        return Array.from(years).sort((a, b) => b - a);
    }, [logs, currentYear]);

    const filteredLogs = useMemo(() => {
        // 선택한 연도의 시작과 끝
        const yearStart = new Date(selectedYear, 0, 1);
        const yearEnd = new Date(selectedYear, 11, 31, 23, 59, 59);
        const now = new Date();
        
        // 현재 연도면 오늘까지, 아니면 연말까지
        const periodEnd = selectedYear === currentYear ? now : yearEnd;
        
        let start: Date;
        switch (period) {
            case 'day': start = startOfDay(now); break;
            case 'week': start = startOfWeek(now); break;
            case 'month': start = startOfMonth(now); break;
            case 'year': start = yearStart; break;
        }

        return logs.filter(log => {
            const logDate = new Date(log.endTime);
            const logYear = logDate.getFullYear();
            
            // 연도 필터: 선택한 연도와 일치하는지
            if (logYear !== selectedYear) return false;
            
            // 기간 필터
            const isInPeriod = isWithinInterval(logDate, { start, end: periodEnd });
            const isCorrectHabit = selectedHabitId === 'all' || log.habitId === selectedHabitId;
            return isInPeriod && isCorrectHabit;
        });
    }, [logs, period, selectedHabitId, selectedYear, currentYear]);

    // 선택한 연도의 로그만 사용하여 차트 데이터 생성
    const yearFilteredLogs = useMemo(() => {
        return logs.filter(log => {
            const logYear = new Date(log.endTime).getFullYear();
            return logYear === selectedYear;
        });
    }, [logs, selectedYear]);

    /**
     * 분을 시간:분 형식으로 변환
     */
    const formatMinutesToDisplay = (minutes: number): string => {
        if (minutes < 60) return `${minutes}분`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
    };

    /**
     * 선택한 기간에 맞는 목표 계산 (시간 또는 일수)
     */
    const getGoalForPeriod = (habit: Habit): { value: number; type: 'time' | 'days' } => {
        const goalType = habit.goalType || 'time';
        const daysPerWeek = habit.daysPerWeek || 7;
        const dailyMinutes = habit.dailyGoalMinutes || 30;

        if (goalType === 'days') {
            // 일수 기반 목표
            switch (period) {
                case 'day': return { value: 1, type: 'days' };
                case 'week': return { value: daysPerWeek, type: 'days' };
                case 'month': return { value: daysPerWeek * 4, type: 'days' };
                case 'year': return { value: daysPerWeek * 52, type: 'days' };
            }
        } else {
            // 시간 기반 목표
            switch (period) {
                case 'day': return { value: dailyMinutes, type: 'time' };
                case 'week': return { value: dailyMinutes * daysPerWeek, type: 'time' };
                case 'month': return { value: dailyMinutes * daysPerWeek * 4, type: 'time' };
                case 'year': return { value: dailyMinutes * daysPerWeek * 52, type: 'time' };
            }
        }
    };

    /**
     * 실제 달성 값 계산 (시간 또는 일수)
     */
    const getActualForPeriod = (habitLogs: HabitLog[], goalType: 'time' | 'days'): number => {
        if (goalType === 'days') {
            // 일수 기반: 고유한 날짜 수 계산
            const uniqueDates = new Set(
                habitLogs.map(log => format(new Date(log.endTime), 'yyyy-MM-dd'))
            );
            return uniqueDates.size;
        } else {
            // 시간 기반: 총 분 합계
            return habitLogs.reduce((acc, l) => acc + (l.actualDurationMinutes || 0), 0);
        }
    };

    /**
     * 목표 값을 표시 형식으로 변환
     */
    const formatGoalValue = (value: number, type: 'time' | 'days'): string => {
        if (type === 'days') {
            return `${value}일`;
        } else {
            return formatMinutesToDisplay(value);
        }
    };

    /**
     * 기간별 목표 대비 달성률 데이터
     */
    const progressData = useMemo(() => {
        return habits.map(habit => {
            // 선택한 기간의 로그만 필터링
            const habitLogs = filteredLogs.filter(l => l.habitId === habit.id);
            const goal = getGoalForPeriod(habit);
            const actual = getActualForPeriod(habitLogs, goal.type);
            const percentage = goal.value > 0 ? Math.min(100, Math.round((actual / goal.value) * 100)) : 0;

            return {
                id: habit.id,
                name: habit.name,
                actual,
                goal: goal.value,
                goalType: goal.type,
                percentage,
            };
        });
    }, [filteredLogs, habits, period]);

    const barChartData = useMemo(() => {
        return habits.map(habit => {
            const habitLogs = yearFilteredLogs.filter(l => l.habitId === habit.id);
            const totalActual = habitLogs.reduce((acc, l) => acc + (l.actualDurationMinutes || 0), 0);
            // 연간 목표 = 일일 목표 * 365
            const totalGoal = (habit.dailyGoalMinutes || 30) * 365;
            const percentage = totalGoal > 0 ? Math.min(100, Math.round((totalActual / totalGoal) * 100)) : 0;

            return {
                name: habit.name,
                percentage,
                actual: totalActual,
                goal: totalGoal
            };
        }).sort((a, b) => b.percentage - a.percentage);
    }, [yearFilteredLogs, habits]);

    const pieChartData = useMemo(() => {
        const data = habits.map(habit => {
            const total = yearFilteredLogs
                .filter(l => l.habitId === habit.id)
                .reduce((acc, l) => acc + (l.actualDurationMinutes || 0), 0);
            return { name: habit.name, value: total };
        }).filter(d => d.value > 0);
        return data;
    }, [yearFilteredLogs, habits]);

    const handleExport = () => {
        if (!isPaidUser) {
            alert("This feature is only available for paid users.");
            return;
        }
        const historyRecords = calculateHistoryRecords(logs, habits);
        // Note: downloadHabitLogs needs to be updated to handle HistoryRecord
        // For now, we'll pass the logs and habits as before, but the export.ts will be updated.
        downloadHabitLogs(logs, habits, 'xlsx');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    {/* 연도 선택 */}
                    <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map(year => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}년
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* 기간 선택 */}
                    <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day">Daily</SelectItem>
                            <SelectItem value="week">Weekly</SelectItem>
                            <SelectItem value="month">Monthly</SelectItem>
                            <SelectItem value="year">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* 습관 선택 */}
                    <Select value={selectedHabitId} onValueChange={setSelectedHabitId}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="All Habits" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Habits</SelectItem>
                            {habits.map(h => (
                                <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    variant="outline"
                    onClick={handleExport}
                    className={!isPaidUser ? "opacity-50 cursor-not-allowed" : ""}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Export to Excel
                </Button>
            </div>

            {/* 기간별 목표 달성률 카드 */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {period === 'day' && '일일'}
                        {period === 'week' && '주간'}
                        {period === 'month' && '월간'}
                        {period === 'year' && '연간'} 목표 달성률
                    </CardTitle>
                    <CardDescription>
                        {selectedYear}년 {period === 'day' && '오늘'}
                        {period === 'week' && '이번 주'}
                        {period === 'month' && '이번 달'}
                        {period === 'year' && '연간'} 목표 대비 달성 현황
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {progressData.map((item, index) => (
                            <div key={item.id} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                            {item.goalType === 'days' ? '일수' : '시간'}
                                        </span>
                                    </div>
                                    <span className="text-muted-foreground font-mono">
                                        {formatGoalValue(item.actual, item.goalType)} / {formatGoalValue(item.goal, item.goalType)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Progress 
                                        value={item.percentage} 
                                        className="flex-1 h-3"
                                        style={{ 
                                            ['--progress-background' as string]: COLORS[index % COLORS.length] 
                                        }}
                                    />
                                    <span 
                                        className="text-sm font-mono font-bold min-w-[50px] text-right"
                                        style={{ color: COLORS[index % COLORS.length] }}
                                    >
                                        {item.percentage}%
                                    </span>
                                </div>
                            </div>
                        ))}
                        {progressData.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">
                                등록된 습관이 없습니다. Habits 탭에서 습관을 추가해주세요.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            {selectedYear}년 연간 달성률 (%)
                        </CardTitle>
                        <CardDescription>연간 목표 대비 전체 달성률</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip 
                                    formatter={(value: number, name: string, props: any) => [
                                        `${value}% (${formatMinutesToDisplay(props.payload.actual)} / ${formatMinutesToDisplay(props.payload.goal)})`,
                                        '달성률'
                                    ]}
                                />
                                <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                                    {barChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5" />
                            Habit Distribution
                        </CardTitle>
                        <CardDescription>Time spent on each habit</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
