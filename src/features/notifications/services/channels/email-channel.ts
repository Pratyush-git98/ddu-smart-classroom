import type { EmailNotificationPayload, NotificationDeliveryResult } from "@/types";
import type { EmailNotificationChannel } from "../notification-service.interface";

/**
 * Queues email copies for a future campus mailer. Nothing is sent on the wire.
 */
export class QueuedEmailNotificationChannel implements EmailNotificationChannel {
  readonly channel = "EMAIL" as const;
  private readonly queue: NotificationDeliveryResult[] = [];

  async send(payload: EmailNotificationPayload): Promise<NotificationDeliveryResult> {
    const result: NotificationDeliveryResult = {
      accepted: true,
      channel: "EMAIL",
      queuedAt: new Date().toISOString(),
      message: `Queued email notice ${payload.notificationId} for ${payload.to.join(", ")}.`,
    };
    this.queue.unshift(result);
    return result;
  }

  listQueued(): NotificationDeliveryResult[] {
    return [...this.queue];
  }
}

export const queuedEmailChannel = new QueuedEmailNotificationChannel();
