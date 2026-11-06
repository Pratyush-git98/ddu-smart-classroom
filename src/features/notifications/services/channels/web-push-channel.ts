import type { WebPushCapabilityResult } from "@/types";
import type { WebPushNotificationChannel } from "../notification-service.interface";

export const WEB_PUSH_UNSUPPORTED_MESSAGE =
  "Web push is not configured. In-app notifications remain the delivery path until a push service is registered.";

function unsupported(): WebPushCapabilityResult {
  return {
    supported: false,
    registered: false,
    message: WEB_PUSH_UNSUPPORTED_MESSAGE,
  };
}

/**
 * No-op push boundary. Intentionally does not touch Notification.permission,
 * service workers, or fake toast "pushes".
 */
export class UnsupportedWebPushChannel implements WebPushNotificationChannel {
  readonly channel = "WEB_PUSH" as const;

  isSupported(): boolean {
    return false;
  }

  async subscribe(): Promise<WebPushCapabilityResult> {
    return unsupported();
  }

  async unsubscribe(): Promise<WebPushCapabilityResult> {
    return unsupported();
  }

  async send(): Promise<WebPushCapabilityResult> {
    return unsupported();
  }
}

export const unsupportedWebPushChannel = new UnsupportedWebPushChannel();
