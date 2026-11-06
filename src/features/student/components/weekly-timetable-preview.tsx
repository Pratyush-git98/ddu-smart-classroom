"use client";

import Link from "next/link";
import type { DayOfWeek } from "@/types";
import { ACADEMIC_DAYS, formatClock } from "../lib/class-time";
import type { StudentClassSession } from "../types";

export function WeeklyTimetablePreview({ sessions }: { sessions: StudentClassSession[] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Weekly timetable preview</h3>
          <p className="text-xs text-slate-500">Tap a day for the full grid. Room codes are sample locators.</p>
        </div>
        <Link href="/student/timetable" className="text-xs font-semibold text-blue-700 hover:underline">
          Open timetable
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {ACADEMIC_DAYS.map((day) => {
          const daySessions = sessions.filter((item) => item.dayOfWeek === day);
          return (
            <Link
              key={day}
              href={`/student/timetable?day=${day}`}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 hover:border-blue-300 hover:bg-white"
            >
              <p className="text-xs font-bold text-slate-900">{day.slice(0, 3)}</p>
              <p className="text-[11px] text-slate-500">{daySessions.length} classes</p>
              <ul className="mt-2 space-y-1">
                {daySessions.slice(0, 3).map((item) => (
                  <li key={item.id} className="truncate text-[10px] text-slate-600">
                    <span className="font-mono text-blue-700">{formatClock(item.startTime)}</span>{" "}
                    {item.subjectCode}
                  </li>
                ))}
                {daySessions.length === 0 && <li className="text-[10px] text-slate-400">No classes</li>}
              </ul>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function dayCounts(sessions: StudentClassSession[]): Partial<Record<DayOfWeek | "ALL", number>> {
  const counts: Partial<Record<DayOfWeek | "ALL", number>> = { ALL: sessions.length };
  for (const day of ACADEMIC_DAYS) {
    counts[day] = sessions.filter((item) => item.dayOfWeek === day).length;
  }
  return counts;
}
