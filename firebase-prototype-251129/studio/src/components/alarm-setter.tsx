'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlarmClock, Plus, X, Clock, Timer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';
import type { Alarm, Habit } from '@/lib/types';

// 알람 모드 타입: 정확한 시간 또는 타이머
type AlarmMode = 'exact' | 'timer';

interface AlarmSetterProps {
  alarms: Alarm[];
  habits: Habit[];
  onAddAlarm: (alarm: Alarm) => void;
  onDeleteAlarm: (id: string) => void;
}

/**
 * @component AlarmSetter
 * @description Manages the creation and deletion of daily reminder alarms.
 * Supports two modes: exact time setting or timer (hours/minutes from now).
 * Handles user input for time and habit selection, and displays a list of upcoming alarms.
 */
export function AlarmSetter({ alarms, habits, onAddAlarm, onDeleteAlarm }: AlarmSetterProps) {
  // 알람 모드 상태 (정확한 시간 / 타이머)
  const [mode, setMode] = useState<AlarmMode>('exact');
  // 정확한 시간 모드용 상태
  const [time, setTime] = useState('09:00');
  // 타이머 모드용 상태 (시간, 분)
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(30);
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');

  /**
   * 타이머 모드에서 현재 시간 + 입력된 시간/분을 계산하여 알람 시간 반환
   */
  const calculateTimerAlarmTime = (): string => {
    const now = new Date();
    now.setHours(now.getHours() + timerHours);
    now.setMinutes(now.getMinutes() + timerMinutes);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  /**
   * 타이머 시간을 사람이 읽기 쉬운 형식으로 변환
   */
  const formatTimerDisplay = (): string => {
    const parts: string[] = [];
    if (timerHours > 0) parts.push(`${timerHours}시간`);
    if (timerMinutes > 0) parts.push(`${timerMinutes}분`);
    return parts.length > 0 ? `${parts.join(' ')} 후` : '지금';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 타이머 모드에서 유효성 검사
    if (mode === 'timer' && timerHours === 0 && timerMinutes === 0) {
      return;
    }
    
    if (selectedHabitId) {
      const habit = habits.find(h => h.id === selectedHabitId);
      const alarmTime = mode === 'exact' ? time : calculateTimerAlarmTime();
      const label = mode === 'timer' 
        ? `${habit?.name || ''} (${formatTimerDisplay()})`
        : habit?.name || '';
      // 타이머 모드일 때 설정한 시간(분)을 저장
      const timerDurationMinutes = mode === 'timer' 
        ? (timerHours * 60) + timerMinutes 
        : undefined;
      
      onAddAlarm({
        id: crypto.randomUUID(),
        time: alarmTime,
        label,
        habitId: selectedHabitId,
        timerDurationMinutes
      });
      setSelectedHabitId('');
      // 타이머 모드 초기화
      if (mode === 'timer') {
        setTimerHours(0);
        setTimerMinutes(30);
      }
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="alarm-habit">Select Habit</Label>
          <Select value={selectedHabitId} onValueChange={setSelectedHabitId} required>
            <SelectTrigger id="alarm-habit">
              <SelectValue placeholder="Choose a habit to track" />
            </SelectTrigger>
            <SelectContent>
              {habits.map((habit) => (
                <SelectItem key={habit.id} value={habit.id}>
                  {habit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 알람 모드 선택 탭 */}
        <div className="grid w-full items-center gap-1.5">
          <Label>Alarm Type</Label>
          <div className="flex rounded-lg border p-1 bg-muted/30">
            <button
              type="button"
              onClick={() => setMode('exact')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'exact'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Clock className="h-4 w-4" />
              정확한 시간
            </button>
            <button
              type="button"
              onClick={() => setMode('timer')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'timer'
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Timer className="h-4 w-4" />
              타이머
            </button>
          </div>
        </div>

        {/* 정확한 시간 모드 */}
        {mode === 'exact' && (
          <div className="flex gap-2 items-end">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="alarm-time">Alarm Time</Label>
              <Input
                id="alarm-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="[color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
            <Button type="submit" size="icon" aria-label="Add Alarm" disabled={!selectedHabitId}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* 타이머 모드 */}
        {mode === 'timer' && (
          <div className="space-y-3">
            <div className="flex gap-3 items-end">
              {/* 시간 입력 */}
              <div className="grid items-center gap-1.5">
                <Label htmlFor="timer-hours">Hours</Label>
                <div className="flex items-center gap-1">
                  <Input
                    id="timer-hours"
                    type="number"
                    min={0}
                    max={23}
                    value={timerHours}
                    onChange={(e) => setTimerHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                    className="w-20 text-center"
                  />
                  <span className="text-sm text-muted-foreground">시간</span>
                </div>
              </div>
              {/* 분 입력 */}
              <div className="grid items-center gap-1.5">
                <Label htmlFor="timer-minutes">Minutes</Label>
                <div className="flex items-center gap-1">
                  <Input
                    id="timer-minutes"
                    type="number"
                    min={0}
                    max={59}
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-20 text-center"
                  />
                  <span className="text-sm text-muted-foreground">분</span>
                </div>
              </div>
              <Button 
                type="submit" 
                size="icon" 
                aria-label="Add Timer Alarm" 
                disabled={!selectedHabitId || (timerHours === 0 && timerMinutes === 0)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {/* 타이머 미리보기 */}
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
              {timerHours === 0 && timerMinutes === 0 ? (
                <span className="text-destructive">시간을 설정해주세요</span>
              ) : (
                <>
                  <span className="font-medium">{formatTimerDisplay()}</span>
                  <span className="mx-2">→</span>
                  <span className="font-mono">{calculateTimerAlarmTime()}</span>
                  <span className="ml-1">에 알람</span>
                </>
              )}
            </div>
          </div>
        )}
      </form>
      <div className="space-y-3">
        <h3 className="font-medium">Upcoming Alarms</h3>
        <ScrollArea className="h-48">
          <div className="space-y-2 pr-4">
            {alarms.length > 0 ? (
              alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className="flex items-center justify-between rounded-md border p-3 bg-background"
                >
                  <div className="flex items-center gap-3">
                    <AlarmClock className="h-5 w-5 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-lg font-mono">{alarm.time}</span>
                      {alarm.label && <span className="text-xs text-muted-foreground">{alarm.label}</span>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteAlarm(alarm.id)}
                    className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Delete alarm for ${alarm.time}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No upcoming alarms.</p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
