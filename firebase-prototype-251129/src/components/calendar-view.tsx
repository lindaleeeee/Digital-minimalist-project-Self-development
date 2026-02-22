'use client';

/**
 * @file calendar-view.tsx
 * @description 캘린더 뷰 — 날짜별 목표 표시 및 목표 설정 연동
 */

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCoin } from '@/lib/coin-context';
import { PRIORITY_COLORS, PRIORITY_LABELS, type Goal } from '@/lib/types';
import { ChevronLeft, ChevronRight, Plus, Trash2, Target, CheckCircle2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CalendarViewProps {
    onDateSelect?: (date: string) => void;
    onAddGoal?: () => void;
}

export function CalendarView({ onDateSelect, onAddGoal }: CalendarViewProps) {
    const { selectedDate, setSelectedDate, allGoals, selectedDateGoals, removeGoal, todayRecord, totalCoins } = useCoin();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const days = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
        const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
        return eachDayOfInterval({ start: calStart, end: calEnd });
    }, [currentMonth]);

    const goalsByDate = useMemo(() => {
        const map = new Map<string, Goal[]>();
        allGoals.forEach(goal => {
            const key = goal.date;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(goal);
        });
        return map;
    }, [allGoals]);

    const handleDateClick = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        setSelectedDate(dateStr);
        onDateSelect?.(dateStr);
    };

    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className="space-y-6">
            {/* 캘린더 카드 */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <CardTitle className="text-lg">
                            {format(currentMonth, 'yyyy년 M월', { locale: ko })}
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* 요일 헤더 */}
                    <div className="grid grid-cols-7 mb-2">
                        {weekDays.map(day => (
                            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* 날짜 그리드 */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, idx) => {
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const dayGoals = goalsByDate.get(dateStr) || [];
                            const isSelected = dateStr === selectedDate;
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isTodayDate = isToday(day);

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleDateClick(day)}
                                    className={`
                    relative p-2 min-h-[60px] rounded-lg text-sm transition-all
                    ${!isCurrentMonth ? 'text-muted-foreground/30' : ''}
                    ${isSelected ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-white/5'}
                    ${isTodayDate ? 'font-bold' : ''}
                  `}
                                >
                                    <span className={`
                    ${isTodayDate ? 'bg-primary text-white rounded-full w-6 h-6 inline-flex items-center justify-center text-xs' : ''}
                  `}>
                                        {format(day, 'd')}
                                    </span>

                                    {/* 목표 뱃지 */}
                                    {dayGoals.length > 0 && (
                                        <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                                            {dayGoals.slice(0, 3).map((goal, i) => (
                                                <div
                                                    key={i}
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: PRIORITY_COLORS[goal.priority] }}
                                                    title={`${PRIORITY_LABELS[goal.priority]}: ${goal.name}`}
                                                />
                                            ))}
                                            {dayGoals.length > 3 && (
                                                <span className="text-[10px] text-muted-foreground">+{dayGoals.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* 범례 */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/10 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS.urgent }} />
                            긴급
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS.medium }} />
                            중급
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PRIORITY_COLORS.habit }} />
                            습관만들기
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 선택한 날짜의 목표 목록 */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            {format(new Date(selectedDate + 'T00:00:00'), 'M월 d일 (EEEE)', { locale: ko })}
                        </CardTitle>
                        <Button size="sm" onClick={onAddGoal} className="gap-1">
                            <Plus className="w-4 h-4" />
                            목표 추가
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {selectedDateGoals.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6 text-sm">
                            이 날짜에 설정된 목표가 없습니다.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {selectedDateGoals.map(goal => (
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
                                            <div className="font-medium text-sm">{goal.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {PRIORITY_LABELS[goal.priority]} · {goal.timerMinutes}분
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {goal.verified ? (
                                            <Badge variant="secondary" className="gap-1 text-xs">
                                                <CheckCircle2 className="w-3 h-3" />
                                                {goal.achievementPercent}%
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-xs text-muted-foreground">
                                                미완료
                                            </Badge>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-muted-foreground hover:text-red-400"
                                            onClick={() => removeGoal(goal.id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
