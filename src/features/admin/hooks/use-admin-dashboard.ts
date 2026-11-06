"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import {
  invalidateAfterBookingMutation,
  invalidateAfterClassroomMutation,
  invalidateAfterTimetableChange,
  invalidateNotificationViews,
} from "@/lib/invalidate-queries";
import { QUERY_CACHE } from "@/lib/query-cache-policy";
import { queryKeys } from "@/lib/query-keys";
import { getAdminDashboardService } from "../services/admin-dashboard-client";
import type {
  AdminActor,
  AdminAuditQuery,
  AdminBookingQuery,
  AdminClassroomDraft,
  AdminClassroomQuery,
  AdminIssueQuery,
  AdminUserQuery,
  IssueStatus,
} from "../types";

function useAdminActor(): AdminActor | null {
  const { user } = useAuth();
  if (!user) return null;
  return { id: user.id, displayName: user.displayName, role: user.role };
}

export function useAdminOverview() {
  return useQuery({
    queryKey: [...queryKeys.dashboards.admin, "overview"],
    queryFn: () => getAdminDashboardService().getOverview(),
  });
}

export function useAdminClassrooms(query: AdminClassroomQuery) {
  return useQuery({
    queryKey: [...queryKeys.dashboards.admin, "classrooms", JSON.stringify(query)],
    queryFn: () => getAdminDashboardService().listClassrooms(query),
    staleTime: QUERY_CACHE.classroomMetadata.staleTimeMs,
    gcTime: QUERY_CACHE.classroomMetadata.gcTimeMs,
    placeholderData: keepPreviousData,
  });
}

export function useAdminBuildings() {
  return useQuery({
    queryKey: [...queryKeys.dashboards.admin, "buildings"],
    queryFn: () => getAdminDashboardService().listBuildings(),
    staleTime: QUERY_CACHE.classroomMetadata.staleTimeMs,
    gcTime: QUERY_CACHE.classroomMetadata.gcTimeMs,
    refetchOnWindowFocus: false,
  });
}

export function useAdminUsers(query: AdminUserQuery) {
  return useQuery({
    queryKey: [...queryKeys.dashboards.admin, "users", JSON.stringify(query)],
    queryFn: () => getAdminDashboardService().listUsers(query),
    staleTime: QUERY_CACHE.profiles.staleTimeMs,
    placeholderData: keepPreviousData,
  });
}

export function useAdminApprovals(query: AdminBookingQuery) {
  return useQuery({
    queryKey: queryKeys.bookings.adminApprovals(JSON.stringify(query)),
    queryFn: () => getAdminDashboardService().listApprovals(query),
    staleTime: QUERY_CACHE.bookings.staleTimeMs,
    placeholderData: keepPreviousData,
  });
}

export function useAdminTimetable() {
  return useQuery({
    queryKey: queryKeys.timetable.admin(),
    queryFn: () => getAdminDashboardService().listTimetable(),
    staleTime: QUERY_CACHE.timetable.staleTimeMs,
    gcTime: QUERY_CACHE.timetable.gcTimeMs,
  });
}

export function useAdminIssues(query: AdminIssueQuery) {
  return useQuery({
    queryKey: [...queryKeys.dashboards.admin, "issues", JSON.stringify(query)],
    queryFn: () => getAdminDashboardService().listIssues(query),
    placeholderData: keepPreviousData,
  });
}

export function useAdminNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.admin(),
    queryFn: () => getAdminDashboardService().listNotifications(),
    staleTime: QUERY_CACHE.notifications.staleTimeMs,
  });
}

export function useAdminAuditLogs(query: AdminAuditQuery) {
  return useQuery({
    queryKey: [...queryKeys.dashboards.admin, "audit", JSON.stringify(query)],
    queryFn: () => getAdminDashboardService().listAuditLogs(query),
    placeholderData: keepPreviousData,
  });
}

export function useAdminReports() {
  return useQuery({
    queryKey: [...queryKeys.dashboards.admin, "reports"],
    queryFn: () => getAdminDashboardService().getReports(),
  });
}

export function useAdminCommands() {
  const queryClient = useQueryClient();
  const actor = useAdminActor();

  const requireActor = () => {
    if (!actor) return Promise.reject(new Error("Sign in is required."));
    return actor;
  };

  const createClassroom = useMutation({
    mutationFn: async (draft: AdminClassroomDraft) =>
      getAdminDashboardService().createClassroom(draft, await requireActor()),
    onSuccess: () => invalidateAfterClassroomMutation(queryClient),
  });

  const updateClassroom = useMutation({
    mutationFn: async ({ id, draft }: { id: string; draft: AdminClassroomDraft }) =>
      getAdminDashboardService().updateClassroom(id, draft, await requireActor()),
    onSuccess: () => invalidateAfterClassroomMutation(queryClient),
  });

  const deleteClassroom = useMutation({
    mutationFn: async (id: string) => getAdminDashboardService().deleteClassroom(id, await requireActor()),
    onSuccess: () => invalidateAfterClassroomMutation(queryClient),
  });

  const setUserActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
      getAdminDashboardService().setUserActive(id, isActive, await requireActor()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.admin }),
  });

  const approveBooking = useMutation({
    mutationFn: async (id: string) => getAdminDashboardService().approveBooking(id, await requireActor()),
    retry: 0,
    onSuccess: () => invalidateAfterBookingMutation(queryClient),
  });

  const rejectBooking = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) =>
      getAdminDashboardService().rejectBooking(id, reason, await requireActor()),
    retry: 0,
    onSuccess: () => invalidateAfterBookingMutation(queryClient),
  });

  const updateIssueStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: IssueStatus }) =>
      getAdminDashboardService().updateIssueStatus(id, status, await requireActor()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.admin }),
  });

  const markNotificationRead = useMutation({
    mutationFn: (id: string) => getAdminDashboardService().markNotificationRead(id),
    onSuccess: () => invalidateNotificationViews(queryClient),
  });

  const markAllNotificationsRead = useMutation({
    mutationFn: () => getAdminDashboardService().markAllNotificationsRead(),
    onSuccess: () => invalidateNotificationViews(queryClient),
  });

  const refreshTimetable = useMutation({
    mutationFn: async () => getAdminDashboardService().listTimetable(),
    onSuccess: () => invalidateAfterTimetableChange(queryClient),
  });

  return {
    actor,
    createClassroom,
    updateClassroom,
    deleteClassroom,
    setUserActive,
    approveBooking,
    rejectBooking,
    updateIssueStatus,
    markNotificationRead,
    markAllNotificationsRead,
    refreshTimetable,
  };
}
