"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import type { Notification } from "@/types";
import { NOTIFICATION_CATEGORY_LABELS, NOTIFICATION_SEVERITY_LABELS } from "../lib/category-meta";
import { NOTIFICATION_SEVERITY_STYLES } from "../lib/notification-styles";
import { format, parseISO } from "date-fns";

interface NotificationListPreviewProps {
  notifications: Notification[];
  className?: string;
}

export function NotificationListPreview({
  notifications,
  className,
}: NotificationListPreviewProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card className={`border-slate-200 bg-white shadow-xs ${className ?? ""}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-blue-600" />
          <CardTitle className="text-base font-bold text-slate-900">
            System & Allocation Notifications
          </CardTitle>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
              {unreadCount} unread
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {notifications.map((notif) => {
          const styles = NOTIFICATION_SEVERITY_STYLES[notif.severity];
          return (
            <div
              key={notif.id}
              className={`rounded-lg border p-3 ${notif.isRead ? styles.card : styles.unreadCard}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold ${styles.badge}`}>
                  {NOTIFICATION_SEVERITY_LABELS[notif.severity]}
                </span>
              </div>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                {NOTIFICATION_CATEGORY_LABELS[notif.category]}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{notif.message}</p>
              <p className="mt-2 text-[10px] text-slate-400">
                {format(parseISO(notif.createdAt), "d MMM yyyy, h:mm a")}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
