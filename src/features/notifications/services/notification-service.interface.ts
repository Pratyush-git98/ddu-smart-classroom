import type {
  EmailNotificationPayload,
  Notification,
  NotificationCommandResult,
  NotificationDeliveryPreferences,
  NotificationDeliveryResult,
  NotificationQuery,
  WebPushCapabilityResult,
  WebPushPayload,
  WebPushSubscriptionInput,
} from "@/types";

/**
 * In-app notification inbox port.
 *
 * Replace the mock adapter with campus API calls. Keep method signatures so
 * the dropdown and notifications page stay unchanged.
 */
export interface NotificationService {
  list(query: NotificationQuery): Promise<Notification[]>;
  getById(id: string): Promise<Notification | null>;
  getUnreadCount(query: Pick<NotificationQuery, "recipientId" | "role">): Promise<number>;
  markAsRead(id: string, actorId?: string): Promise<NotificationCommandResult>;
  markAllAsRead(query: Pick<NotificationQuery, "recipientId" | "role">): Promise<NotificationCommandResult>;
  getDeliveryPreferences(userId: string): Promise<NotificationDeliveryPreferences>;
  updateDeliveryPreferences(
    userId: string,
    patch: Partial<Pick<NotificationDeliveryPreferences, "email">>
  ): Promise<NotificationDeliveryPreferences>;
}

/**
 * Optional email fan-out. Implementations may queue for the campus mailer;
 * they must not pretend a message was delivered to a real SMTP host.
 */
export interface EmailNotificationChannel {
  readonly channel: "EMAIL";
  send(payload: EmailNotificationPayload): Promise<NotificationDeliveryResult>;
}

/**
 * Explicit integration boundary for future Web Push.
 *
 * Do not call the browser Notification API or service-worker push from this
 * surface until a real push service is registered. Unsupported implementations
 * must report `supported: false`.
 */
export interface WebPushNotificationChannel {
  readonly channel: "WEB_PUSH";
  isSupported(): boolean;
  subscribe(subscription: WebPushSubscriptionInput): Promise<WebPushCapabilityResult>;
  unsubscribe(endpoint: string): Promise<WebPushCapabilityResult>;
  send(payload: WebPushPayload): Promise<WebPushCapabilityResult>;
}
