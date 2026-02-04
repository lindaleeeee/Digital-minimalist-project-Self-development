import { Habit, HabitLog, HistoryRecord } from './types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameDay, isSameWeek, isSameMonth, isSameYear } from 'date-fns';

export function calculateHistoryRecords(logs: HabitLog[], habits: Habit[]): HistoryRecord[] {
    return logs.map(log => {
        const habit = habits.find(h => h.id === log.habitId);
        if (!habit) return null;

        const logDate = new Date(log.endTime);

        // Daily Actual
        const dailyActual = logs
            .filter(l => l.habitId === log.habitId && isSameDay(new Date(l.endTime), logDate))
            .reduce((acc, l) => acc + (l.actualDurationMinutes || 0), 0);

        // Weekly Actual
        const weeklyActual = logs
            .filter(l => l.habitId === log.habitId && isSameWeek(new Date(l.endTime), logDate))
            .reduce((acc, l) => acc + (l.actualDurationMinutes || 0), 0);

        // Monthly Actual
        const monthlyActual = logs
            .filter(l => l.habitId === log.habitId && isSameMonth(new Date(l.endTime), logDate))
            .reduce((acc, l) => acc + (l.actualDurationMinutes || 0), 0);

        // Yearly Actual
        const yearlyActual = logs
            .filter(l => l.habitId === log.habitId && isSameYear(new Date(l.endTime), logDate))
            .reduce((acc, l) => acc + (l.actualDurationMinutes || 0), 0);

        const weeklyGoal = habit.weeklyGoalMinutes || 0;
        const dailyGoal = Math.round(weeklyGoal / 7);
        const monthlyGoal = weeklyGoal * 4;
        const yearlyGoal = weeklyGoal * 52;

        return {
            date: log.date || format(logDate, 'yyyy-MM-dd'),
            alarmTime: log.alarmTime || '00:00',
            habitName: habit.name,
            actualDuration: log.actualDurationMinutes || 0,
            yearlyGoal,
            yearlyActual,
            monthlyGoal,
            monthlyActual,
            weeklyGoal,
            weeklyActual,
            dailyGoal,
            dailyActual
        };
    }).filter(Boolean) as HistoryRecord[];
}
