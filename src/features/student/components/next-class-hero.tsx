"use client";

import { Clock, MapPin } from "lucide-react";
import { CampusBadge } from "@/components/common/campus-badge";
import type { StudentClassSession } from "../types";
import { formatTimeRange, getCountdownLabel, resolveSessionStatus } from "../lib/class-time";
import { ClassStatusBadge } from "./class-status-badge";
import { DashboardEmptyState } from "./query-state";

export function NextClassHero({
  session,
  now,
}: {
  session: StudentClassSession | null;
  now: Date;
}) {
  if (!session) {
    return (
      <DashboardEmptyState
        title="No more classes today"
        description="There is no remaining lecture, lab or tutorial on the sample IET timetable for the rest of today."
      />
    );
  }

  const status = resolveSessionStatus(session, now);
  const countdown = getCountdownLabel(session, now);

  return (
    <section className="overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 p-5 text-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-100">
          Next up · IET academic day
        </p>
        <ClassStatusBadge
          status={status}
          className={status === "LIVE" ? "bg-white text-blue-800 border-white" : "bg-blue-500/40 text-white border-blue-300/50"}
        />
      </div>

      <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm text-blue-100">
            <Clock className="size-4" />
            {formatTimeRange(session.startTime, session.endTime)}
          </p>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {session.subjectCode}
            <span className="mt-1 block text-lg font-semibold text-blue-50 sm:text-xl">
              {session.subjectName}
            </span>
          </h2>
          <p className="text-sm text-blue-100">{session.facultyName}</p>
          <p className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white ring-1 ring-white/20">
            {countdown}
          </p>
        </div>

        <div className="min-w-[220px] rounded-xl bg-white/10 p-4 ring-1 ring-white/15">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-100">Classroom</p>
          <p className="mt-1 font-mono text-3xl font-extrabold tracking-tight">{session.venue.roomCode}</p>
          <p className="mt-2 flex items-start gap-1.5 text-sm text-blue-50">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            <span>
              {session.venue.building}
              <span className="mt-0.5 block text-xs text-blue-100">
                Floor {session.venue.floor === 0 ? "G" : session.venue.floor} · {session.venue.wing}
              </span>
            </span>
          </p>
          <div className="mt-3">
            <CampusBadge campusId={session.venue.campusId} size="sm" className="bg-white/90" />
          </div>
        </div>
      </div>
    </section>
  );
}
