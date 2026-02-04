'use server';

import type { Habit, HabitLog } from '@/lib/types';
import { formatDuration } from '@/lib/utils';

export async function logHabitAction(
  note: string,
  startTime: number,
  habit: Habit
): Promise<HabitLog> {
  const endTime = Date.now();
  const durationMs = endTime - startTime;

  if (!note.trim()) {
    throw new Error('Note cannot be empty.');
  }

  // Simulate some network delay. In the future, this could be a database call.
  await new Promise(resolve => setTimeout(resolve, 500));

  const newLog: HabitLog = {
    id: crypto.randomUUID(),
    habitId: habit.id,
    note,
    startTime,
    endTime,
    duration: formatDuration(durationMs),
    keywords: [habit.name], // Use habit name as the keyword
  };

  // In a real application, you would save this data to a database
  console.log('Logged new habit activity:', newLog);

  return newLog;
}
