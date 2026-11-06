import type { ClassroomFacility, ClassroomSearchSort, RoomType } from "@/types";
import { CLASSROOM_FACILITY_OPTIONS, CLASSROOM_SORT_OPTIONS, ROOM_TYPE_OPTIONS } from "../types";

export function facilityLabel(facility: ClassroomFacility): string {
  return CLASSROOM_FACILITY_OPTIONS.find((item) => item.id === facility)?.label ?? facility;
}

export function roomTypeLabel(type: RoomType | "ALL"): string {
  return ROOM_TYPE_OPTIONS.find((item) => item.id === type)?.label ?? type;
}

export function sortLabel(sort: ClassroomSearchSort): string {
  return CLASSROOM_SORT_OPTIONS.find((item) => item.id === sort)?.label ?? sort;
}

export function formatFloorLabel(floor: number): string {
  return floor === 0 ? "Ground" : `Floor ${floor}`;
}

export function toLocalIsoDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function timeToMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

export function windowsOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(startB) < timeToMinutes(endA);
}
