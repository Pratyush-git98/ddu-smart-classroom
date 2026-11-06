"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { useStudentOverview } from "../hooks/use-student-dashboard";
import { DashboardEmptyState, DashboardErrorState, DashboardLoadingState } from "./query-state";

const KIND_LABEL: Record<string, string> = {
  ROOM_CHANGE: "Classroom change",
  TIMETABLE: "Timetable",
  GENERAL: "Notice",
  REMINDER: "Reminder",
};

export function StudentNotificationsPage() {
  const overview = useStudentOverview();

  if (overview.isPending) {
    return <DashboardLoadingState label="Loading notices..." />;
  }

  if (overview.isError || !overview.data) {
    return (
      <DashboardErrorState
        message="Notifications could not be loaded from the student service."
        onRetry={() => void overview.refetch()}
      />
    );
  }

  const items = overview.data.notifications;
  if (items.length === 0) {
    return (
      <DashboardEmptyState
        title="No notifications yet"
        description="Classroom changes, lab reminders and academic notices for your section will appear here."
      />
    );
  }

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
        <p className="mt-1 text-sm text-slate-600">
          {overview.data.unreadNotificationCount} unread · classroom moves are highlighted first.
        </p>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`rounded-xl border p-4 ${
              item.isRead ? "border-slate-200 bg-white" : "border-blue-200 bg-blue-50/50"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                {KIND_LABEL[item.kind] ?? item.kind}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.message}</p>
            <p className="mt-2 text-[11px] text-slate-400">
              {format(parseISO(item.publishedAt), "d MMM yyyy, h:mm a")}
            </p>
            {item.href && (
              <Link href={item.href} className="mt-2 inline-block text-xs font-semibold text-blue-700 hover:underline">
                Open related view
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
