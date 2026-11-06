import type {
  Notification,
  NotificationCommandResult,
  NotificationDeliveryPreferences,
  NotificationQuery,
  UserRole,
} from "@/types";
import { mockDelay } from "@/services/api-client";
import type { NotificationService } from "../notification-service.interface";
import { defaultDeliveryPreferences, MOCK_NOTIFICATIONS } from "./mock-notifications";

function cloneNotice(item: Notification): Notification {
  return {
    ...item,
    target: { ...item.target, params: item.target.params ? { ...item.target.params } : undefined },
    recipientUserIds: item.recipientUserIds ? [...item.recipientUserIds] : undefined,
    channels: [...item.channels],
  };
}

function matchesAudience(item: Notification, role?: UserRole): boolean {
  if (!role) return true;
  const normalized = role === "SUPER_ADMIN" ? "ADMIN" : role;
  return item.audience === "ALL" || item.audience === normalized;
}

function matchesRecipient(item: Notification, recipientId?: string): boolean {
  if (!recipientId) return true;
  if (!item.recipientUserIds || item.recipientUserIds.length === 0) return true;
  return item.recipientUserIds.includes(recipientId);
}

function applyQuery(items: Notification[], query: NotificationQuery): Notification[] {
  return items.filter((item) => {
    if (!matchesAudience(item, query.role)) return false;
    if (!matchesRecipient(item, query.recipientId)) return false;
    if (query.category && query.category !== "ALL" && item.category !== query.category) return false;
    if (query.severity && query.severity !== "ALL" && item.severity !== query.severity) return false;
    if (query.unreadOnly && item.isRead) return false;
    return true;
  });
}

function sortNotices(items: Notification[]): Notification[] {
  return [...items].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

class MockNotificationService implements NotificationService {
  private items = MOCK_NOTIFICATIONS.map(cloneNotice);
  private preferences = new Map<string, NotificationDeliveryPreferences>();

  async list(query: NotificationQuery): Promise<Notification[]> {
    await mockDelay(120);
    return sortNotices(applyQuery(this.items, query)).map(cloneNotice);
  }

  async getById(id: string): Promise<Notification | null> {
    await mockDelay(60);
    const found = this.items.find((item) => item.id === id);
    return found ? cloneNotice(found) : null;
  }

  async getUnreadCount(query: Pick<NotificationQuery, "recipientId" | "role">): Promise<number> {
    await mockDelay(80);
    return applyQuery(this.items, { ...query, unreadOnly: true }).length;
  }

  async markAsRead(id: string): Promise<NotificationCommandResult> {
    await mockDelay(70);
    const found = this.items.find((item) => item.id === id);
    if (!found) {
      return { success: false, message: "Notification was not found.", updatedCount: 0 };
    }
    if (!found.isRead) {
      found.isRead = true;
      found.readAt = new Date().toISOString();
    }
    return { success: true, message: "Marked as read.", updatedCount: 1 };
  }

  async markAllAsRead(query: Pick<NotificationQuery, "recipientId" | "role">): Promise<NotificationCommandResult> {
    await mockDelay(90);
    const now = new Date().toISOString();
    let updatedCount = 0;
    this.items = this.items.map((item) => {
      if (!matchesAudience(item, query.role) || !matchesRecipient(item, query.recipientId) || item.isRead) {
        return item;
      }
      updatedCount += 1;
      return { ...item, isRead: true, readAt: now };
    });
    return {
      success: true,
      message: updatedCount === 0 ? "No unread notifications." : `Marked ${updatedCount} notification${updatedCount === 1 ? "" : "s"} as read.`,
      updatedCount,
    };
  }

  async getDeliveryPreferences(userId: string): Promise<NotificationDeliveryPreferences> {
    await mockDelay(50);
    const existing = this.preferences.get(userId);
    if (existing) return { ...existing, email: { ...existing.email, categories: [...existing.email.categories] } };
    const created = defaultDeliveryPreferences(userId);
    this.preferences.set(userId, created);
    return created;
  }

  async updateDeliveryPreferences(
    userId: string,
    patch: Partial<Pick<NotificationDeliveryPreferences, "email">>
  ): Promise<NotificationDeliveryPreferences> {
    await mockDelay(70);
    const current = await this.getDeliveryPreferences(userId);
    const next: NotificationDeliveryPreferences = {
      ...current,
      inApp: true,
      webPush: { enabled: false, status: "UNAVAILABLE" },
      email: {
        enabled: patch.email?.enabled ?? current.email.enabled,
        categories: patch.email?.categories ?? current.email.categories,
      },
    };
    this.preferences.set(userId, next);
    return next;
  }
}

export const mockNotificationService: NotificationService = new MockNotificationService();
