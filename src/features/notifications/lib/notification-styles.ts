import type { NotificationSeverity } from "@/types";

export const NOTIFICATION_SEVERITY_STYLES: Record<
  NotificationSeverity,
  {
    card: string;
    unreadCard: string;
    iconWrap: string;
    badge: string;
  }
> = {
  INFO: {
    card: "border-slate-200 bg-white",
    unreadCard: "border-blue-200 bg-blue-50/60",
    iconWrap: "bg-blue-100 text-blue-700",
    badge: "border-blue-200 bg-blue-50 text-blue-800",
  },
  WARNING: {
    card: "border-amber-100 bg-white",
    unreadCard: "border-amber-300 bg-amber-50/70",
    iconWrap: "bg-amber-100 text-amber-800",
    badge: "border-amber-200 bg-amber-50 text-amber-900",
  },
  URGENT: {
    card: "border-rose-100 bg-white",
    unreadCard: "border-rose-300 bg-rose-50/80 ring-1 ring-rose-100",
    iconWrap: "bg-rose-100 text-rose-800",
    badge: "border-rose-200 bg-rose-50 text-rose-900",
  },
};
