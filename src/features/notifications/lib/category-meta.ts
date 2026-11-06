import type { NotificationCategory, NotificationSeverity } from "@/types";
import { NOTIFICATION_CATEGORIES } from "@/types";

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  CLASSROOM_CHANGE: "Classroom change",
  TIMETABLE_UPDATE: "Timetable update",
  BOOKING_APPROVAL: "Booking approval",
  BOOKING_REJECTION: "Booking rejection",
  BOOKING_CANCELLATION: "Cancellation",
  SCHEDULE_CONFLICT: "Schedule conflict",
  ACADEMIC_ANNOUNCEMENT: "Academic announcement",
  ROOM_MAINTENANCE: "Room maintenance",
  IOT_ALERT: "Facility alert",
};

export const NOTIFICATION_SEVERITY_LABELS: Record<NotificationSeverity, string> = {
  INFO: "Informational",
  WARNING: "Warning",
  URGENT: "Urgent",
};

export const FILTERABLE_CATEGORIES = NOTIFICATION_CATEGORIES;

export const FILTERABLE_SEVERITIES: NotificationSeverity[] = ["INFO", "WARNING", "URGENT"];
