"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { invalidateNotificationViews } from "@/lib/invalidate-queries";
import { QUERY_CACHE } from "@/lib/query-cache-policy";
import { queryKeys } from "@/lib/query-keys";
import type { NotificationQuery, UserRole } from "@/types";
import { getNotificationService } from "../services/notification-client";

export const NOTIFICATION_QUERY_KEY = queryKeys.notifications.all;

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
    queryKey: queryKeys.notifications.list(query),
    queryFn: () => getNotificationService().list(query),
    enabled: Boolean(inbox.role && inbox.recipientId),
    staleTime: QUERY_CACHE.notifications.staleTimeMs,
    gcTime: QUERY_CACHE.notifications.gcTimeMs,
  });
}

export function useUnreadNotificationCount() {
  const inbox = useNotificationInboxQuery();

  return useQuery({
    queryKey: queryKeys.notifications.unread(inbox),
    queryFn: () => getNotificationService().getUnreadCount(inbox),
    enabled: Boolean(inbox.role && inbox.recipientId),
    staleTime: QUERY_CACHE.notifications.staleTimeMs,
    gcTime: QUERY_CACHE.notifications.gcTimeMs,
  });
}

export function useNotificationPreferences() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.notifications.preferences(user?.id),
    queryFn: () => getNotificationService().getDeliveryPreferences(user!.id),
    enabled: Boolean(user?.id),
    staleTime: QUERY_CACHE.profiles.staleTimeMs,
    gcTime: QUERY_CACHE.profiles.gcTimeMs,
    refetchOnWindowFocus: false,
  });
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
