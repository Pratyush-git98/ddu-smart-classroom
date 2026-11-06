"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { DayOfWeek } from "@/types";
import { ACADEMIC_DAYS, getAcademicDayOfWeek } from "../lib/class-time";
import { useNow, useStudentTimetable } from "../hooks/use-student-dashboard";
import { dayCounts } from "./weekly-timetable-preview";
import { DayFilter } from "./day-filter";
import { TimetableClassCard } from "./timetable-class-card";
import { DashboardEmptyState, DashboardErrorState, DashboardLoadingState } from "./query-state";
import { MOCK_DATA_DISCLAIMER } from "../services/mock/mock-student-dashboard";

function isDay(value: string | null): value is DayOfWeek {
  return ACADEMIC_DAYS.includes(value as DayOfWeek);
}

export function StudentTimetablePage() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("day");
  const [day, setDay] = useState<DayOfWeek | "ALL">(isDay(initial) ? initial : "ALL");
  const timetable = useStudentTimetable("ALL");
  const now = useNow(30_000);

  const filtered = useMemo(() => {
    const sessions = timetable.data ?? [];
    if (day === "ALL") return sessions;
    return sessions.filter((item) => item.dayOfWeek === day);
  }, [day, timetable.data]);

  const counts = dayCounts(timetable.data ?? []);
  const today = getAcademicDayOfWeek(now);

  if (timetable.isPending) {
    return <DashboardLoadingState label="Loading weekly timetable..." />;
  }

  if (timetable.isError) {
    return (
      <DashboardErrorState
        message="The timetable service is unavailable. Retry to reload the sample IET week grid."
        onRetry={() => void timetable.refetch()}
      />
    );
  }

  const grouped = ACADEMIC_DAYS.filter((item) => day === "ALL" || day === item).map((item) => ({
    day: item,
    sessions: filtered.filter((session) => session.dayOfWeek === item),
  }));

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">My timetable</h2>
        <p className="mt-1 text-sm text-slate-600">
          B.Tech CSE · Semester 5 · Section A. Filter by day on mobile with the chips below.
        </p>
        <p className="mt-1 text-[11px] text-slate-400">{MOCK_DATA_DISCLAIMER}</p>
      </div>

      <DayFilter value={day} onChange={setDay} counts={counts} />

      {today && (
        <p className="text-xs text-slate-500">
          Today is <span className="font-semibold text-slate-800">{today}</span> on the academic calendar.
        </p>
      )}

      {filtered.length === 0 ? (
        <DashboardEmptyState
          title={day === "ALL" ? "No periods on this sample timetable" : `No classes on ${day}`}
          description="There are no lecture, lab or tutorial slots for the selected day in this preview grid."
        />
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <section key={group.day} className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">{group.day}</h3>
              {group.sessions.length === 0 ? (
                <p className="text-xs text-slate-500">No classes.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {group.sessions.map((session) => (
                    <TimetableClassCard key={session.id} session={session} now={now} />
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
