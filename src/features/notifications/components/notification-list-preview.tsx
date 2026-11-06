import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NotificationItem } from "./notification-item";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SystemNotification } from "@/types";

interface NotificationListPreviewProps {
  notifications: SystemNotification[];
  className?: string;
}

export function NotificationListPreview({
  notifications,
  className,
}: NotificationListPreviewProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card className={`border-slate-200 shadow-xs bg-white ${className ?? ""}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-blue-600" />
          <CardTitle className="text-base font-bold text-slate-900">
            System & Allocation Notifications
          </CardTitle>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5">
              {unreadCount} unread
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-slate-500 hover:text-slate-900 gap-1 h-7"
        >
          <CheckCheck className="size-3.5" />
          <span>Mark all read</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {notifications.map((notif) => (
          <NotificationItem key={notif.id} notification={notif} />
        ))}
      </CardContent>
    </Card>
  );
}

