import { mockDelay } from "@/services/api-client";
import type { Classroom, ClassroomFacility } from "@/types";
import { windowsOverlap } from "@/features/classrooms/lib/classroom-labels";
import type { FacultyBooking } from "@/features/faculty/types";
import { paginate } from "../lib/paginate";
import { annotateTimetableConflicts } from "../lib/timetable-conflicts";
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
  BookingTrendPoint,
  ClassroomIssue,
  ClassroomUtilizationPoint,
  IssueStatus,
  PaginatedResult,
} from "../types";
import {
  MOCK_ADMIN_AUDIT,
  MOCK_ADMIN_NOTIFICATIONS,
  MOCK_ADMIN_USERS,
  MOCK_CLASSROOM_ISSUES,
  seedBookings,
  seedClassrooms,
  seedTimetable,
} from "./mock/mock-admin-data";

/**
 * Admin operations port.
 *
 * Mutations here are UX simulations. Production MUST authorize against campus
 * IAM and commit through academic, facilities and audit APIs.
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
  listAuditLogs(query: AdminAuditQuery): Promise<PaginatedResult<AdminAuditEntry>>;
  getReports(): Promise<AdminReportSummary>;
}

let classrooms = seedClassrooms();
let bookings = seedBookings();
let users = MOCK_ADMIN_USERS.map((item) => ({ ...item }));
let issues = MOCK_CLASSROOM_ISSUES.map((item) => ({ ...item }));
let auditLogs = MOCK_ADMIN_AUDIT.map((item) => ({ ...item }));
let notifications = MOCK_ADMIN_NOTIFICATIONS.map((item) => ({ ...item }));
const timetable = seedTimetable();

function nowIso(): string {
  return new Date().toISOString();
}

function pushAudit(entry: Omit<AdminAuditEntry, "id" | "timestamp">) {
  auditLogs = [
    {
      id: `aud-${Date.now()}`,
      timestamp: nowIso(),
      ...entry,
    },
    ...auditLogs,
  ];
}

function facilitiesFromDraft(facilities: ClassroomFacility[]) {
  return {
    facilities,
    hasAirConditioning: facilities.includes("AIR_CONDITIONING"),
    computerCount: facilities.includes("COMPUTERS") ? 40 : undefined,
  };
}

function utilization(): ClassroomUtilizationPoint[] {
  const groups = new Map<string, Classroom[]>();
  for (const room of classrooms) {
    const key = `${room.campusId}::${room.block}`;
    const list = groups.get(key) ?? [];
    list.push(room);
    groups.set(key, list);
  }
  return [...groups.entries()].map(([, rooms]) => {
    const occupied = rooms.filter((room) => room.status === "OCCUPIED").length;
    const available = rooms.filter((room) => room.status === "AVAILABLE").length;
    const reserved = rooms.filter((room) => room.status === "RESERVED").length;
    const maintenance = rooms.filter((room) => room.status === "MAINTENANCE").length;
    const total = rooms.length;
    return {
      label: rooms[0]?.block ?? "Unknown block",
      campusId: rooms[0]?.campusId ?? "IET",
      occupied,
      available,
      reserved,
      maintenance,
      total,
      utilizationPercent: total === 0 ? 0 : Math.round(((occupied + reserved) / total) * 100),
    };
  });
}

function bookingTrends(): BookingTrendPoint[] {
  const days = ["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06", "2026-11-07"];
  return days.map((date) => {
    const related = bookings.filter((item) => item.createdAt.slice(0, 10) === date || item.date === date);
    return {
      date,
      label: date.slice(5),
      approved: related.filter((item) => item.status === "APPROVED" || item.status === "COMPLETED").length,
      pending: related.filter((item) => item.status === "PENDING").length,
      rejected: related.filter((item) => item.status === "REJECTED" || item.status === "CANCELLED").length,
    };
  });
}

function overviewStats() {
  return {
    totalClassrooms: classrooms.length,
    occupiedRooms: classrooms.filter((room) => room.status === "OCCUPIED").length,
    availableRooms: classrooms.filter((room) => room.status === "AVAILABLE").length,
    pendingApprovals: bookings.filter((item) => item.status === "PENDING").length,
    totalBookings: bookings.length,
    unresolvedIssues: issues.filter((item) => item.status === "OPEN" || item.status === "IN_PROGRESS").length,
  };
}

function bookingClash(candidate: FacultyBooking): string | null {
  const hit = bookings.find(
    (item) =>
      item.id !== candidate.id &&
      item.classroomId === candidate.classroomId &&
      item.date === candidate.date &&
      (item.status === "APPROVED" || item.status === "PENDING") &&
      windowsOverlap(candidate.startTime, candidate.endTime, item.startTime, item.endTime)
  );
  if (!hit) return null;
  return `Overlaps “${hit.title}” (${hit.startTime}–${hit.endTime}) in ${hit.venue.roomCode}.`;
}

class MockAdminDashboardService implements AdminDashboardService {
  async getOverview(): Promise<AdminOverviewData> {
    await mockDelay(220);
    const stats = overviewStats();
    return {
      stats,
      utilization: utilization(),
      bookingTrends: bookingTrends(),
      recentAudit: auditLogs.slice(0, 5),
      pendingApprovals: bookings.filter((item) => item.status === "PENDING").slice(0, 4),
      openIssues: issues.filter((item) => item.status === "OPEN" || item.status === "IN_PROGRESS").slice(0, 4),
    };
  }

  async listClassrooms(query: AdminClassroomQuery): Promise<PaginatedResult<Classroom>> {
    await mockDelay(180);
    const needle = query.search.trim().toLowerCase();
    const filtered = classrooms.filter((room) => {
      if (query.campusId !== "ALL" && room.campusId !== query.campusId) return false;
      if (query.status !== "ALL" && room.status !== query.status) return false;
      if (query.roomType !== "ALL" && room.type !== query.roomType) return false;
      if (query.building !== "ALL" && room.block !== query.building) return false;
      if (!needle) return true;
      return (
        room.roomNumber.toLowerCase().includes(needle) ||
        room.name.toLowerCase().includes(needle) ||
        room.block.toLowerCase().includes(needle)
      );
    });
    return paginate(filtered, query.page, query.pageSize);
  }

  async listBuildings(): Promise<string[]> {
    await mockDelay(80);
    return [...new Set(classrooms.map((room) => room.block))].sort();
  }

  async getClassroom(id: string): Promise<Classroom | null> {
    await mockDelay(80);
    return classrooms.find((room) => room.id === id) ?? null;
  }

  async createClassroom(draft: AdminClassroomDraft, actor: AdminActor): Promise<AdminCommandResult<Classroom>> {
    await mockDelay(240);
    const duplicate = classrooms.find(
      (room) => room.roomNumber.toLowerCase() === draft.roomNumber.trim().toLowerCase() && room.campusId === draft.campusId
    );
    if (duplicate) {
      return { success: false, message: `${draft.roomNumber} already exists on this campus.` };
    }
    const room: Classroom = {
      id: `adm-room-${Date.now()}`,
      roomNumber: draft.roomNumber.trim(),
      name: draft.name.trim(),
      campusId: draft.campusId,
      block: draft.block.trim(),
      floor: draft.floor,
      capacity: draft.capacity,
      type: draft.type,
      status: "AVAILABLE",
      equipment: [],
      ...facilitiesFromDraft(draft.facilities),
      hasRecordingSetup: false,
      isAccessibleForDisabled: true,
    };
    classrooms = [room, ...classrooms];
    pushAudit({
      actorName: actor.displayName,
      actorRole: actor.role,
      action: "Created classroom",
      entityType: "CLASSROOM",
      entityId: room.id,
      changeSummary: `Added ${room.roomNumber} · ${room.name} in ${room.block}.`,
    });
    return { success: true, message: `${room.roomNumber} was added to the catalog.`, data: room };
  }

  async updateClassroom(
    id: string,
    draft: AdminClassroomDraft,
    actor: AdminActor
  ): Promise<AdminCommandResult<Classroom>> {
    await mockDelay(240);
    const current = classrooms.find((room) => room.id === id);
    if (!current) {
      return { success: false, message: "Classroom was not found in the catalog." };
    }
    const updated: Classroom = {
      ...current,
      roomNumber: draft.roomNumber.trim(),
      name: draft.name.trim(),
      campusId: draft.campusId,
      block: draft.block.trim(),
      floor: draft.floor,
      capacity: draft.capacity,
      type: draft.type,
      ...facilitiesFromDraft(draft.facilities),
    };
    classrooms = classrooms.map((room) => (room.id === id ? updated : room));
    pushAudit({
      actorName: actor.displayName,
      actorRole: actor.role,
      action: "Updated classroom",
      entityType: "CLASSROOM",
      entityId: id,
      changeSummary: `Updated ${updated.roomNumber} capacity ${updated.capacity}, type ${updated.type.replace(/_/g, " ")}.`,
    });
    return { success: true, message: `${updated.roomNumber} was updated.`, data: updated };
  }

  async deleteClassroom(id: string, actor: AdminActor): Promise<AdminCommandResult> {
    await mockDelay(220);
    const current = classrooms.find((room) => room.id === id);
    if (!current) {
      return { success: false, message: "Classroom was not found in the catalog." };
    }
    classrooms = classrooms.filter((room) => room.id !== id);
    pushAudit({
      actorName: actor.displayName,
      actorRole: actor.role,
      action: "Removed classroom",
      entityType: "CLASSROOM",
      entityId: id,
      changeSummary: `Removed ${current.roomNumber} from the campus catalog.`,
    });
    return { success: true, message: `${current.roomNumber} was removed from the catalog.` };
  }

  async listUsers(query: AdminUserQuery): Promise<PaginatedResult<AdminManagedUser>> {
    await mockDelay(170);
    const needle = query.search.trim().toLowerCase();
    const filtered = users.filter((user) => {
      if (query.role !== "ALL" && user.role !== query.role) return false;
      if (query.campusId !== "ALL" && user.campusId !== query.campusId) return false;
      if (query.status === "ACTIVE" && !user.isActive) return false;
      if (query.status === "INACTIVE" && user.isActive) return false;
      if (!needle) return true;
      return (
        user.displayName.toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle) ||
        user.departmentName.toLowerCase().includes(needle)
      );
    });
    return paginate(filtered, query.page, query.pageSize);
  }

  async setUserActive(
    id: string,
    isActive: boolean,
    actor: AdminActor
  ): Promise<AdminCommandResult<AdminManagedUser>> {
    await mockDelay(200);
    const current = users.find((user) => user.id === id);
    if (!current) {
      return { success: false, message: "Directory record was not found." };
    }
    if (current.id === actor.id) {
      return { success: false, message: "You cannot change the active state of your own account." };
    }
    const updated = { ...current, isActive };
    users = users.map((user) => (user.id === id ? updated : user));
    pushAudit({
      actorName: actor.displayName,
      actorRole: actor.role,
      action: isActive ? "Activated user" : "Deactivated user",
      entityType: "USER",
      entityId: id,
      changeSummary: `${updated.displayName} set ${isActive ? "active" : "inactive"}.`,
    });
    return {
      success: true,
      message: `${updated.displayName} is now ${isActive ? "active" : "inactive"}.`,
      data: updated,
    };
  }

  async listApprovals(query: AdminBookingQuery): Promise<PaginatedResult<FacultyBooking>> {
    await mockDelay(190);
    const needle = query.search.trim().toLowerCase();
    const filtered = bookings.filter((item) => {
      if (query.status !== "ALL" && item.status !== query.status) return false;
      if (query.campusId !== "ALL" && item.venue.campusId !== query.campusId) return false;
      if (!needle) return true;
      return (
        item.title.toLowerCase().includes(needle) ||
        item.facultyName.toLowerCase().includes(needle) ||
        item.venue.roomCode.toLowerCase().includes(needle)
      );
    });
    return paginate(filtered, query.page, query.pageSize);
  }

  async approveBooking(id: string, actor: AdminActor): Promise<AdminCommandResult<FacultyBooking>> {
    await mockDelay(240);
    const current = bookings.find((item) => item.id === id);
    if (!current) {
      return { success: false, message: "Booking was not found." };
    }
    if (current.status !== "PENDING" && current.status !== "CONFLICT_DETECTED") {
      return { success: false, message: "Only pending or conflicted requisitions can be approved." };
    }
    const clash = bookingClash(current);
    const updated: FacultyBooking = clash
      ? {
          ...current,
          status: "CONFLICT_DETECTED",
          conflictMessage: clash,
          updatedAt: nowIso(),
        }
      : {
          ...current,
          status: "APPROVED",
          conflictMessage: undefined,
          adminRemark: undefined,
          updatedAt: nowIso(),
        };
    bookings = bookings.map((item) => (item.id === id ? updated : item));
    pushAudit({
      actorName: actor.displayName,
      actorRole: actor.role,
      action: clash ? "Held booking (conflict)" : "Approved booking",
      entityType: "BOOKING",
      entityId: id,
      changeSummary: clash
        ? `${current.title} could not be approved: ${clash}`
        : `${current.title} approved for ${current.venue.roomCode}.`,
    });
    return {
      success: !clash,
      message: clash ?? `${current.title} was approved.`,
      data: updated,
    };
  }

  async rejectBooking(id: string, reason: string, actor: AdminActor): Promise<AdminCommandResult<FacultyBooking>> {
    await mockDelay(240);
    const trimmed = reason.trim();
    if (trimmed.length < 8) {
      return { success: false, message: "A rejection reason of at least 8 characters is required." };
    }
    const current = bookings.find((item) => item.id === id);
    if (!current) {
      return { success: false, message: "Booking was not found." };
    }
    const updated: FacultyBooking = {
      ...current,
      status: "REJECTED",
      adminRemark: trimmed,
      updatedAt: nowIso(),
    };
    bookings = bookings.map((item) => (item.id === id ? updated : item));
    pushAudit({
      actorName: actor.displayName,
      actorRole: actor.role,
      action: "Rejected booking",
      entityType: "BOOKING",
      entityId: id,
      changeSummary: `${current.title} rejected: ${trimmed}`,
    });
    return { success: true, message: `${current.title} was rejected.`, data: updated };
  }

  async listTimetable(): Promise<AdminTimetableSlot[]> {
    await mockDelay(180);
    return annotateTimetableConflicts(timetable);
  }

  async listIssues(query: AdminIssueQuery): Promise<PaginatedResult<ClassroomIssue>> {
    await mockDelay(170);
    const needle = query.search.trim().toLowerCase();
    const filtered = issues.filter((item) => {
      if (query.status !== "ALL" && item.status !== query.status) return false;
      if (query.campusId !== "ALL" && item.campusId !== query.campusId) return false;
      if (query.severity !== "ALL" && item.severity !== query.severity) return false;
      if (!needle) return true;
      return (
        item.title.toLowerCase().includes(needle) ||
        item.roomNumber.toLowerCase().includes(needle) ||
        item.building.toLowerCase().includes(needle)
      );
    });
    return paginate(filtered, query.page, query.pageSize);
  }

  async updateIssueStatus(
    id: string,
    status: IssueStatus,
    actor: AdminActor
  ): Promise<AdminCommandResult<ClassroomIssue>> {
    await mockDelay(180);
    const current = issues.find((item) => item.id === id);
    if (!current) {
      return { success: false, message: "Issue was not found." };
    }
    const updated = { ...current, status, updatedAt: nowIso() };
    issues = issues.map((item) => (item.id === id ? updated : item));
    pushAudit({
      actorName: actor.displayName,
      actorRole: actor.role,
      action: "Updated issue status",
      entityType: "ISSUE",
      entityId: id,
      changeSummary: `${current.roomNumber} · ${current.title} → ${status.replace(/_/g, " ")}.`,
    });
    return { success: true, message: "Issue status updated.", data: updated };
  }

  async listNotifications(): Promise<AdminNotificationItem[]> {
    await mockDelay(150);
    return [...notifications];
  }

  async markNotificationRead(id: string): Promise<AdminCommandResult> {
    await mockDelay(80);
    notifications = notifications.map((item) => (item.id === id ? { ...item, isRead: true } : item));
    return { success: true, message: "Marked as read." };
  }

  async listAuditLogs(query: AdminAuditQuery): Promise<PaginatedResult<AdminAuditEntry>> {
    await mockDelay(160);
    const needle = query.search.trim().toLowerCase();
    const filtered = auditLogs.filter((item) => {
      if (query.entityType !== "ALL" && item.entityType !== query.entityType) return false;
      if (!needle) return true;
      return (
        item.actorName.toLowerCase().includes(needle) ||
        item.action.toLowerCase().includes(needle) ||
        item.changeSummary.toLowerCase().includes(needle) ||
        item.entityId.toLowerCase().includes(needle)
      );
    });
    return paginate(filtered, query.page, query.pageSize);
  }

  async getReports(): Promise<AdminReportSummary> {
    await mockDelay(220);
    const slots = annotateTimetableConflicts(timetable);
    const departmentMap = new Map<string, { bookings: number; pending: number }>();
    for (const user of users.filter((item) => item.role === "FACULTY")) {
      departmentMap.set(user.departmentName, departmentMap.get(user.departmentName) ?? { bookings: 0, pending: 0 });
    }
    for (const booking of bookings) {
      const faculty = users.find((user) => user.id === booking.facultyId);
      const key = faculty?.departmentName ?? "Unassigned department";
      const row = departmentMap.get(key) ?? { bookings: 0, pending: 0 };
      row.bookings += 1;
      if (booking.status === "PENDING") row.pending += 1;
      departmentMap.set(key, row);
    }
    return {
      generatedAt: nowIso(),
      stats: overviewStats(),
      campusUtilization: utilization(),
      bookingTrends: bookingTrends(),
      departmentDemand: [...departmentMap.entries()].map(([department, row]) => ({ department, ...row })),
      peakHours: [
        { window: "09:00–11:00", occupancyPercent: 86 },
        { window: "11:00–13:00", occupancyPercent: 74 },
        { window: "14:00–16:00", occupancyPercent: 68 },
        { window: "16:00–18:00", occupancyPercent: 41 },
      ],
      conflictCount: slots.filter((item) => item.hasConflict).length,
      unresolvedIssues: overviewStats().unresolvedIssues,
    };
  }
}

export const adminDashboardService: AdminDashboardService = new MockAdminDashboardService();
