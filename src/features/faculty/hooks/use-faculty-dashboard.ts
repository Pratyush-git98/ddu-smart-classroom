"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { facultyDashboardService } from "../services/faculty-dashboard-service";
import type { FacultyBookingDraft } from "../types";

export function useFacultyOverview() {
  return useQuery({
    queryKey: ["faculty-dashboard", "overview"],
    queryFn: () => facultyDashboardService.getOverview(),
  });
}

export function useFacultySchedule() {
  return useQuery({
    queryKey: ["faculty-dashboard", "schedule"],
    queryFn: () => facultyDashboardService.getWeeklySchedule(),
  });
}

export function useFacultyBookings(scope: "active" | "history") {
  return useQuery({
    queryKey: ["faculty-dashboard", "bookings", scope],
    queryFn: () => facultyDashboardService.getBookings(scope),
  });
}

export function useFacultyClassroomSearch(query: string) {
  return useQuery({
    queryKey: ["faculty-dashboard", "classrooms", query.trim().toLowerCase()],
    queryFn: () => facultyDashboardService.searchClassrooms(query),
  });
}

export function useFacultyProfile() {
  return useQuery({
    queryKey: ["faculty-dashboard", "profile"],
    queryFn: () => facultyDashboardService.getProfile(),
  });
}

function invalidateBookings(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ["faculty-dashboard"] });
}

export function useFacultyBookingCommands() {
  const queryClient = useQueryClient();

  const submit = useMutation({
    mutationFn: (draft: FacultyBookingDraft) => facultyDashboardService.submitBooking(draft),
    onSuccess: () => invalidateBookings(queryClient),
  });

  const update = useMutation({
    mutationFn: ({ id, draft }: { id: string; draft: FacultyBookingDraft }) =>
      facultyDashboardService.updateBooking(id, draft),
    onSuccess: () => invalidateBookings(queryClient),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => facultyDashboardService.cancelBooking(id),
    onSuccess: () => invalidateBookings(queryClient),
  });

  return { submit, update, cancel };
}
