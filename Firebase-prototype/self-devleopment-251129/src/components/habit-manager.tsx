'use client';

import type { Habit } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface HabitManagerProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

export function HabitManager({ habits, setHabits }: HabitManagerProps) {
  const [newHabitName, setNewHabitName] = useState('');
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
      icon: 'FileText', // default icon
    };
    setHabits(prev => [...prev, newHabit]);
    setNewHabitName('');
    toast({
      title: 'Habit Added!',
      description: `"${newHabitName}" has been added to your list.`,
    });
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
        {habits.map(habit => (
          <div key={habit.id} className="flex items-center justify-between rounded-md border p-3 bg-background">
            <span>{habit.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => deleteHabit(habit.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
