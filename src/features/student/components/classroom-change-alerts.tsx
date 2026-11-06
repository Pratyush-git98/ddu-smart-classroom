"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ClassroomChangeAlert } from "../types";
import { formatClock } from "../lib/class-time";
import { DashboardEmptyState } from "./query-state";

export function ClassroomChangeAlerts({ alerts }: { alerts: ClassroomChangeAlert[] }) {
  if (alerts.length === 0) {
    return (
      <DashboardEmptyState
        title="No classroom change alerts"
        description="When a lecture is moved, the new building, floor and sample room code will appear here."
      />
    );
  }

  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-amber-950">Classroom change alerts</h3>
        <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900">
          {alerts.length}
        </span>
      </div>
      <ul className="space-y-2">
        {alerts.map((alert) => (
          <li key={alert.id} className="rounded-lg border border-amber-200 bg-white p-3">
            <p className="text-xs font-semibold text-slate-900">
              {alert.subjectCode} · {alert.dayOfWeek} {formatClock(alert.startTime)}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-slate-700">
              <span className="font-mono">{alert.fromVenue.roomCode}</span>
              <ArrowRight className="size-3 text-amber-700" />
              <span className="font-mono font-bold">{alert.toVenue.roomCode}</span>
              <span className="text-slate-500">
                · {alert.toVenue.building}, Floor {alert.toVenue.floor === 0 ? "G" : alert.toVenue.floor}
              </span>
            </p>
            <p className="mt-1 text-[11px] text-slate-500">{alert.reason}</p>
          </li>
        ))}
      </ul>
      <Link href="/student/notifications" className="mt-3 inline-block text-xs font-semibold text-amber-800 hover:underline">
        View all notices
      </Link>
    </section>
  );
}

export function RecentlyChangedClasses({ alerts }: { alerts: ClassroomChangeAlert[] }) {
  const recent = alerts.slice(0, 3);
  if (recent.length === 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <h3 className="text-sm font-bold text-slate-900">Recently changed classes</h3>
      <ul className="mt-3 divide-y divide-slate-100">
        {recent.map((alert) => (
          <li key={alert.id} className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-semibold text-slate-900">{alert.subjectName}</p>
              <p className="text-xs text-slate-500">
                {alert.dayOfWeek} · now {alert.toVenue.roomCode}
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-blue-800">{alert.toVenue.roomCode}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
