"use client";

import { useRouter } from "next/navigation";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  AlertTriangle,
  Bell,
  CalendarClock,
  CheckCircle2,
  Radio,
  ShieldAlert,
  Wrench,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Notification, NotificationCategory, UserRole } from "@/types";
import { NOTIFICATION_CATEGORY_LABELS, NOTIFICATION_SEVERITY_LABELS } from "../lib/category-meta";
import { resolveNotificationHref } from "../lib/notification-href";
import { NOTIFICATION_SEVERITY_STYLES } from "../lib/notification-styles";

const CATEGORY_ICONS: Record<NotificationCategory, typeof Bell> = {
  CLASSROOM_CHANGE: AlertTriangle,
  TIMETABLE_UPDATE: CalendarClock,
  BOOKING_APPROVAL: CheckCircle2,
  BOOKING_REJECTION: XCircle,
  BOOKING_CANCELLATION: XCircle,
  SCHEDULE_CONFLICT: ShieldAlert,
  ACADEMIC_ANNOUNCEMENT: Bell,
  ROOM_MAINTENANCE: Wrench,
  IOT_ALERT: Radio,
};

interface NotificationItemProps {
  notification: Notification;
  role: UserRole;
  compact?: boolean;
  onMarkRead?: (id: string) => void;
  onOpen?: (notification: Notification) => void;
  className?: string;
}

export function NotificationItem({
  notification,
  role,
  compact = false,
  onMarkRead,
  onOpen,
  className,
}: NotificationItemProps) {
  const router = useRouter();
  const href = resolveNotificationHref(notification, role);
  const styles = NOTIFICATION_SEVERITY_STYLES[notification.severity];
  const Icon = CATEGORY_ICONS[notification.category];
  const created = parseISO(notification.createdAt);
  const relative = formatDistanceToNow(created, { addSuffix: true });
  const absolute = format(created, "d MMM yyyy, h:mm a");

  return (
    <article
      className={cn(
        "rounded-lg border p-3 transition-colors",
        notification.isRead ? styles.card : styles.unreadCard,
        !notification.isRead && "shadow-xs",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full", styles.iconWrap)}>
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-900">{notification.title}</h3>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                {NOTIFICATION_CATEGORY_LABELS[notification.category]}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <Badge variant="outline" className={cn("h-4 px-1.5 text-[10px]", styles.badge)}>
                {NOTIFICATION_SEVERITY_LABELS[notification.severity]}
              </Badge>
              <time className="text-[10px] text-slate-400" dateTime={notification.createdAt} title={absolute}>
                {relative}
              </time>
            </div>
          </div>
          <p className={cn("text-xs leading-relaxed text-slate-600", compact && "line-clamp-2")}>
            {notification.message}
          </p>
          {!compact && (
            <p className="text-[11px] text-slate-400">{absolute}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <Button
              type="button"
              variant="link"
              className="h-auto px-0 text-xs font-semibold text-blue-700"
              onClick={() => {
                onOpen?.(notification);
                router.push(href);
              }}
            >
              Open related view
            </Button>
            {!notification.isRead && onMarkRead && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-[11px] text-slate-600"
                onClick={() => onMarkRead(notification.id)}
              >
                Mark as read
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
