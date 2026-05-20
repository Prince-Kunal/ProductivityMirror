import { toZonedTime, fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { startOfDay, endOfDay, subDays, isSameDay, parseISO } from "date-fns";

export const DEFAULT_TIMEZONE = "Asia/Kolkata";

/**
 * Returns a debug payload showing current timezone and server vs local time details.
 */
export function getDebugInfo(tz: string = DEFAULT_TIMEZONE) {
  const now = new Date();
  const zoned = toZonedTime(now, tz);
  return {
    serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    configuredTimezone: tz,
    utcNow: now.toISOString(),
    localNow: formatInTimeZone(now, tz, "yyyy-MM-dd HH:mm:ss.SSS XXX"),
    todayLocalStart: getStartOfDay(now, tz).toISOString(),
    todayLocalEnd: getEndOfDay(now, tz).toISOString(),
    yesterdayLocalStart: getYesterday(tz).start.toISOString(),
    yesterdayLocalEnd: getYesterday(tz).end.toISOString(),
  };
}

/**
 * Helper to parse a date safely.
 */
function safeParse(date: Date | string): Date {
  if (typeof date === "string") {
    return parseISO(date);
  }
  return date;
}

/**
 * Converts a UTC date to a zoned Date representing the local time.
 */
export function convertUTCToLocal(date: Date | string, tz: string = DEFAULT_TIMEZONE): Date {
  return toZonedTime(safeParse(date), tz);
}

/**
 * Converts a local zoned Date back to a UTC Date.
 */
export function convertLocalToUTC(date: Date | string, tz: string = DEFAULT_TIMEZONE): Date {
  return fromZonedTime(safeParse(date), tz);
}

/**
 * Gets the UTC Date that represents the start of the day (00:00:00) in the specified local timezone.
 */
export function getStartOfDay(date: Date | string, tz: string = DEFAULT_TIMEZONE): Date {
  const zoned = toZonedTime(safeParse(date), tz);
  const localStart = startOfDay(zoned);
  return fromZonedTime(localStart, tz);
}

/**
 * Gets the UTC Date that represents the end of the day (23:59:59.999) in the specified local timezone.
 */
export function getEndOfDay(date: Date | string, tz: string = DEFAULT_TIMEZONE): Date {
  const zoned = toZonedTime(safeParse(date), tz);
  const localEnd = endOfDay(zoned);
  return fromZonedTime(localEnd, tz);
}

/**
 * Gets the start and end dates in UTC for "Today" in the specified timezone.
 */
export function getToday(tz: string = DEFAULT_TIMEZONE): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: getStartOfDay(now, tz),
    end: getEndOfDay(now, tz),
  };
}

/**
 * Gets the start and end dates in UTC for "Yesterday" in the specified timezone.
 */
export function getYesterday(tz: string = DEFAULT_TIMEZONE): { start: Date; end: Date } {
  const now = new Date();
  const zoned = toZonedTime(now, tz);
  const yesterdayZoned = subDays(zoned, 1);
  return {
    start: getStartOfDay(yesterdayZoned, tz),
    end: getEndOfDay(yesterdayZoned, tz),
  };
}

/**
 * Checks if a given date falls on "Today" in the local timezone.
 */
export function isToday(date: Date | string, tz: string = DEFAULT_TIMEZONE): boolean {
  const inputZoned = toZonedTime(safeParse(date), tz);
  const nowZoned = toZonedTime(new Date(), tz);
  return isSameDay(inputZoned, nowZoned);
}

/**
 * Checks if a given date falls on "Yesterday" in the local timezone.
 */
export function isYesterday(date: Date | string, tz: string = DEFAULT_TIMEZONE): boolean {
  const inputZoned = toZonedTime(safeParse(date), tz);
  const nowZoned = toZonedTime(new Date(), tz);
  const yesterdayZoned = subDays(nowZoned, 1);
  return isSameDay(inputZoned, yesterdayZoned);
}

/**
 * Formats a date or ISO string in the specified local timezone.
 */
export function formatLocalDate(
  date: Date | string,
  formatStr: string,
  tz: string = DEFAULT_TIMEZONE
): string {
  const parsed = safeParse(date);
  return formatInTimeZone(parsed, tz, formatStr);
}
