'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Habit, HabitLog, Alarm } from '@/lib/types';
import { Header } from '@/components/header';
import { AlarmSetter } from '@/components/alarm-setter';
import { HabitLogList } from '@/components/habit-log-list';
import { NoteModal } from '@/components/note-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { HabitManager } from '@/components/habit-manager';
import { HistoryView } from '@/components/history-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { alarmApi, habitApi } from '@/lib/api';

export default function DashboardPage() {
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const timeoutIdsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    
    // localStorage에서 로그, 결제 상태 불러오기
    try {
      const storedLogs = localStorage.getItem('focus-habit-logs');
      if (storedLogs) setHabitLogs(JSON.parse(storedLogs));

      const storedPaidStatus = localStorage.getItem('focus-habit-paid');
      if (storedPaidStatus) setIsPaidUser(JSON.parse(storedPaidStatus));
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }

    // 백엔드 API에서 습관과 알람 가져오기
    const fetchData = async () => {
      try {
        // 습관 조회
        const apiHabits = await habitApi.getAll();
        if (apiHabits.length > 0) {
          setHabits(apiHabits.map(h => ({ 
            ...h, 
            weeklyGoalMinutes: h.weeklyGoalMinutes || 300 
          })));
          console.log('[Dashboard] 백엔드에서 습관 로드 완료:', apiHabits.length, '개');
        }
      } catch (error) {
        console.error("[Dashboard] 습관 API 호출 실패:", error);
      }

      try {
        // 알람 조회
        const apiAlarms = await alarmApi.getAll();
        // API에서 받아온 알람들을 타이머에 등록
        apiAlarms.forEach(alarm => addAlarm(alarm, false));
        console.log('[Dashboard] 백엔드에서 알람 로드 완료:', apiAlarms.length, '개');
      } catch (error) {
        console.error("[Dashboard] 알람 API 호출 실패:", error);
      }
    };
    fetchData();

    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (isClient) localStorage.setItem('focus-habit-logs', JSON.stringify(habitLogs));
  }, [habitLogs, isClient]);

  useEffect(() => {
    if (isClient) localStorage.setItem('focus-habit-habits', JSON.stringify(habits));
  }, [habits, isClient]);

  useEffect(() => {
    if (isClient) localStorage.setItem('focus-habit-alarms', JSON.stringify(alarms));
  }, [alarms, isClient]);

  useEffect(() => {
    if (isClient) localStorage.setItem('focus-habit-paid', JSON.stringify(isPaidUser));
  }, [isPaidUser, isClient]);

  const triggerAlarm = useCallback((alarm: Alarm) => {
    setActiveAlarm(alarm);
    setAlarms(prev => prev.filter(a => a.id !== alarm.id));
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus Habit Launcher', {
        body: `It's ${alarm.time}! Time to log your habit.`,
        icon: '/favicon.ico',
      });
    }
    toast({
      title: "It's time!",
      description: `Time to log your habit for ${alarm.time}.`,
    });
  }, [toast]);

  const addAlarm = useCallback((alarm: Alarm, showToast = true) => {
    setAlarms(prevAlarms => {
      if (prevAlarms.some(a => a.time === alarm.time && a.habitId === alarm.habitId)) {
        if (showToast) {
          toast({
            variant: "destructive",
            title: "Duplicate Alarm",
            description: "An alarm for this time and habit already exists.",
          });
        }
        return prevAlarms;
      }

      const [hours, minutes] = alarm.time.split(':').map(Number);
      const now = new Date();
      const alarmTime = new Date(now);
      alarmTime.setHours(hours, minutes, 0, 0);

      if (alarmTime <= now) alarmTime.setDate(alarmTime.getDate() + 1);

      const timeoutMs = alarmTime.getTime() - now.getTime();
      const timeoutId = setTimeout(() => triggerAlarm(alarm), timeoutMs);

      timeoutIdsRef.current.set(alarm.id, timeoutId);
      if (showToast) {
        toast({
          title: "Alarm Set!",
          description: `You will be notified at ${alarm.time}.`,
        });
      }
      return [...prevAlarms, alarm].sort((a, b) => a.time.localeCompare(b.time));
    });
  }, [toast, triggerAlarm]);

  const deleteAlarm = useCallback((alarmId: string) => {
    const timeoutId = timeoutIdsRef.current.get(alarmId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutIdsRef.current.delete(alarmId);
    }
    setAlarms(prev => prev.filter(a => a.id !== alarmId));
    toast({
      title: "Alarm Removed",
      description: "The selected alarm has been removed.",
    });
  }, [toast]);

  const handleLogHabit = async (
    note: string,
    startTime: number,
    habit: Habit,
    actualDurationMinutes: number,
    skipped: boolean
  ) => {
    const endTime = Date.now();
    const newLog: HabitLog = {
      id: crypto.randomUUID(),
      habitId: habit.id,
      note,
      startTime,
      endTime,
      duration: format(endTime - startTime, 'mm:ss'),
      keywords: [habit.name],
      actualDurationMinutes,
      alarmTime: activeAlarm?.time,
      date: format(new Date(), 'yyyy-MM-dd'),
      skipped
    };

    setHabitLogs(prev => [newLog, ...prev]);
    setActiveAlarm(null);
    toast({
      title: skipped ? "Skipped" : "Habit Logged!",
      description: skipped ? "It's okay, try again tomorrow!" : "Your progress has been saved.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Label htmlFor="paid-toggle">Paid User (Mock)</Label>
            <Switch id="paid-toggle" checked={isPaidUser} onCheckedChange={setIsPaidUser} />
          </div>
        </div>

        <Tabs defaultValue="alarm" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-[500px]">
            <TabsTrigger value="alarm">Alarms</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Alarms 탭: 알람 설정 및 로그 목록 */}
          <TabsContent value="alarm" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Set New Habit Alarm</CardTitle>
                    <CardDescription>Schedule a time to log your progress.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AlarmSetter alarms={alarms} habits={habits} onAddAlarm={addAlarm} onDeleteAlarm={deleteAlarm} />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <HabitLogList logs={habitLogs} habits={habits} />
              </div>
            </div>
          </TabsContent>

          {/* Habits 탭: 습관 관리 */}
          <TabsContent value="habits">
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle>Manage Habits</CardTitle>
                <CardDescription>Add, edit, or remove your habits.</CardDescription>
              </CardHeader>
              <CardContent>
                <HabitManager habits={habits} setHabits={setHabits} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* History 탭: 기록 조회 (프리미엄) */}
          <TabsContent value="history">
            {isPaidUser ? (
              <HistoryView logs={habitLogs} habits={habits} isPaidUser={isPaidUser} />
            ) : (
              <Card className="p-12 text-center">
                <CardTitle className="mb-4">Premium Feature</CardTitle>
                <CardDescription className="mb-6">
                  History tracking and Excel export are only available for premium members.
                </CardDescription>
                <Button onClick={() => setIsPaidUser(true)}>Upgrade Now</Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {activeAlarm && (
        <NoteModal
          alarm={activeAlarm}
          onLogHabit={handleLogHabit}
          onOpenChange={() => setActiveAlarm(null)}
          habits={habits}
          habitLogs={habitLogs}
        />
      )}
    </div>
  );
}
