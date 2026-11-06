"use client";

import { useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common";
import { StaleDataHint } from "@/components/query/stale-data-hint";
import { useAuth } from "@/hooks/use-auth";
import { WEB_PUSH_UNSUPPORTED_MESSAGE } from "../services/channels/web-push-channel";
import { NotificationFilters, type NotificationFilterState } from "./notification-filters";
import { NotificationItem } from "./notification-item";
import { useNotificationCommands, useNotificationPreferences, useNotifications } from "../hooks/use-notifications";

const INITIAL_FILTERS: NotificationFilterState = {
  unreadOnly: false,
  category: "ALL",
  severity: "ALL",
};

export function NotificationCenterPage({
  title = "Notifications",
  description = "Classroom changes, timetable updates, booking outcomes and academic announcements.",
}: {
  title?: string;
  description?: string;
}) {
  const { user } = useAuth();
  const [filters, setFilters] = useState<NotificationFilterState>(INITIAL_FILTERS);
  const notices = useNotifications();
  const preferences = useNotificationPreferences();
  const commands = useNotificationCommands();

  const items = useMemo(() => {
    const list = notices.data ?? [];
    return list.filter((item) => {
      if (filters.unreadOnly && item.isRead) return false;
      if (filters.category !== "ALL" && item.category !== filters.category) return false;
      if (filters.severity !== "ALL" && item.severity !== filters.severity) return false;
      return true;
    });
  }, [filters, notices.data]);

  const unreadCount = (notices.data ?? []).filter((item) => !item.isRead).length;

  if (!user) {
    return (
      <EmptyState
        icon={Bell}
        title="Sign in required"
        description="Open the notification center after signing in to a student, faculty or admin workspace."
      />
    );
  }

  if (notices.isPending) {
    return (
      <div className="space-y-3" role="status">
        <div className="h-10 animate-pulse rounded-lg bg-slate-200/70" />
        <div className="h-24 animate-pulse rounded-xl bg-slate-200/60" />
        <div className="h-24 animate-pulse rounded-xl bg-slate-200/50" />
      </div>
    );
  }

  if (notices.isError) {
    return (
      <EmptyState
        icon={Bell}
        title="Notifications unavailable"
        description="The notification service could not be reached. Retry to reload the in-app inbox."
        action={
          <Button type="button" size="sm" onClick={() => void notices.refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            {unreadCount} unread · {description}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 gap-1.5"
          disabled={unreadCount === 0 || commands.markAllAsRead.isPending}
          onClick={() => void commands.markAllAsRead.mutateAsync()}
        >
          <CheckCheck className="size-3.5" />
          Mark all as read
        </Button>
      </div>

      <StaleDataHint
        hasData={Boolean(notices.data)}
        isFetching={notices.isFetching}
        isStale={notices.isStale}
        dataUpdatedAt={notices.dataUpdatedAt}
      />

      <NotificationFilters value={filters} onChange={setFilters} />

      <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
        Email copies are optional and queued for the campus mailer
        {preferences.data?.email.enabled ? " for booking and clash notices" : ""}. {WEB_PUSH_UNSUPPORTED_MESSAGE}
      </p>

      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filters.unreadOnly ? "No unread notifications" : "No matching notifications"}
          description="Adjust category or severity filters, or wait for the academic service to issue a new notice."
        />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <NotificationItem
                notification={item}
                role={user.role}
                onMarkRead={(id) => void commands.markAsRead.mutateAsync(id)}
                onOpen={(notice) => {
                  if (!notice.isRead) void commands.markAsRead.mutateAsync(notice.id);
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
