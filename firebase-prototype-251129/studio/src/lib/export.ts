'use client';

import { Habit, HabitLog } from './types';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { calculateHistoryRecords } from './history-utils';

function createCSV(headers: string[], data: (string | number)[][]): string {
  const csvRows = [];
  csvRows.push(headers.join(','));
  for (const row of data) {
    const values = row.map(value => {
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
}

function downloadFile(content: any, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function downloadHabitLogs(logs: HabitLog[], habits: Habit[], formatType: 'csv' | 'xlsx'): void {
  const filename = `FocusHabitLauncher_Export_${format(new Date(), 'yyyyMMdd')}`;

  if (formatType === 'csv') {
    const headers = ['Date', 'Time', 'Habit', 'Note', 'Duration (seconds)'];
    const data = logs.map(log => {
      const habit = habits.find(h => h.id === log.habitId);
      const durationInSeconds = (log.endTime - log.startTime) / 1000;
      return [
        format(new Date(log.endTime), 'yyyy-MM-dd'),
        format(new Date(log.endTime), 'HH:mm:ss'),
        habit ? habit.name : 'Unknown Habit',
        log.note,
        durationInSeconds
      ];
    });
    const csvContent = createCSV(headers, data);
    downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
  } else if (formatType === 'xlsx') {
    const historyRecords = calculateHistoryRecords(logs, habits);
    const headers = [
      '알람 세팅한 날짜',
      '알람 세팅한 시간',
      '세팅한 목표',
      '실행시간(분)',
      '연 목표 시간(분)',
      '연 실행시간(누적)',
      '월 목표 시간(분)',
      '월 실행시간(누적)',
      '주 목표 시간(분)',
      '주 실행시간(누적)',
      '일 목표 시간(분)',
      '일 실행시간'
    ];

    const data = historyRecords.map(r => [
      r.date,
      r.alarmTime,
      r.habitName,
      r.actualDuration,
      r.yearlyGoal,
      r.yearlyActual,
      r.monthlyGoal,
      r.monthlyActual,
      r.weeklyGoal,
      r.weeklyActual,
      r.dailyGoal,
      r.dailyActual
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'History DB');
    const xlsxContent = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    downloadFile(xlsxContent, `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }
}
