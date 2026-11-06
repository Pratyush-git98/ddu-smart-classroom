import { windowsOverlap } from "@/features/classrooms/lib/classroom-labels";
import type { TimetableSlot } from "@/types";
import type { AdminTimetableSlot } from "../types";

export function annotateTimetableConflicts(slots: TimetableSlot[]): AdminTimetableSlot[] {
  return slots.map((slot) => {
    const clash = slots.find(
      (other) =>
        other.id !== slot.id &&
        other.dayOfWeek === slot.dayOfWeek &&
        other.classroomId === slot.classroomId &&
        windowsOverlap(slot.startTime, slot.endTime, other.startTime, other.endTime)
    );

    if (!clash) {
      return { ...slot, hasConflict: false };
    }

    return {
      ...slot,
      hasConflict: true,
      conflictReason: `Overlaps ${clash.subjectCode} (${clash.startTime}–${clash.endTime}) in ${clash.roomNumber}`,
    };
  });
}
