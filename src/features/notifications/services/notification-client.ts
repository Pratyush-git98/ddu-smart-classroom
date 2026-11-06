import type { NotificationService } from "./notification-service.interface";
import { queuedEmailChannel } from "./channels/email-channel";
import { unsupportedWebPushChannel } from "./channels/web-push-channel";
import { mockNotificationService } from "./mock/mock-notification-adapter";

/**
 * Inbox adapter. Swap `mockNotificationService` for an HTTP client when the
 * campus notification API is available. Email and web-push stay injected
 * separately so in-app UI never pretends to own those transports.
 */
export function getNotificationService(): NotificationService {
  return mockNotificationService;
}

export function getEmailNotificationChannel() {
  return queuedEmailChannel;
}

export function getWebPushNotificationChannel() {
  return unsupportedWebPushChannel;
}
