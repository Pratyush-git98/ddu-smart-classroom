"use client";

import Link from "next/link";
import {
  Building2,
  CalendarCheck,
  ClipboardList,
  DoorOpen,
  Hourglass,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { isAdminUser } from "@/types";
import { CampusBadge } from "@/components/common/campus-badge";
import { BookingStatusBadge } from "@/components/common/status-badge";
import { MOCK_ADMIN_DISCLAIMER } from "../services/mock/mock-admin-data";
import { useAdminOverview } from "../hooks/use-admin-dashboard";
import { BookingTrendsChart, UtilizationChart } from "./admin-charts";
import { AdminErrorState, AdminLoadingState } from "./query-state";

export function AdminOverview() {
  const { user } = useAuth();
  const overview = useAdminOverview();
  const profile = user && isAdminUser(user) ? user.profile : null;

  if (overview.isPending) return <AdminLoadingState label="Loading campus operations overview..." />;
  if (overview.isError || !overview.data) {
    return (
      <AdminErrorState
        message="Campus utilization and approval queues could not be loaded."
        onRetry={() => void overview.refetch()}
      />
    );
  }

  const { stats, utilization, bookingTrends, pendingApprovals, openIssues, recentAudit } = overview.data;

  return (
    <div className="space-y-6 pb-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Dean Academics console</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Welcome, {user?.displayName ?? "Administrator"}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {(profile?.designation ?? "Academic administrator")} · {profile?.office ?? "Central academic office"}
        </p>
        <p className="mt-3 text-[11px] text-slate-400">{MOCK_ADMIN_DISCLAIMER}</p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label="Total classrooms" value={stats.totalClassrooms} icon={Building2} href="/admin/classrooms" />
        <Stat label="Occupied rooms" value={stats.occupiedRooms} icon={CalendarCheck} href="/admin/classrooms" />
        <Stat label="Available rooms" value={stats.availableRooms} icon={DoorOpen} href="/admin/classrooms" />
        <Stat label="Pending approvals" value={stats.pendingApprovals} icon={Hourglass} href="/admin/approvals" />
        <Stat label="Total bookings" value={stats.totalBookings} icon={ClipboardList} href="/admin/approvals" />
        <Stat label="Unresolved issues" value={stats.unresolvedIssues} icon={ShieldAlert} href="/admin/issues" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <UtilizationChart points={utilization} />
        <BookingTrendsChart points={bookingTrends} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Pending approvals</h3>
            <Link href="/admin/approvals" className="text-xs font-semibold text-violet-700 hover:underline">
              Review queue
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {pendingApprovals.length === 0 && (
              <li className="text-xs text-slate-500">No requisitions waiting on Dean Academics.</li>
            )}
            {pendingApprovals.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <BookingStatusBadge status={item.status} />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {item.facultyName} · {item.venue.roomCode} · {item.date} {item.startTime}–{item.endTime}
                </p>
                {item.conflictMessage && (
                  <p className="mt-1 text-[11px] font-medium text-orange-700">{item.conflictMessage}</p>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Open facility issues</h3>
            <Link href="/admin/issues" className="text-xs font-semibold text-violet-700 hover:underline">
              Manage issues
            </Link>
          </div>
          <ul className="mt-3 space-y-2">
            {openIssues.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-100 bg-slate-50/80 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <CampusBadge campusId={item.campusId} size="sm" />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {item.roomNumber} · {item.severity} · {item.status.replace(/_/g, " ")}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent audit activity</h3>
          <Link href="/admin/audit-logs" className="text-xs font-semibold text-violet-700 hover:underline">
            Full log
          </Link>
        </div>
        <ul className="mt-3 divide-y divide-slate-100">
          {recentAudit.map((item) => (
            <li key={item.id} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {item.actorName} · {item.action}
                </p>
                <p className="text-xs text-slate-500">{item.changeSummary}</p>
              </div>
              <p className="shrink-0 text-[11px] text-slate-400">{item.entityType}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: number;
  icon: typeof Building2;
  href: string;
}) {
  return (
    <Link href={href} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-violet-200 hover:shadow-sm">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="size-4 text-violet-600" />
        <p className="text-[11px] font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </Link>
  );
}
