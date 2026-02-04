'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Habit, HabitLog } from '@/lib/types';
import { format } from 'date-fns';
import { ActivityIcon, BookOpen, Dumbbell, Languages, BrainCircuit, Pill, Brain, FileText } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import React from 'react';

const habitIcons: { [key: string]: React.ElementType } = {
  'default': FileText,
  '명상': Brain,
  '독서': BookOpen,
  '영어': Languages,
  '운동': Dumbbell,
  '공부': BrainCircuit,
  '영양제': Pill,
  // For english keywords
  'reading': BookOpen,
  'english': Languages,
  'study': BrainCircuit,
  'work out': Dumbbell,
  'exercise': Dumbbell,
  'gym': Dumbbell,
  'meditation': Brain,
  'pills': Pill
};

const HabitBadge = ({ habit }: { habit: Habit }) => {
  const Icon = habitIcons[habit.name.toLowerCase()] || habitIcons[habit.icon?.toLowerCase() || ''] || habitIcons['default'];
  return (
    <Badge variant="secondary" className="gap-1.5 capitalize">
      <Icon className="w-4 h-4" />
      {habit.name}
    </Badge>
  );
};


/**
 * @component HabitLogList
 * @description Displays a historical log of completed habits in a scrollable list.
 * Shows details such as the habit name, user notes, completion time, and duration.
 *
 * @props
 * - logs: Array of HabitLog objects representing past activities.
 * - habits: Array of Habit definitions to look up names and icons.
 *
 * @features
 * - Maps habit IDs to names and icons.
 * - Formats timestamps for readability.
 * - Shows an empty state when no logs exist.
 */
export function HabitLogList({ logs, habits }: { logs: HabitLog[], habits: Habit[] }) {
  const getHabitById = (id: string) => habits.find(h => h.id === id);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Habit History</CardTitle>
        <CardDescription>A log of your completed habits.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-0">
        <ScrollArea className="flex-grow">
        <div className="px-6 pb-6">
          {logs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Habit</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead className="text-right">Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const habit = getHabitById(log.habitId);
                  return (
                  <TableRow key={log.id}>
                    <TableCell>
                      {habit ? <HabitBadge habit={habit} /> : 'Unknown Habit'}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{log.note}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(log.endTime), 'MMM d, yyyy, hh:mm a')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{log.duration}</TableCell>
                  </TableRow>
                )})}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-10 rounded-md border-2 border-dashed h-full">
              <ActivityIcon className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No habits logged yet</h3>
              <p className="text-sm text-muted-foreground">Set an alarm and complete a habit to see it here.</p>
            </div>
          )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
