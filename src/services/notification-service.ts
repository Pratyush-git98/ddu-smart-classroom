import type { Notification } from "@/types";
import { getNotificationService } from "@/features/notifications/services/notification-client";
import { MOCK_NOTIFICATIONS as SEED } from "@/features/notifications/services/mock/mock-notifications";

export const MOCK_NOTIFICATIONS: Notification[] = SEED;

export async function getNotifications(): Promise<Notification[]> {
  return getNotificationService().list({});
}

export async function getUnreadNotificationCount(): Promise<number> {
  return getNotificationService().getUnreadCount({});
}
