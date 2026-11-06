import type { ClassroomSearchFilters } from "@/types";
import { toLocalIsoDate } from "./classroom-labels";

export function createDefaultClassroomSearchFilters(
  now = new Date()
): ClassroomSearchFilters {
  return {
    campusId: "ALL",
    building: "ALL",
    date: toLocalIsoDate(now),
    startTime: "09:00",
    endTime: "10:00",
    minCapacity: undefined,
    roomType: "ALL",
    facilities: [],
    sort: "CAPACITY_DESC",
  };
}

export function serializeClassroomSearchFilters(filters: ClassroomSearchFilters): string {
  return JSON.stringify({
    campusId: filters.campusId,
    building: filters.building,
    date: filters.date,
    startTime: filters.startTime,
    endTime: filters.endTime,
    minCapacity: filters.minCapacity ?? null,
    roomType: filters.roomType,
    facilities: [...filters.facilities].sort(),
    sort: filters.sort,
  });
}
