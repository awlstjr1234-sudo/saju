import KoreanLunarCalendar from 'korean-lunar-calendar';

export type CalendarType = 'solar' | 'lunar';

export type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

export function toSolarDate(
  date: CalendarDate,
  calendarType: CalendarType,
  leapMonth = false,
): CalendarDate | null {
  const calendar = new KoreanLunarCalendar();
  const isValid = calendarType === 'lunar'
    ? calendar.setLunarDate(date.year, date.month, date.day, leapMonth)
    : calendar.setSolarDate(date.year, date.month, date.day);

  if (!isValid) return null;
  return calendarType === 'lunar' ? calendar.getSolarCalendar() : date;
}

export function parseCalendarDate(
  value: string,
  calendarType: CalendarType,
  leapMonth = false,
): CalendarDate | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  return toSolarDate({ year, month, day }, calendarType, leapMonth);
}