import type { Classroom } from "@/types";
import type { FacultyBooking } from "@/features/faculty/types";
import type {
  AdminActor,
  AdminAuditEntry,
  AdminAuditQuery,
  AdminBookingQuery,
  AdminClassroomDraft,
  AdminClassroomQuery,
  AdminCommandResult,
  AdminIssueQuery,
  AdminManagedUser,
  AdminNotificationItem,
  AdminOverviewData,
  AdminReportSummary,
  AdminTimetableSlot,
  AdminUserQuery,
  ClassroomIssue,
  IssueStatus,
  PaginatedResult,
} from "../types";

/**
 * Admin operations port.
 *
 * Mutations here are UX simulations until campus IAM and academic APIs are
 * wired. Production MUST authorize every command on the server.
 */
export interface AdminDashboardService {
  getOverview(): Promise<AdminOverviewData>;
  listClassrooms(query: AdminClassroomQuery): Promise<PaginatedResult<Classroom>>;
  listBuildings(): Promise<string[]>;
  getClassroom(id: string): Promise<Classroom | null>;
  createClassroom(draft: AdminClassroomDraft, actor: AdminActor): Promise<AdminCommandResult<Classroom>>;
  updateClassroom(id: string, draft: AdminClassroomDraft, actor: AdminActor): Promise<AdminCommandResult<Classroom>>;
  deleteClassroom(id: string, actor: AdminActor): Promise<AdminCommandResult>;
  listUsers(query: AdminUserQuery): Promise<PaginatedResult<AdminManagedUser>>;
  setUserActive(id: string, isActive: boolean, actor: AdminActor): Promise<AdminCommandResult<AdminManagedUser>>;
  listApprovals(query: AdminBookingQuery): Promise<PaginatedResult<FacultyBooking>>;
  approveBooking(id: string, actor: AdminActor): Promise<AdminCommandResult<FacultyBooking>>;
  rejectBooking(id: string, reason: string, actor: AdminActor): Promise<AdminCommandResult<FacultyBooking>>;
  listTimetable(): Promise<AdminTimetableSlot[]>;
  listIssues(query: AdminIssueQuery): Promise<PaginatedResult<ClassroomIssue>>;
  updateIssueStatus(id: string, status: IssueStatus, actor: AdminActor): Promise<AdminCommandResult<ClassroomIssue>>;
  listNotifications(): Promise<AdminNotificationItem[]>;
  markNotificationRead(id: string): Promise<AdminCommandResult>;
  markAllNotificationsRead(): Promise<AdminCommandResult>;
  listAuditLogs(query: AdminAuditQuery): Promise<PaginatedResult<AdminAuditEntry>>;
  getReports(): Promise<AdminReportSummary>;
}
