"use client";

import Link from "next/link";
import type { StudentClassSession } from "../types";
import { getAcademicDayOfWeek } from "../lib/class-time";
import { TimetableClassCard } from "./timetable-class-card";
import { DashboardEmptyState } from "./query-state";

export function TodayClassesList({
  sessions,
  now,
}: {
  sessions: StudentClassSession[];
  now: Date;
}) {
  const academicDay = getAcademicDayOfWeek(now);

  if (!academicDay) {
    return (
      <DashboardEmptyState
        title="No IET teaching periods today"
        description="Sunday is outside the sample Monday–Saturday academic grid. Check My Timetable for the coming week."
        action={
          <Link href="/student/timetable" className="text-xs font-semibold text-blue-700 hover:underline">
            Browse weekly timetable
          </Link>
        }
      />
    );
  }

  if (sessions.length === 0) {
    return (
      <DashboardEmptyState
        title={`No classes listed for ${academicDay}`}
        description="This sample section timetable has no lecture or lab periods for today."
      />
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Today&apos;s classes · {academicDay}</h3>
        <p className="text-xs text-slate-500">{sessions.length} periods</p>
      </div>
      <div className="grid gap-3">
        {sessions.map((session) => (
          <TimetableClassCard key={session.id} session={session} now={now} />
        ))}
      </div>
    </section>
  );
}
