"use client";

import { MapPin, User } from "lucide-react";
import { CampusBadge } from "@/components/common/campus-badge";
import { cn } from "@/lib/utils";
import type { StudentClassSession } from "../types";
import { formatTimeRange, resolveSessionStatus } from "../lib/class-time";
import { ClassStatusBadge, SessionTypeBadge } from "./class-status-badge";

interface TimetableClassCardProps {
  session: StudentClassSession;
  now?: Date | null;
  compact?: boolean;
  className?: string;
}

export function TimetableClassCard({
  session,
  now = null,
  compact = false,
  className,
}: TimetableClassCardProps) {
  const status = resolveSessionStatus(session, now);
  const live = status === "LIVE";

  return (
    <article
      className={cn(
        "rounded-xl border bg-white p-3.5 shadow-xs transition-colors",
        live ? "border-blue-300 ring-1 ring-blue-200 bg-blue-50/40" : "border-slate-200",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs font-bold text-blue-800">
            {formatTimeRange(session.startTime, session.endTime)}
          </p>
          <h3 className={cn("mt-0.5 font-semibold text-slate-900", compact ? "text-sm" : "text-base")}>
            <span className="font-mono text-blue-700">{session.subjectCode}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            {session.subjectName}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <SessionTypeBadge type={session.sessionType} />
          <ClassStatusBadge status={status} />
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="space-y-1 text-xs text-slate-600">
          <p className="flex items-center gap-1.5">
            <User className="size-3.5 text-slate-400" />
            {session.facultyName}
          </p>
          <p className="flex items-start gap-1.5">
            <MapPin className="size-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span>
              <span className="block font-mono text-sm font-bold text-slate-900">{session.venue.roomCode}</span>
              <span className="block text-slate-600">
                {session.venue.building} · Floor {session.venue.floor === 0 ? "G" : session.venue.floor}
              </span>
              <span className="block text-[11px] text-slate-400">{session.venue.displayName}</span>
            </span>
          </p>
        </div>
        <CampusBadge campusId={session.venue.campusId} size="sm" />
      </div>

      {session.previousVenue && (
        <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-[11px] text-amber-900">
          Moved from {session.previousVenue.roomCode} ({session.previousVenue.building})
          {session.changeNote ? ` — ${session.changeNote}` : ""}
        </p>
      )}
    </article>
  );
}
