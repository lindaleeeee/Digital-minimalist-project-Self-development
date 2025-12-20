'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlarmClock, Plus, X } from 'lucide-react';
import type { Alarm } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { Label } from './ui/label';

interface AlarmSetterProps {
  alarms: Alarm[];
  onAddAlarm: (alarm: Alarm) => void;
  onDeleteAlarm: (id: string) => void;
}

export function AlarmSetter({ alarms, onAddAlarm, onDeleteAlarm }: AlarmSetterProps) {
  const [time, setTime] = useState('09:00');
  const [label, setLabel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (time) {
      onAddAlarm({ id: crypto.randomUUID(), time, label });
      setLabel('');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="alarm-label">Label (Optional)</Label>
          <Input
            id="alarm-label"
            type="text"
            placeholder="e.g., Morning Routine"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
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
          <Button type="submit" size="icon" aria-label="Add Alarm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
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
