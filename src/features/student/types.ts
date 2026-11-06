import type { CampusLocationId, DayOfWeek } from "@/types";

export type StudentSessionType = "LECTURE" | "LAB" | "TUTORIAL";

/**
 * Derived UI status for a scheduled period. ROOM_CHANGED / CANCELLED come from
 * timetable amendments; LIVE / UPCOMING / COMPLETED are computed from the clock.
 */
export type ClassSessionStatus =
  | "LIVE"
  | "UPCOMING"
  | "COMPLETED"
  | "CANCELLED"
  | "ROOM_CHANGED";

export interface SampleVenue {
  /** Demo locator code from the facility catalog — not an official IET assignment. */
  roomCode: string;
  displayName: string;
  building: string;
  floor: number;
  wing: string;
  campusId: CampusLocationId;
}

export interface StudentClassSession {
  id: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  sessionType: StudentSessionType;
  venue: SampleVenue;
  previousVenue?: SampleVenue;
  changeNote?: string;
  cancelled?: boolean;
}

export interface ClassroomChangeAlert {
  id: string;
  sessionId: string;
  subjectCode: string;
  subjectName: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  fromVenue: SampleVenue;
  toVenue: SampleVenue;
  reason: string;
  publishedAt: string;
}

export interface StudentNotificationItem {
  id: string;
  title: string;
  message: string;
  kind: "ROOM_CHANGE" | "TIMETABLE" | "GENERAL" | "REMINDER";
  publishedAt: string;
  isRead: boolean;
  href?: string;
}

export interface StudentAcademicContext {
  studentId: string;
  displayName: string;
  branchCode: string;
  branchName: string;
  academicYear: string;
  semester: number;
  batch: string;
  section: string;
  program: string;
  rollNumber: string;
  enrollmentNumber: string;
  primaryCampus: CampusLocationId;
}

export interface StudentDashboardOverview {
  academic: StudentAcademicContext;
  weekSessions: StudentClassSession[];
  changeAlerts: ClassroomChangeAlert[];
  notifications: StudentNotificationItem[];
  unreadNotificationCount: number;
}

export interface StudentClassroomHint {
  id: string;
  roomCode: string;
  name: string;
  building: string;
  floor: number;
  campusId: CampusLocationId;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
  capacity: number;
}

export interface StudentScheduleLecture {
  id: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  timeSlot: string;
  roomNumber: string;
  campusId: CampusLocationId;
  block: string;
  isCurrent: boolean;
  attendanceVerified: boolean;
}

export interface StudentProfileSummary {
  rollNumber: string;
  studentName: string;
  branch: string;
  semester: number;
  section: string;
  attendanceRate: number;
}
