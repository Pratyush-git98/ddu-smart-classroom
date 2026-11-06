"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { DayOfWeek } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { QUERY_CACHE } from "@/lib/query-cache-policy";
import { queryKeys } from "@/lib/query-keys";
import { studentDashboardService } from "../services/student-dashboard-service";

export function useStudentOverview() {
  const { user } = useAuth();
  return useQuery({
    queryKey: [...queryKeys.dashboards.student, "overview", user?.id],
    queryFn: () => studentDashboardService.getOverview(),
    enabled: Boolean(user),
  });
}

export function useStudentTimetable(day: DayOfWeek | "ALL" = "ALL") {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.timetable.student(user?.id),
    queryFn: () => studentDashboardService.getWeeklyTimetable("ALL"),
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
    queryFn: () => studentDashboardService.searchClassrooms(query),
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
    queryFn: () => studentDashboardService.getAcademicContext(),
    staleTime: QUERY_CACHE.profiles.staleTimeMs,
    gcTime: QUERY_CACHE.profiles.gcTimeMs,
    enabled: Boolean(user),
    refetchOnWindowFocus: false,
  });
}

export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
