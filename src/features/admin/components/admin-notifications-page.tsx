"use client";

import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAdminCommands, useAdminNotifications } from "../hooks/use-admin-dashboard";
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from "./query-state";

const PRIORITY_CLASS = {
  LOW: "border-slate-200 bg-slate-50 text-slate-600",
  NORMAL: "border-blue-200 bg-blue-50 text-blue-700",
  HIGH: "border-amber-200 bg-amber-50 text-amber-800",
  URGENT: "border-rose-200 bg-rose-50 text-rose-800",
} as const;

export function AdminNotificationsPage() {
  const notices = useAdminNotifications();
  const commands = useAdminCommands();

  if (notices.isPending) return <AdminLoadingState label="Loading operations notices..." />;
  if (notices.isError || !notices.data) {
    return <AdminErrorState message="Admin notifications could not be loaded." onRetry={() => void notices.refetch()} />;
  }

  const items = notices.data;
  const unread = items.filter((item) => !item.isRead).length;

  if (items.length === 0) {
    return <AdminEmptyState title="No notifications" description="Booking, timetable and IoT alerts for administrators will appear here." />;
  }

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
        <p className="mt-1 text-sm text-slate-600">{unread} unread · campus-wide and role-targeted notices.</p>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`rounded-xl border p-4 ${item.isRead ? "border-slate-200 bg-white" : "border-violet-200 bg-violet-50/40"}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={PRIORITY_CLASS[item.priority]}>
                  {item.priority}
                </Badge>
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{item.audience}</span>
              </div>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.message}</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] text-slate-400">{format(parseISO(item.timestamp), "d MMM yyyy, h:mm a")}</p>
              {!item.isRead && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={commands.markNotificationRead.isPending}
                  onClick={() => void commands.markNotificationRead.mutateAsync(item.id)}
                >
                  Mark as read
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
