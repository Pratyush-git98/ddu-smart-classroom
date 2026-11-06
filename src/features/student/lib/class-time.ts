import type { DayOfWeek } from "@/types";
import { DAYS_OF_WEEK } from "@/lib/constants";
import type { ClassSessionStatus, StudentClassSession } from "../types";

const JS_DAY_TO_ACADEMIC: Record<number, DayOfWeek | null> = {
  0: null,
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export function getAcademicDayOfWeek(date = new Date()): DayOfWeek | null {
  return JS_DAY_TO_ACADEMIC[date.getDay()] ?? null;
}

export function parseMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

export function formatClock(hhmm: string): string {
  const [rawH, rawM] = hhmm.split(":").map(Number);
  const hours = rawH ?? 0;
  const minutes = rawM ?? 0;
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatClock(startTime)} – ${formatClock(endTime)}`;
}

export function currentMinutes(date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function resolveSessionStatus(
  session: StudentClassSession,
  now = new Date(),
  academicDay: DayOfWeek | null = getAcademicDayOfWeek(now)
): ClassSessionStatus {
  if (session.cancelled) return "CANCELLED";

  const isToday = academicDay === session.dayOfWeek;
  const start = parseMinutes(session.startTime);
  const end = parseMinutes(session.endTime);
  const nowMins = currentMinutes(now);

  if (isToday && nowMins >= start && nowMins < end) return "LIVE";
  if (session.previousVenue) return "ROOM_CHANGED";
  if (!academicDay) return "UPCOMING";
  if (isToday && nowMins >= end) return "COMPLETED";
  if (isToday && nowMins < start) return "UPCOMING";

  const todayIndex = academicDay ? DAYS_OF_WEEK.indexOf(academicDay) : -1;
  const sessionIndex = DAYS_OF_WEEK.indexOf(session.dayOfWeek);
  if (todayIndex >= 0 && sessionIndex < todayIndex) return "COMPLETED";
  return "UPCOMING";
}

export function getTodaySessions(
  sessions: StudentClassSession[],
  academicDay: DayOfWeek | null = getAcademicDayOfWeek()
): StudentClassSession[] {
  if (!academicDay) return [];
  return sessions
    .filter((session) => session.dayOfWeek === academicDay)
    .sort((a, b) => a.periodNumber - b.periodNumber);
}

export function getNextUpcomingSession(
  sessions: StudentClassSession[],
  now = new Date()
): StudentClassSession | null {
  const today = getTodaySessions(sessions, getAcademicDayOfWeek(now));
  const nowMins = currentMinutes(now);
  return (
    today.find((session) => {
      if (session.cancelled) return false;
      return parseMinutes(session.endTime) > nowMins;
    }) ?? null
  );
}

export function getCountdownLabel(session: StudentClassSession, now = new Date()): string {
  const status = resolveSessionStatus(session, now);
  const nowMins = currentMinutes(now);
  const start = parseMinutes(session.startTime);
  const end = parseMinutes(session.endTime);

  if (status === "CANCELLED") return "Cancelled";
  if (status === "COMPLETED") return `Ended at ${formatClock(session.endTime)}`;

  if (status === "LIVE" || (nowMins >= start && nowMins < end)) {
    const remaining = end - nowMins;
    return remaining <= 1 ? "Ending now" : `In session · ends in ${remaining} min`;
  }

  const untilStart = start - nowMins;
  if (untilStart <= 0) return `Starts at ${formatClock(session.startTime)}`;
  if (untilStart < 60) return `Starts in ${untilStart} min`;
  const hours = Math.floor(untilStart / 60);
  const minutes = untilStart % 60;
  if (minutes === 0) return `Starts in ${hours} hr`;
  return `Starts in ${hours} hr ${minutes} min`;
}

export const ACADEMIC_DAYS = DAYS_OF_WEEK;
