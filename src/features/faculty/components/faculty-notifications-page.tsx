"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { useFacultyOverview } from "../hooks/use-faculty-dashboard";
import { FacultyEmptyState, FacultyErrorState, FacultyLoadingState } from "./query-state";

const KIND_LABEL = {
  BOOKING: "Booking",
  SCHEDULE: "Schedule",
  GENERAL: "Notice",
} as const;

export function FacultyNotificationsPage() {
  const overview = useFacultyOverview();

  if (overview.isPending) return <FacultyLoadingState label="Loading notices..." />;
  if (overview.isError || !overview.data) {
    return (
      <FacultyErrorState
        message="Faculty notifications could not be loaded."
        onRetry={() => void overview.refetch()}
      />
    );
  }

  const items = overview.data.notifications;
  if (items.length === 0) {
    return (
      <FacultyEmptyState
        title="No notifications"
        description="Booking outcomes and teaching reminders for this faculty persona will appear here."
      />
    );
  }

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
        <p className="mt-1 text-sm text-slate-600">
          {overview.data.unreadNotificationCount} unread · booking outcomes are issued by the academic service.
        </p>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`rounded-xl border p-4 ${
              item.isRead ? "border-slate-200 bg-white" : "border-indigo-200 bg-indigo-50/40"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                {KIND_LABEL[item.kind]}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.message}</p>
            <p className="mt-2 text-[11px] text-slate-400">
              {format(parseISO(item.publishedAt), "d MMM yyyy, h:mm a")}
            </p>
            {item.href && (
              <Link href={item.href} className="mt-2 inline-block text-xs font-semibold text-indigo-700 hover:underline">
                Open related view
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
