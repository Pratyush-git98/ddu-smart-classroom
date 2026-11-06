"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { getBookingService } from "@/features/bookings/services/booking-client";
import type { BookingActor } from "@/features/bookings/services/booking-service.interface";
import { facultyDashboardService } from "../services/faculty-dashboard-service";
import type { FacultyBookingDraft } from "../types";

function useBookingActor(): BookingActor | null {
  const { user } = useAuth();
  if (!user) return null;
  return { id: user.id, role: user.role, displayName: user.displayName };
}

export function useFacultyOverview() {
  const actor = useBookingActor();
  return useQuery({
    queryKey: ["faculty-dashboard", "overview", actor?.id],
    queryFn: () => facultyDashboardService.getOverview(actor!),
    enabled: Boolean(actor),
  });
}

export function useFacultySchedule() {
  return useQuery({
    queryKey: ["faculty-dashboard", "schedule"],
    queryFn: () => facultyDashboardService.getWeeklySchedule(),
  });
}

export function useFacultyBookings(scope: "active" | "history") {
  const actor = useBookingActor();
  return useQuery({
    queryKey: ["faculty-dashboard", "bookings", scope, actor?.id],
    queryFn: () => facultyDashboardService.getBookings(scope, actor!),
    enabled: Boolean(actor),
  });
}

export function useFacultyBooking(id: string | undefined) {
  const actor = useBookingActor();
  return useQuery({
    queryKey: ["faculty-dashboard", "booking", id, actor?.id],
    queryFn: () => getBookingService().getBookingById(id!, actor!),
    enabled: Boolean(actor && id),
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
  void queryClient.invalidateQueries({ queryKey: ["classrooms"] });
}

export function useFacultyBookingCommands() {
  const queryClient = useQueryClient();
  const actor = useBookingActor();

  const submit = useMutation({
    mutationFn: (draft: FacultyBookingDraft) => {
      if (!actor) return Promise.reject(new Error("Sign in is required."));
      return getBookingService().createBooking(draft, actor);
    },
    onSuccess: () => invalidateBookings(queryClient),
  });

  const update = useMutation({
    mutationFn: ({ id, draft }: { id: string; draft: FacultyBookingDraft }) => {
      if (!actor) return Promise.reject(new Error("Sign in is required."));
      return getBookingService().updateBooking(id, draft, actor);
    },
    onSuccess: () => invalidateBookings(queryClient),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => {
      if (!actor) return Promise.reject(new Error("Sign in is required."));
      return getBookingService().cancelBooking(id, actor);
    },
    onSuccess: () => invalidateBookings(queryClient),
  });

  return { submit, update, cancel, actor };
}
