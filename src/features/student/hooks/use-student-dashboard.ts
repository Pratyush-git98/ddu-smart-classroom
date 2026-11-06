"use client";

import { useCallback, useSyncExternalStore } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DayOfWeek } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { QUERY_CACHE } from "@/lib/query-cache-policy";
import { queryKeys } from "@/lib/query-keys";
import { getStudentDashboardService } from "../services/student-dashboard-client";

export function useStudentOverview() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...queryKeys.dashboards.student, "overview", user?.id],
    queryFn: () => getStudentDashboardService().getOverview(),
    enabled: Boolean(user),
  });
}

export function useStudentTimetable(day: DayOfWeek | "ALL" = "ALL") {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.timetable.student(user?.id),
    queryFn: () => getStudentDashboardService().getWeeklyTimetable("ALL"),
    select: (sessions) => (day === "ALL" ? sessions : sessions.filter((item) => item.dayOfWeek === day)),
    staleTime: QUERY_CACHE.timetable.staleTimeMs,
    gcTime: QUERY_CACHE.timetable.gcTimeMs,
    enabled: Boolean(user),
  });
}

export function useStudentClassroomSearch(query: string) {
  const normalized = query.trim().toLowerCase();
  return useQuery({
    queryKey: queryKeys.classrooms.locator("student", normalized),
    queryFn: () => getStudentDashboardService().searchClassrooms(query),
    staleTime: QUERY_CACHE.classroomMetadata.staleTimeMs,
    gcTime: QUERY_CACHE.classroomMetadata.gcTimeMs,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

export function useStudentAcademicContext() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.profiles.student(user?.id),
    queryFn: () => getStudentDashboardService().getAcademicContext(),
    staleTime: QUERY_CACHE.profiles.staleTimeMs,
    gcTime: QUERY_CACHE.profiles.gcTimeMs,
    enabled: Boolean(user),
    refetchOnWindowFocus: false,
  });
}

const clockTicks = new Map<number, number>();

export function useNow(intervalMs = 30_000) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const id = window.setInterval(() => {
        clockTicks.set(intervalMs, Date.now());
        onStoreChange();
      }, intervalMs);
      queueMicrotask(() => {
        clockTicks.set(intervalMs, Date.now());
        onStoreChange();
      });
      return () => window.clearInterval(id);
    },
    [intervalMs]
  );

  const tick = useSyncExternalStore(
    subscribe,
    () => clockTicks.get(intervalMs) ?? 0,
    () => 0
  );

  return tick === 0 ? null : new Date(tick);
}
