import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from "lucide-react";
import type { SystemNotification } from "@/types";

interface NotificationItemProps {
  notification: SystemNotification;
  onMarkRead?: (id: string) => void;
  className?: string;
}

export function NotificationItem({
  notification,
  className,
}: NotificationItemProps) {
  const getCategoryIcon = () => {
    switch (notification.category) {
      case "BOOKING_APPROVAL":
        return <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />;
      case "IOT_ALERT":
        return <Radio className="size-4 text-amber-600 shrink-0" />;
      case "TIMETABLE_RESCHEDULE":
        return <AlertTriangle className="size-4 text-blue-600 shrink-0" />;
      default:
        return <Bell className="size-4 text-slate-500 shrink-0" />;
    }
  };

  const getPriorityBadge = () => {
    switch (notification.priority) {
      case "HIGH":
      case "URGENT":
        return (
          <Badge className="bg-rose-100 text-rose-800 text-[10px] h-4 px-1 border-0">
            High Priority
          </Badge>
        );
      case "NORMAL":
        return (
          <Badge className="bg-blue-100 text-blue-800 text-[10px] h-4 px-1 border-0">
            Normal
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
        notification.isRead
          ? "border-slate-100 bg-white opacity-85"
          : "border-blue-200/90 bg-blue-50/30 ring-1 ring-blue-100"
      } ${className ?? ""}`}
    >
      <div className="mt-0.5">{getCategoryIcon()}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-slate-900">{notification.title}</h4>
          <div className="flex items-center gap-1.5 shrink-0">
            {getPriorityBadge()}
            <span className="text-[10px] text-slate-400">{notification.timestamp}</span>
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{notification.message}</p>
      </div>
    </div>
  );
}
