import type { TimetableSlot, DayOfWeek, TimetableFilterParams } from "@/types";

export type { TimetableSlot, DayOfWeek, TimetableFilterParams };

export interface TimetableSlotDisplayProps {
  slot: TimetableSlot;
  onSlotClick?: (slot: TimetableSlot) => void;
}

