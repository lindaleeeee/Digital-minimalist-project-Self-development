'use client';

import type { Habit, GoalType } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2, ChevronDown, ChevronUp, Clock, Target, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface HabitManagerProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

/**
 * 시간 기반 목표 계산 (매일 N분)
 */
const calculateTimeGoals = (dailyMinutes: number, daysPerWeek: number) => ({
  daily: dailyMinutes,
  weekly: dailyMinutes * daysPerWeek,
  monthly: dailyMinutes * daysPerWeek * 4,
  yearly: dailyMinutes * daysPerWeek * 52,
});

/**
 * 일수 기반 목표 계산 (주 N일)
 */
const calculateDaysGoals = (daysPerWeek: number) => ({
  weekly: daysPerWeek,
  monthly: daysPerWeek * 4,
  yearly: daysPerWeek * 52,
});

/**
 * 분 단위를 시간:분 형식으로 변환
 */
const formatMinutesToHours = (minutes: number): string => {
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}시간 ${mins}분` : `${hours}시간`;
};

/**
 * 목표 요약 텍스트 생성
 */
const getGoalSummary = (habit: Habit): string => {
  const goalType = habit.goalType || 'time';
  const daysPerWeek = habit.daysPerWeek || 7;
  
  if (goalType === 'days') {
    return daysPerWeek === 7 ? '매일' : `주 ${daysPerWeek}일`;
  } else {
    const daily = habit.dailyGoalMinutes || 30;
    if (daysPerWeek === 7) {
      return `${formatMinutesToHours(daily)}/일`;
    } else {
      return `주 ${daysPerWeek}일, ${formatMinutesToHours(daily)}/회`;
    }
  }
};

/**
 * @component HabitManager
 * @description A form component that allows users to create, edit goals, and delete custom habits.
 * 목표 유형(시간/일수)과 주별 빈도를 설정할 수 있습니다.
 */
export function HabitManager({ habits, setHabits }: HabitManagerProps) {
  const [newHabitName, setNewHabitName] = useState('');
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);
  const { toast } = useToast();

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Invalid Name',
        description: 'Habit name cannot be empty.',
      });
      return;
    }
    if (habits.some(h => h.name.toLowerCase() === newHabitName.toLowerCase())) {
      toast({
        variant: 'destructive',
        title: 'Duplicate Habit',
        description: 'A habit with this name already exists.',
      });
      return;
    }

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: newHabitName,
      icon: 'FileText',
      goalType: 'time',
      daysPerWeek: 7,
      dailyGoalMinutes: 30,
      weeklyGoalMinutes: 30 * 7,
      monthlyGoalMinutes: 30 * 7 * 4,
      yearlyGoalMinutes: 30 * 7 * 52,
    };
    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
    toast({
      title: 'Habit Added!',
      description: `"${newHabitName}" has been added.`,
    });
  };

  const updateHabit = (habitId: string, updates: Partial<Habit>) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== habitId) return h;
        
        const updated = { ...h, ...updates };
        const goalType = updated.goalType || 'time';
        const daysPerWeek = updated.daysPerWeek || 7;
        const dailyMinutes = updated.dailyGoalMinutes || 30;
        
        // 목표 값 자동 계산
        if (goalType === 'time') {
          const goals = calculateTimeGoals(dailyMinutes, daysPerWeek);
          updated.weeklyGoalMinutes = goals.weekly;
          updated.monthlyGoalMinutes = goals.monthly;
          updated.yearlyGoalMinutes = goals.yearly;
        }
        
        return updated;
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    toast({
      title: 'Habit Removed',
      description: 'The selected habit has been removed.',
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={addHabit} className="flex gap-2">
        <Input
          placeholder="New habit name..."
          value={newHabitName}
          onChange={e => setNewHabitName(e.target.value)}
        />
        <Button type="submit" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-2">
        {habits.map(habit => {
          const isExpanded = expandedHabitId === habit.id;
          const goalType = habit.goalType || 'time';
          const daysPerWeek = habit.daysPerWeek || 7;
          const isDaily = daysPerWeek === 7;

          return (
            <Collapsible
              key={habit.id}
              open={isExpanded}
              onOpenChange={(open) => setExpandedHabitId(open ? habit.id : null)}
            >
              <div className="rounded-md border bg-background overflow-hidden">
                {/* 습관 헤더 */}
                <div className="flex items-center justify-between p-3">
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center gap-2 flex-1 text-left hover:text-primary transition-colors">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">{habit.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({getGoalSummary(habit)})
                      </span>
                    </button>
                  </CollapsibleTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => deleteHabit(habit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* 목표 설정 패널 */}
                <CollapsibleContent>
                  <div className="px-3 pb-3 pt-1 border-t bg-muted/30 space-y-4">
                    {/* 주별 빈도 선택 */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <label className="text-sm font-medium min-w-[80px]">주별 빈도</label>
                      <Select 
                        value={daysPerWeek.toString()} 
                        onValueChange={(v) => {
                          const days = parseInt(v);
                          // 매일(7일)이면 시간 기반, 아니면 선택 가능
                          const newGoalType = days === 7 ? 'time' : goalType;
                          updateHabit(habit.id, { daysPerWeek: days, goalType: newGoalType });
                        }}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">매일 (7일)</SelectItem>
                          <SelectItem value="6">주 6일</SelectItem>
                          <SelectItem value="5">주 5일</SelectItem>
                          <SelectItem value="4">주 4일</SelectItem>
                          <SelectItem value="3">주 3일</SelectItem>
                          <SelectItem value="2">주 2일</SelectItem>
                          <SelectItem value="1">주 1일</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 목표 유형 선택 (매일이 아닐 때만) */}
                    {!isDaily && (
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <label className="text-sm font-medium min-w-[80px]">목표 유형</label>
                        <Select 
                          value={goalType} 
                          onValueChange={(v: GoalType) => updateHabit(habit.id, { goalType: v })}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="time">시간 기반</SelectItem>
                            <SelectItem value="days">일수 기반</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* 시간 기반 목표 (매일 또는 시간 기반 선택 시) */}
                    {(isDaily || goalType === 'time') && (
                      <>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <label className="text-sm font-medium min-w-[80px]">
                            {isDaily ? '일일 목표' : '회당 목표'}
                          </label>
                          <Input
                            type="number"
                            min={1}
                            max={1440}
                            value={habit.dailyGoalMinutes || 30}
                            onChange={(e) => updateHabit(habit.id, { 
                              dailyGoalMinutes: Math.max(1, parseInt(e.target.value) || 1) 
                            })}
                            className="w-20 text-center"
                          />
                          <span className="text-sm text-muted-foreground">분</span>
                        </div>

                        {/* 시간 기반 자동 계산 목표 */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="rounded-md bg-background p-2 border">
                            <div className="text-xs text-muted-foreground mb-1">주간</div>
                            <div className="text-sm font-mono font-medium text-primary">
                              {formatMinutesToHours((habit.dailyGoalMinutes || 30) * daysPerWeek)}
                            </div>
                          </div>
                          <div className="rounded-md bg-background p-2 border">
                            <div className="text-xs text-muted-foreground mb-1">월간</div>
                            <div className="text-sm font-mono font-medium text-primary">
                              {formatMinutesToHours((habit.dailyGoalMinutes || 30) * daysPerWeek * 4)}
                            </div>
                          </div>
                          <div className="rounded-md bg-background p-2 border">
                            <div className="text-xs text-muted-foreground mb-1">연간</div>
                            <div className="text-sm font-mono font-medium text-primary">
                              {formatMinutesToHours((habit.dailyGoalMinutes || 30) * daysPerWeek * 52)}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* 일수 기반 목표 (주 N일, 일수 기반 선택 시) */}
                    {!isDaily && goalType === 'days' && (
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-md bg-background p-2 border">
                          <div className="text-xs text-muted-foreground mb-1">주간</div>
                          <div className="text-sm font-mono font-medium text-primary">
                            {daysPerWeek}일
                          </div>
                        </div>
                        <div className="rounded-md bg-background p-2 border">
                          <div className="text-xs text-muted-foreground mb-1">월간</div>
                          <div className="text-sm font-mono font-medium text-primary">
                            {daysPerWeek * 4}일
                          </div>
                        </div>
                        <div className="rounded-md bg-background p-2 border">
                          <div className="text-xs text-muted-foreground mb-1">연간</div>
                          <div className="text-sm font-mono font-medium text-primary">
                            {daysPerWeek * 52}일
                          </div>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                      <Target className="inline h-3 w-3 mr-1" />
                      {goalType === 'days' 
                        ? '일수 기반: 주/월/연 목표 일수가 자동으로 계산됩니다'
                        : '시간 기반: 주/월/연 목표 시간이 자동으로 계산됩니다'}
                    </p>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
