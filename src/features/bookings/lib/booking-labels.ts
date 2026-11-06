import type { BookingPurpose } from "@/types";

export const BOOKING_PURPOSE_OPTIONS: { value: BookingPurpose; label: string }[] = [
  { value: "REGULAR_CLASS", label: "Regular class" },
  { value: "EXTRA_LECTURE", label: "Extra lecture" },
  { value: "SEMINAR", label: "Seminar" },
  { value: "EXAM", label: "Examination" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "CONFERENCE", label: "Conference" },
  { value: "STUDENT_EVENT", label: "Student event" },
];

export function purposeLabel(purpose: BookingPurpose): string {
  return BOOKING_PURPOSE_OPTIONS.find((item) => item.value === purpose)?.label ?? purpose.replace(/_/g, " ");
}
