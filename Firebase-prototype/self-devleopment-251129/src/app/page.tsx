'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Habit, HabitLog, Alarm } from '@/lib/types';
import { logHabitAction } from '@/app/actions';
import { Header } from '@/components/header';
import { AlarmSetter } from '@/components/alarm-setter';
import { HabitLogList } from '@/components/habit-log-list';
import { NoteModal } from '@/components/note-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { HabitManager } from '@/components/habit-manager';


const defaultHabits: Habit[] = [
  { id: '1', name: '명상', icon: 'Brain' },
  { id: '2', name: '독서', icon: 'BookOpen' },
  { id: '3', name: '영어', icon: 'SpellCheck' },
  { id: '4', name: '운동', icon: 'Dumbbell' },
  { id: '5', name: '영양제', icon: 'Pill' },
];

export default function Home() {
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [isClient, setIsClient] = useState(false);
  const timeoutIdsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    // Load from localStorage on initial client-side render
    try {
      const storedLogs = localStorage.getItem('focus-habit-logs');
      if (storedLogs) {
        setHabitLogs(JSON.parse(storedLogs));
      }
      
      const storedHabits = localStorage.getItem('focus-habit-habits');
      if (storedHabits) {
        setHabits(JSON.parse(storedHabits));
      } else {
        setHabits(defaultHabits);
      }

      const storedAlarms = localStorage.getItem('focus-habit-alarms');
      if (storedAlarms) {
        const parsedAlarms: Alarm[] = JSON.parse(storedAlarms);
        parsedAlarms.forEach(alarm => addAlarm(alarm, false)); // Repopulate and set timeouts
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if(isClient) {
      try {
        localStorage.setItem('focus-habit-logs', JSON.stringify(habitLogs));
      } catch (error) {
        console.error("Failed to save habit logs to localStorage", error);
      }
    }
  }, [habitLogs, isClient]);

  useEffect(() => {
    if(isClient) {
      try {
        localStorage.setItem('focus-habit-habits', JSON.stringify(habits));
      } catch (error) {
        console.error("Failed to save habits to localStorage", error);
      }
    }
  }, [habits, isClient]);

  useEffect(() => {
    if(isClient) {
      try {
        localStorage.setItem('focus-habit-alarms', JSON.stringify(alarms));
      } catch (error) {
        console.error("Failed to save alarms to localStorage", error);
      }
    }
  }, [alarms, isClient]);

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
      if (prevAlarms.some(a => a.time === alarm.time && a.label === alarm.label)) {
        if (showToast) {
          toast({
            variant: "destructive",
            title: "Duplicate Alarm",
            description: "An alarm for this time and label already exists.",
          });
        }
        return prevAlarms;
      }

      const [hours, minutes] = alarm.time.split(':').map(Number);
      const now = new Date();
      const alarmTime = new Date(now);
      alarmTime.setHours(hours, minutes, 0, 0);

      if (alarmTime <= now) {
        alarmTime.setDate(alarmTime.getDate() + 1);
      }
      
      const timeoutMs = alarmTime.getTime() - now.getTime();
      
      const timeoutId = setTimeout(() => {
        triggerAlarm(alarm);
      }, timeoutMs);

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
  
  const handleLogHabit = async (note: string, startTime: number, habit: Habit) => {
    try {
      const newLog = await logHabitAction(note, startTime, habit);
      setHabitLogs(prev => [newLog, ...prev]);
      setActiveAlarm(null);
      toast({
        title: "Habit Logged!",
        description: "Your progress has been saved.",
      });
    } catch (error) {
      console.error("Failed to log habit:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not log your habit. Please try again.",
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background font-body text-foreground">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Set New Habit Alarm</CardTitle>
                <CardDescription>Schedule a time to log your progress.</CardDescription>
              </CardHeader>
              <CardContent>
                <AlarmSetter alarms={alarms} onAddAlarm={addAlarm} onDeleteAlarm={deleteAlarm} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Manage Habits</CardTitle>
                <CardDescription>Add, edit, or remove your habits.</CardDescription>
              </CardHeader>
              <CardContent>
                <HabitManager habits={habits} setHabits={setHabits} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
             <HabitLogList logs={habitLogs} habits={habits} />
          </div>
        </div>
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
