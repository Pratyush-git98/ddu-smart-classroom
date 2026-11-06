import type { UserRole } from "./user";

/**
 * Academic notice categories delivered by the Smart Classroom notification center.
 */
export const NOTIFICATION_CATEGORIES = [
  "CLASSROOM_CHANGE",
  "TIMETABLE_UPDATE",
  "BOOKING_APPROVAL",
  "BOOKING_REJECTION",
  "BOOKING_CANCELLATION",
  "SCHEDULE_CONFLICT",
  "ACADEMIC_ANNOUNCEMENT",
  "ROOM_MAINTENANCE",
  "IOT_ALERT",
] as const;

export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

/** Visual tone used in the inbox. Independent of ranking priority. */
export type NotificationSeverity = "INFO" | "WARNING" | "URGENT";

export type NotificationAudience = "ALL" | Exclude<UserRole, "SUPER_ADMIN">;

export type NotificationEntityType = "BOOKING" | "TIMETABLE" | "CLASSROOM" | "APPROVALS" | "NONE";

export type NotificationChannel = "IN_APP" | "EMAIL" | "WEB_PUSH";

/**
 * Deep-link target. The client resolves a role-aware href; the backend can
 * store the same entity pointer without baking UI routes into the payload.
 */
export interface NotificationTarget {
  entityType: NotificationEntityType;
  entityId?: string;
  /** Optional query keys such as timetable day or classroom code. */
  params?: Record<string, string>;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  priority: NotificationPriority;
  createdAt: string;
  isRead: boolean;
  readAt?: string | null;
  audience: NotificationAudience;
  /** When set, only these users receive the notice in addition to audience. */
  recipientUserIds?: string[];
  target: NotificationTarget;
  channels: NotificationChannel[];
}

/** @deprecated Prefer `Notification`. Alias kept for landing-page previews. */
export type SystemNotification = Notification;

export interface NotificationQuery {
  recipientId?: string;
  role?: UserRole;
  category?: NotificationCategory | "ALL";
  severity?: NotificationSeverity | "ALL";
  unreadOnly?: boolean;
}

export interface NotificationCommandResult {
  success: boolean;
  message: string;
  updatedCount: number;
}

export interface EmailNotificationPreference {
  enabled: boolean;
  categories: NotificationCategory[];
}

/**
 * Web push is a future channel. Preferences record intent only; the client
 * must not request browser Notification permission until a push service exists.
 */
export interface WebPushPreference {
  enabled: false;
  status: "UNAVAILABLE";
}

export interface NotificationDeliveryPreferences {
  userId: string;
  inApp: true;
  email: EmailNotificationPreference;
  webPush: WebPushPreference;
}

export interface EmailNotificationPayload {
  to: string[];
  subject: string;
  body: string;
  notificationId: string;
  category: NotificationCategory;
}

export interface NotificationDeliveryResult {
  accepted: boolean;
  channel: Extract<NotificationChannel, "EMAIL" | "IN_APP">;
  queuedAt: string;
  message: string;
}

export interface WebPushSubscriptionInput {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface WebPushPayload {
  title: string;
  body: string;
  notificationId: string;
}

export interface WebPushCapabilityResult {
  supported: false;
  registered: false;
  message: string;
}
