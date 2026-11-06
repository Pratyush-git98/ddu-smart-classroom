import type { DayOfWeek } from "@/types";
import { DAYS_OF_WEEK } from "@/lib/constants";
import type { FacultyBooking, FacultyLecture } from "../types";

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

export function formatFloor(floor: number): string {
  return floor === 0 ? "G" : String(floor);
}

export function toLocalIsoDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseSlotStart(date: string, startTime: string): Date {
  return new Date(`${date}T${startTime}:00`);
}

export function isFutureSlot(date: string, startTime: string, now = new Date()): boolean {
  return parseSlotStart(date, startTime).getTime() > now.getTime();
}

export function canEditBooking(booking: FacultyBooking, now = new Date()): boolean {
  return (
    (booking.status === "PENDING" || booking.status === "CONFLICT_DETECTED") &&
    isFutureSlot(booking.date, booking.startTime, now)
  );
}

export function canCancelBooking(booking: FacultyBooking, now = new Date()): boolean {
  if (booking.status === "REJECTED" || booking.status === "CANCELLED" || booking.status === "COMPLETED") {
    return false;
  }
  return isFutureSlot(booking.date, booking.startTime, now);
}

export function lecturesOnDate(lectures: FacultyLecture[], date: string): FacultyLecture[] {
  return lectures
    .filter((item) => item.date === date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export const ACADEMIC_DAYS = DAYS_OF_WEEK;
