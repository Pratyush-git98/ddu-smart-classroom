"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { adminDashboardService } from "../services/admin-dashboard-service";
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

function invalidateAdmin(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
}

export function useAdminOverview() {
  return useQuery({
    queryKey: ["admin-dashboard", "overview"],
    queryFn: () => adminDashboardService.getOverview(),
  });
}

export function useAdminClassrooms(query: AdminClassroomQuery) {
  return useQuery({
    queryKey: ["admin-dashboard", "classrooms", query],
    queryFn: () => adminDashboardService.listClassrooms(query),
  });
}

export function useAdminBuildings() {
  return useQuery({
    queryKey: ["admin-dashboard", "buildings"],
    queryFn: () => adminDashboardService.listBuildings(),
  });
}

export function useAdminUsers(query: AdminUserQuery) {
  return useQuery({
    queryKey: ["admin-dashboard", "users", query],
    queryFn: () => adminDashboardService.listUsers(query),
  });
}

export function useAdminApprovals(query: AdminBookingQuery) {
  return useQuery({
    queryKey: ["admin-dashboard", "approvals", query],
    queryFn: () => adminDashboardService.listApprovals(query),
  });
}

export function useAdminTimetable() {
  return useQuery({
    queryKey: ["admin-dashboard", "timetable"],
    queryFn: () => adminDashboardService.listTimetable(),
  });
}

export function useAdminIssues(query: AdminIssueQuery) {
  return useQuery({
    queryKey: ["admin-dashboard", "issues", query],
    queryFn: () => adminDashboardService.listIssues(query),
  });
}

export function useAdminNotifications() {
  return useQuery({
    queryKey: ["admin-dashboard", "notifications"],
    queryFn: () => adminDashboardService.listNotifications(),
  });
}

export function useAdminAuditLogs(query: AdminAuditQuery) {
  return useQuery({
    queryKey: ["admin-dashboard", "audit", query],
    queryFn: () => adminDashboardService.listAuditLogs(query),
  });
}

export function useAdminReports() {
  return useQuery({
    queryKey: ["admin-dashboard", "reports"],
    queryFn: () => adminDashboardService.getReports(),
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
      adminDashboardService.createClassroom(draft, await requireActor()),
    onSuccess: () => invalidateAdmin(queryClient),
  });

  const updateClassroom = useMutation({
    mutationFn: async ({ id, draft }: { id: string; draft: AdminClassroomDraft }) =>
      adminDashboardService.updateClassroom(id, draft, await requireActor()),
    onSuccess: () => invalidateAdmin(queryClient),
  });

  const deleteClassroom = useMutation({
    mutationFn: async (id: string) => adminDashboardService.deleteClassroom(id, await requireActor()),
    onSuccess: () => invalidateAdmin(queryClient),
  });

  const setUserActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminDashboardService.setUserActive(id, isActive, await requireActor()),
    onSuccess: () => invalidateAdmin(queryClient),
  });

  const approveBooking = useMutation({
    mutationFn: async (id: string) => adminDashboardService.approveBooking(id, await requireActor()),
    onSuccess: () => invalidateAdmin(queryClient),
  });

  const rejectBooking = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) =>
      adminDashboardService.rejectBooking(id, reason, await requireActor()),
    onSuccess: () => invalidateAdmin(queryClient),
  });

  const updateIssueStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: IssueStatus }) =>
      adminDashboardService.updateIssueStatus(id, status, await requireActor()),
    onSuccess: () => invalidateAdmin(queryClient),
  });

  const markNotificationRead = useMutation({
    mutationFn: (id: string) => adminDashboardService.markNotificationRead(id),
    onSuccess: () => invalidateAdmin(queryClient),
  });

  const markAllNotificationsRead = useMutation({
    mutationFn: () => adminDashboardService.markAllNotificationsRead(),
    onSuccess: () => invalidateAdmin(queryClient),
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
  };
}
