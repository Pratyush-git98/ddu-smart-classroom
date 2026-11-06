"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { DayOfWeek } from "@/types";
import { studentDashboardService } from "../services/student-dashboard-service";

export function useStudentOverview() {
  return useQuery({
    queryKey: ["student-dashboard", "overview"],
    queryFn: () => studentDashboardService.getOverview(),
  });
}

export function useStudentTimetable(day: DayOfWeek | "ALL") {
  return useQuery({
    queryKey: ["student-dashboard", "timetable", day],
    queryFn: () => studentDashboardService.getWeeklyTimetable(day),
  });
}

export function useStudentClassroomSearch(query: string) {
  return useQuery({
    queryKey: ["student-dashboard", "classrooms", query.trim().toLowerCase()],
    queryFn: () => studentDashboardService.searchClassrooms(query),
  });
}

export function useStudentAcademicContext() {
  return useQuery({
    queryKey: ["student-dashboard", "academic"],
    queryFn: () => studentDashboardService.getAcademicContext(),
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
