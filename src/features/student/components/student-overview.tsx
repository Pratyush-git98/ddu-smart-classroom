"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useStudentOverview, useNow } from "../hooks/use-student-dashboard";
import { getNextUpcomingSession, getTodaySessions } from "../lib/class-time";
import { StudentWelcomeCard } from "./student-welcome-card";
import { NextClassHero } from "./next-class-hero";
import { TodayClassesList } from "./today-classes-list";
import { WeeklyTimetablePreview } from "./weekly-timetable-preview";
import { ClassroomChangeAlerts, RecentlyChangedClasses } from "./classroom-change-alerts";
import { DashboardErrorState, DashboardLoadingState } from "./query-state";

export function StudentOverview() {
  const overview = useStudentOverview();
  const now = useNow(15_000);

  if (overview.isPending) {
    return <DashboardLoadingState label="Loading today's IET classes..." />;
  }

  if (overview.isError || !overview.data) {
    return (
      <DashboardErrorState
        message="The student timetable service could not be reached. Retry to reload sample academic data."
        onRetry={() => void overview.refetch()}
      />
    );
  }

  const { academic, weekSessions, changeAlerts, unreadNotificationCount } = overview.data;
  const today = getTodaySessions(weekSessions);
  const next = getNextUpcomingSession(weekSessions, now);

  return (
    <div className="space-y-6 pb-8">
      <StudentWelcomeCard academic={academic} />

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
        <p className="font-medium text-slate-700">
          You have <span className="font-bold text-slate-900">{unreadNotificationCount}</span>{" "}
          unread {unreadNotificationCount === 1 ? "notice" : "notices"}
        </p>
        <Link
          href="/student/notifications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline"
        >
          <Bell className="size-3.5" />
          Open notifications
        </Link>
      </div>

      <NextClassHero session={next} now={now} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <TodayClassesList sessions={today} now={now} />
        <div className="space-y-4">
          <ClassroomChangeAlerts alerts={changeAlerts} />
          <RecentlyChangedClasses alerts={changeAlerts} />
        </div>
      </div>

      <WeeklyTimetablePreview sessions={weekSessions} />
    </div>
  );
}
