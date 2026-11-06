export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type NotificationCategory =
  | "BOOKING_APPROVAL"
  | "BOOKING_REJECTION"
  | "TIMETABLE_RESCHEDULE"
  | "ROOM_MAINTENANCE"
  | "IOT_ALERT"
  | "GENERAL_ANNOUNCEMENT";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  targetRole?: "ALL" | "STUDENT" | "FACULTY" | "ADMIN";
}

