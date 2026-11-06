import type {
  SystemNotification,
  NotificationCategory,
  NotificationPriority,
} from "@/types";

export type { SystemNotification, NotificationCategory, NotificationPriority };

export interface NotificationItemProps {
  notification: SystemNotification;
  onMarkRead?: (id: string) => void;
}

