import type {
  BookingStatus,
  CampusLocationId,
  ClassroomFacility,
  NotificationCategory,
  NotificationPriority,
  RoomStatus,
  RoomType,
  TimetableSlot,
  UserRole,
} from "@/types";
import type { FacultyBooking } from "@/features/faculty/types";

export interface CampusAuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  campusId: CampusLocationId;
  targetRoom: string;
  timestamp: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

export interface CampusUtilizationMetric {
  campusId: CampusLocationId;
  campusName: string;
  totalRooms: number;
  inUse: number;
  available: number;
  utilizationRate: number;
}

export interface AdminActor {
  id: string;
  displayName: string;
  role: UserRole;
}

export interface AdminOverviewStats {
  totalClassrooms: number;
  occupiedRooms: number;
  availableRooms: number;
  pendingApprovals: number;
  totalBookings: number;
  unresolvedIssues: number;
}

export interface ClassroomUtilizationPoint {
  label: string;
  campusId: CampusLocationId;
  occupied: number;
  available: number;
  reserved: number;
  maintenance: number;
  total: number;
  utilizationPercent: number;
}

export interface BookingTrendPoint {
  date: string;
  label: string;
  approved: number;
  pending: number;
  rejected: number;
}

export interface AdminOverviewData {
  stats: AdminOverviewStats;
  utilization: ClassroomUtilizationPoint[];
  bookingTrends: BookingTrendPoint[];
  recentAudit: AdminAuditEntry[];
  pendingApprovals: FacultyBooking[];
  openIssues: ClassroomIssue[];
}

export interface AdminClassroomDraft {
  roomNumber: string;
  name: string;
  campusId: CampusLocationId;
  block: string;
  floor: number;
  capacity: number;
  type: RoomType;
  facilities: ClassroomFacility[];
}

export interface AdminManagedUser {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  departmentCode: string;
  departmentName: string;
  campusId: CampusLocationId;
  isActive: boolean;
  emailVerified: boolean;
  lastActiveAt: string;
}

export type IssueCategory = "EQUIPMENT" | "HVAC" | "FURNITURE" | "NETWORK" | "SAFETY" | "OTHER";
export type IssueSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface ClassroomIssue {
  id: string;
  classroomId: string;
  roomNumber: string;
  building: string;
  campusId: CampusLocationId;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  reportedBy: string;
  reportedAt: string;
  updatedAt: string;
}

export type AuditEntityType = "CLASSROOM" | "USER" | "BOOKING" | "TIMETABLE" | "ISSUE" | "NOTIFICATION";

export interface AdminAuditEntry {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: AuditEntityType;
  entityId: string;
  timestamp: string;
  changeSummary: string;
}

export interface AdminNotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: string;
  isRead: boolean;
  audience: "ALL" | "STUDENT" | "FACULTY" | "ADMIN";
}

export interface AdminTimetableSlot extends TimetableSlot {
  hasConflict: boolean;
  conflictReason?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminClassroomQuery {
  search: string;
  campusId: CampusLocationId | "ALL";
  status: RoomStatus | "ALL";
  roomType: RoomType | "ALL";
  building: string | "ALL";
  page: number;
  pageSize: number;
}

export interface AdminUserQuery {
  search: string;
  role: UserRole | "ALL";
  campusId: CampusLocationId | "ALL";
  status: "ALL" | "ACTIVE" | "INACTIVE";
  page: number;
  pageSize: number;
}

export interface AdminBookingQuery {
  search: string;
  status: BookingStatus | "ALL";
  campusId: CampusLocationId | "ALL";
  page: number;
  pageSize: number;
}

export interface AdminIssueQuery {
  search: string;
  status: IssueStatus | "ALL";
  campusId: CampusLocationId | "ALL";
  severity: IssueSeverity | "ALL";
  page: number;
  pageSize: number;
}

export interface AdminAuditQuery {
  search: string;
  entityType: AuditEntityType | "ALL";
  page: number;
  pageSize: number;
}

export interface AdminCommandResult<T = void> {
  success: boolean;
  message: string;
  data?: T;
}

export interface DepartmentDemandRow {
  department: string;
  bookings: number;
  pending: number;
}

export interface PeakHourRow {
  window: string;
  occupancyPercent: number;
}

export interface AdminReportSummary {
  generatedAt: string;
  stats: AdminOverviewStats;
  campusUtilization: ClassroomUtilizationPoint[];
  bookingTrends: BookingTrendPoint[];
  departmentDemand: DepartmentDemandRow[];
  peakHours: PeakHourRow[];
  conflictCount: number;
  unresolvedIssues: number;
}
