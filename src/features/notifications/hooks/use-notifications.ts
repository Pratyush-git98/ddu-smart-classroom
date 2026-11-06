"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import type { NotificationQuery, UserRole } from "@/types";
import { getNotificationService } from "../services/notification-client";

export const NOTIFICATION_QUERY_KEY = ["notifications"] as const;

function inboxRole(role: UserRole | undefined): UserRole | undefined {
  if (!role) return undefined;
  return role === "SUPER_ADMIN" ? "ADMIN" : role;
}

export function useNotificationInboxQuery(): Pick<NotificationQuery, "recipientId" | "role"> {
  const { user } = useAuth();
  return {
    recipientId: user?.id,
    role: inboxRole(user?.role),
  };
}

export function useNotifications(filters?: Pick<NotificationQuery, "category" | "severity" | "unreadOnly">) {
  const inbox = useNotificationInboxQuery();
  const query: NotificationQuery = { ...inbox, ...filters };

  return useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEY, "list", query],
    queryFn: () => getNotificationService().list(query),
    enabled: Boolean(inbox.role && inbox.recipientId),
  });
}

export function useUnreadNotificationCount() {
  const inbox = useNotificationInboxQuery();

  return useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEY, "unread", inbox],
    queryFn: () => getNotificationService().getUnreadCount(inbox),
    enabled: Boolean(inbox.role && inbox.recipientId),
  });
}

export function useNotificationPreferences() {
  const { user } = useAuth();

  return useQuery({
    queryKey: [...NOTIFICATION_QUERY_KEY, "preferences", user?.id],
    queryFn: () => getNotificationService().getDeliveryPreferences(user!.id),
    enabled: Boolean(user?.id),
  });
}

function invalidateNotificationViews(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
  void queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
  void queryClient.invalidateQueries({ queryKey: ["faculty-dashboard"] });
  void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
}

export function useNotificationCommands() {
  const queryClient = useQueryClient();
  const inbox = useNotificationInboxQuery();

  const markAsRead = useMutation({
    mutationFn: (id: string) => getNotificationService().markAsRead(id, inbox.recipientId),
    onSuccess: () => invalidateNotificationViews(queryClient),
  });

  const markAllAsRead = useMutation({
    mutationFn: () => getNotificationService().markAllAsRead(inbox),
    onSuccess: () => invalidateNotificationViews(queryClient),
  });

  return { markAsRead, markAllAsRead, inbox };
}
