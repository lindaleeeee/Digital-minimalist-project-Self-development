'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Check, Mic, BarChart, CircleDot } from 'lucide-react';
import type { Alarm, Habit, HabitLog } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '@/lib/utils';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface NoteModalProps {
  alarm: Alarm;
  onLogHabit: (note: string, startTime: number, habit: Habit) => Promise<void>;
  onOpenChange: (open: boolean) => void;
  habits: Habit[];
  habitLogs: HabitLog[];
}

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const pieChartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

export function NoteModal({ alarm, onLogHabit, onOpenChange, habits, habitLogs }: NoteModalProps) {
  const [note, setNote] = useState('');
  const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || !selectedHabitId) return;

    const selectedHabit = habits.find(h => h.id === selectedHabitId);
    if (!selectedHabit) return;

    startTransition(async () => {
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const startTime = new Date();
      startTime.setHours(hours, minutes, 0, 0);

      await onLogHabit(note, startTime.getTime(), selectedHabit);
      setIsOpen(false);
    });
  };

  const isHabitCompletedToday = (habitId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return habitLogs.some(log => log.habitId === habitId && format(new Date(log.endTime), 'yyyy-MM-dd') === today);
  }

  const selectedHabit = useMemo(() => {
    return habits.find(h => h.id === selectedHabitId);
  }, [selectedHabitId, habits]);
  
  const habitStats = useMemo(() => {
    if (!selectedHabitId) return null;

    const now = new Date();
    const todayLogs = habitLogs.filter(log => log.habitId === selectedHabitId && format(new Date(log.endTime), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')).length;
    
    const weeklyLogs = habitLogs.filter(log => {
        const logDate = new Date(log.endTime);
        return log.habitId === selectedHabitId && logDate >= startOfWeek(now) && logDate <= endOfWeek(now);
    }).length;

    const monthlyLogs = habitLogs.filter(log => {
        const logDate = new Date(log.endTime);
        return log.habitId === selectedHabitId && logDate >= startOfMonth(now) && logDate <= endOfMonth(now);
    }).length;

    const yearlyLogs = habitLogs.filter(log => {
        const logDate = new Date(log.endTime);
        return log.habitId === selectedHabitId && logDate >= startOfYear(now) && logDate <= endOfYear(now);
    }).length;

    const weeklyGoal = selectedHabit?.targetCount ?? 5;
    const monthlyGoal = (selectedHabit?.targetCount ?? 5) * 4;

    const chartData = [
      { period: 'Today', count: todayLogs },
      { period: 'This Week', count: weeklyLogs },
      { period: 'This Month', count: monthlyLogs },
      { period: 'This Year', count: yearlyLogs },
    ];
    
    const weeklyProgress = (weeklyLogs / weeklyGoal) * 100;
    const monthlyProgress = (monthlyLogs / monthlyGoal) * 100;
    
    const goalData = [
      { name: 'Done', value: weeklyLogs, fill: pieChartColors[0] },
      { name: 'Remaining', value: Math.max(0, weeklyGoal - weeklyLogs), fill: pieChartColors[1] },
    ]

    return { chartData, weeklyProgress, monthlyProgress, goalData, weeklyGoal, weeklyLogs };
  }, [selectedHabitId, habitLogs, habits, selectedHabit]);


  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setIsOpen(false);
        setTimeout(() => onOpenChange(false), 300);
      }
    }} >
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Log your habit</DialogTitle>
          <DialogDescription>
            It's {alarm.label ? `${alarm.time} (${alarm.label})` : alarm.time}. What did you accomplish? Be specific.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-6 overflow-y-auto pr-2">
            <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">What did you do?</label>
                  <Select value={selectedHabitId} onValueChange={setSelectedHabitId} disabled={isPending}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a habit" />
                    </SelectTrigger>
                    <SelectContent>
                      {habits.map(habit => {
                        const isCompleted = isHabitCompletedToday(habit.id);
                        return (
                          <SelectItem key={habit.id} value={habit.id} disabled={isCompleted}>
                            <div className={cn("flex items-center justify-between w-full", isCompleted && "text-muted-foreground")}>
                              <span>{habit.name}</span>
                              {isCompleted && <Check className="h-4 w-4" />}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className='relative'>
                    <Textarea
                        id="habit-note"
                        placeholder="e.g., Read a chapter of 'Sapiens' and took notes."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="col-span-3 min-h-[120px] pr-12"
                        required
                        disabled={isPending}
                    />
                    <Button variant="ghost" size="icon" className='absolute bottom-2 right-2 text-muted-foreground' aria-label="Record with voice">
                        <Mic className='h-5 w-5' />
                    </Button>
                </div>
            </div>
            <div className="space-y-4">
               {selectedHabit && habitStats ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-lg'>
                        <BarChart className='h-5 w-5' />
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <RechartsBarChart accessibilityLayer data={habitStats.chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                           <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={8} />
                           <YAxis />
                           <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                          <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                        </RechartsBarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                   <Card>
                    <CardHeader>
                      <CardTitle className='flex items-center gap-2 text-lg'>
                        <CircleDot className='h-5 w-5' />
                        Weekly Goal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center gap-4">
                             <ChartContainer config={chartConfig} className="h-24 w-24">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                    <Pie data={habitStats.goalData} dataKey="value" nameKey="name" innerRadius={22} strokeWidth={5}>
                                        {habitStats.goalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                            <div className="flex-1 space-y-2">
                                <p className='text-muted-foreground'>
                                    You've completed this habit <span className="font-bold text-foreground">{habitStats.weeklyLogs}</span> times this week.
                                </p>
                                <Progress value={habitStats.weeklyProgress} />
                                <p className='text-sm text-right font-mono'>
                                    {habitStats.weeklyLogs}/{habitStats.weeklyGoal} ({Math.round(habitStats.weeklyProgress)}%)
                                </p>
                            </div>
                        </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-10 rounded-md border-2 border-dashed h-full bg-muted/50">
                  <BarChart className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">Select a habit</h3>
                  <p className="text-sm text-muted-foreground">Statistics for the selected habit will appear here.</p>
                </div>
              )}
            </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => {
              startTransition(async () => {
                  setIsOpen(false);
              })
          }}>No, Skip</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isPending || !note.trim() || !selectedHabitId}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging...
              </>
            ) : (
              'Yes, Log Habit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
