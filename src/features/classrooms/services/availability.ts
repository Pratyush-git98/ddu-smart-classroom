import { ACADEMIC_PERIODS } from "@/lib/constants";
import type {
  AvailabilitySource,
  ClassroomAvailabilityQuery,
  RoomAvailability,
  RoomAvailabilitySlot,
} from "@/types";
import { windowsOverlap } from "../lib/classroom-labels";

export interface OccupancyBlock {
  startTime: string;
  endTime: string;
  label: string;
}

const DAY_SLOTS = ACADEMIC_PERIODS.filter((period) => period.id !== "LUNCH").map((period) => ({
  startTime: period.startTime,
  endTime: period.endTime,
  label: period.label,
}));

export function buildRoomAvailability(
  query: ClassroomAvailabilityQuery,
  occupancy: OccupancyBlock[],
  source: AvailabilitySource,
  options?: { closedAllDay?: boolean; closedLabel?: string }
): RoomAvailability {
  const slots: RoomAvailabilitySlot[] = DAY_SLOTS.map((slot) => {
    if (options?.closedAllDay) {
      return {
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: "OCCUPIED",
        label: options.closedLabel ?? "Unavailable",
      };
    }

    const hit = occupancy.find((block) =>
      windowsOverlap(slot.startTime, slot.endTime, block.startTime, block.endTime)
    );

    return {
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: hit ? "OCCUPIED" : "FREE",
      label: hit?.label ?? "Free",
    };
  });

  const requestedIsFree =
    !options?.closedAllDay &&
    query.startTime < query.endTime &&
    !occupancy.some((block) =>
      windowsOverlap(query.startTime, query.endTime, block.startTime, block.endTime)
    );

  return {
    classroomId: query.classroomId,
    date: query.date,
    source,
    checkedAt: new Date().toISOString(),
    slots,
    requestedWindow: {
      startTime: query.startTime,
      endTime: query.endTime,
      isFree: requestedIsFree,
    },
  };
}
