"use client";

import { useMemo, useState } from "react";
import type { DayOfWeek } from "@/types";
import { useFacultySchedule } from "../hooks/use-faculty-dashboard";
import { ACADEMIC_DAYS, getAcademicDayOfWeek } from "../lib/faculty-time";
import { MOCK_FACULTY_DISCLAIMER } from "../services/mock/mock-faculty-dashboard";
import { LectureCard } from "./lecture-card";
import { StaleDataHint } from "@/components/query/stale-data-hint";
import { FacultyEmptyState, FacultyErrorState, FacultyLoadingState } from "./query-state";
import { cn } from "@/lib/utils";

export function FacultySchedulePage() {
  const schedule = useFacultySchedule();
  const today = getAcademicDayOfWeek();
  const [day, setDay] = useState<DayOfWeek | "ALL">(today ?? "ALL");

  const grouped = useMemo(() => {
    const lectures = schedule.data ?? [];
    return ACADEMIC_DAYS.map((item) => ({
      day: item,
      lectures: lectures.filter((lecture) => lecture.dayOfWeek === item),
    }));
  }, [schedule.data]);

  if (schedule.isPending) return <FacultyLoadingState label="Loading weekly teaching grid..." />;
  if (schedule.isError) {
    return (
      <FacultyErrorState
        message="The faculty schedule service is unavailable."
        onRetry={() => void schedule.refetch()}
      />
    );
  }

  const visible = grouped.filter((group) => day === "ALL" || group.day === day);

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">My schedule</h2>
        <p className="mt-1 text-sm text-slate-600">
          Sample week for CSE 5th semester. Filter by day on smaller screens.
        </p>
        <p className="mt-1 text-[11px] text-slate-400">{MOCK_FACULTY_DISCLAIMER}</p>
      </div>

      <StaleDataHint
        hasData={Boolean(schedule.data)}
        isFetching={schedule.isFetching}
        isStale={schedule.isStale}
        dataUpdatedAt={schedule.dataUpdatedAt}
      />

      <div className="-mx-1 flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Filter schedule by day">
        {(["ALL", ...ACADEMIC_DAYS] as const).map((item) => {
          const selected = day === item;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setDay(item)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold",
                selected
                  ? "border-indigo-700 bg-indigo-700 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
              )}
            >
              {item === "ALL" ? "Week" : item.slice(0, 3)}
            </button>
          );
        })}
      </div>

      <div className="hidden gap-3 lg:grid lg:grid-cols-6" aria-hidden={day !== "ALL"}>
        {day === "ALL" &&
          grouped.map((group) => (
            <section key={group.day} className="rounded-xl border border-slate-200 bg-white p-2.5">
              <h3 className="mb-2 text-xs font-bold text-slate-900">{group.day.slice(0, 3)}</h3>
              <div className="space-y-2">
                {group.lectures.length === 0 && <p className="text-[11px] text-slate-400">No classes</p>}
                {group.lectures.map((lecture) => (
                  <div key={lecture.id} className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                    <p className="font-mono text-[10px] font-bold text-indigo-800">{lecture.startTime}</p>
                    <p className="text-[11px] font-semibold text-slate-900">{lecture.subjectCode}</p>
                    <p className="font-mono text-[10px] text-slate-600">{lecture.venue.roomCode}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
      </div>

      <div className="space-y-6">
        {visible.map((group) => (
          <section key={group.day} className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">{group.day}</h3>
            {group.lectures.length === 0 ? (
              <FacultyEmptyState
                title={`No teaching on ${group.day}`}
                description="This sample grid has no lecture, lab or tutorial for that day."
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {group.lectures.map((lecture) => (
                  <LectureCard key={lecture.id} lecture={lecture} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
