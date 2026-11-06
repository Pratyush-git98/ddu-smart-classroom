"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { getBookingService } from "@/features/bookings/services/booking-client";
import type { BookingActor } from "@/features/bookings/services/booking-service.interface";
import { invalidateAfterBookingMutation } from "@/lib/invalidate-queries";
import { QUERY_CACHE } from "@/lib/query-cache-policy";
import { queryKeys } from "@/lib/query-keys";
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
    queryKey: [...queryKeys.dashboards.faculty, "overview", actor?.id],
    queryFn: () => facultyDashboardService.getOverview(actor!),
    enabled: Boolean(actor),
  });
}

export function useFacultySchedule() {
  const actor = useBookingActor();
  return useQuery({
    queryKey: queryKeys.timetable.faculty(actor?.id),
    queryFn: () => facultyDashboardService.getWeeklySchedule(),
    staleTime: QUERY_CACHE.timetable.staleTimeMs,
    gcTime: QUERY_CACHE.timetable.gcTimeMs,
    enabled: Boolean(actor),
  });
}

export function useFacultyBookings(scope: "active" | "history") {
  const actor = useBookingActor();
  return useQuery({
    queryKey: queryKeys.bookings.list(scope, actor?.id),
    queryFn: () => facultyDashboardService.getBookings(scope, actor!),
    enabled: Boolean(actor),
    staleTime: QUERY_CACHE.bookings.staleTimeMs,
    gcTime: QUERY_CACHE.bookings.gcTimeMs,
  });
}

export function useFacultyBooking(id: string | undefined) {
  const actor = useBookingActor();
  return useQuery({
    queryKey: queryKeys.bookings.detail(id ?? "", actor?.id),
    queryFn: () => getBookingService().getBookingById(id!, actor!),
    enabled: Boolean(actor && id),
    staleTime: QUERY_CACHE.bookings.staleTimeMs,
    gcTime: QUERY_CACHE.bookings.gcTimeMs,
  });
}

export function useFacultyClassroomSearch(query: string) {
  const normalized = query.trim().toLowerCase();
  return useQuery({
    queryKey: queryKeys.classrooms.locator("faculty", normalized),
    queryFn: () => facultyDashboardService.searchClassrooms(query),
    staleTime: QUERY_CACHE.classroomMetadata.staleTimeMs,
    gcTime: QUERY_CACHE.classroomMetadata.gcTimeMs,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });
}

export function useFacultyProfile() {
  const actor = useBookingActor();
  return useQuery({
    queryKey: queryKeys.profiles.faculty(actor?.id),
    queryFn: () => facultyDashboardService.getProfile(),
    staleTime: QUERY_CACHE.profiles.staleTimeMs,
    gcTime: QUERY_CACHE.profiles.gcTimeMs,
    enabled: Boolean(actor),
    refetchOnWindowFocus: false,
  });
}

export function useFacultyBookingCommands() {
  const queryClient = useQueryClient();
  const actor = useBookingActor();

  const submit = useMutation({
    mutationFn: (draft: FacultyBookingDraft) => {
      if (!actor) return Promise.reject(new Error("Sign in is required."));
      return getBookingService().createBooking(draft, actor);
    },
    retry: 0,
    onSuccess: async (result) => {
      if (result.success) {
        await invalidateAfterBookingMutation(queryClient);
      }
    },
  });

  const update = useMutation({
    mutationFn: ({ id, draft }: { id: string; draft: FacultyBookingDraft }) => {
      if (!actor) return Promise.reject(new Error("Sign in is required."));
      return getBookingService().updateBooking(id, draft, actor);
    },
    retry: 0,
    onSuccess: async (result) => {
      if (result.success) {
        await invalidateAfterBookingMutation(queryClient);
      }
    },
  });

  const cancel = useMutation({
    mutationFn: (id: string) => {
      if (!actor) return Promise.reject(new Error("Sign in is required."));
      return getBookingService().cancelBooking(id, actor);
    },
    retry: 0,
    onSuccess: async (result) => {
      if (result.success) {
        await invalidateAfterBookingMutation(queryClient);
      }
    },
  });

  return { submit, update, cancel, actor };
}
