// utils/weekDates.ts

const MAX_WEEKS = 520;

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

export function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  return addDays(d, day === 0 ? -6 : 1 - day);
}

export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return dateKey(a) === dateKey(b);
}

export function weekDays(weekStart: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) days.push(addDays(weekStart, i));
  return days;
}

export function weeksBetween(firstWeek: Date, lastWeek: Date): Date[] {
  const start = startOfWeek(firstWeek);
  const end = startOfWeek(lastWeek);

  const weeks: Date[] = [start];
  let cursor = start;

  while (cursor.getTime() < end.getTime() && weeks.length < MAX_WEEKS) {
    cursor = addDays(cursor, 7);
    weeks.push(cursor);
  }

  return weeks;
}
