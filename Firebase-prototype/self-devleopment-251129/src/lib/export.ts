'use client';

import { Habit, HabitLog } from './types';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

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

function downloadFile(content: string, filename: string, mimeType: string) {
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

  const filename = `FocusHabitLauncher_Export_${format(new Date(), 'yyyyMMdd')}`;

  if (formatType === 'csv') {
    const csvContent = createCSV(headers, data);
    downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
  } else if (formatType === 'xlsx') {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Habit Logs');
    const xlsxContent = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    downloadFile(new Uint8Array(xlsxContent).toString(), `${filename}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  }
}
