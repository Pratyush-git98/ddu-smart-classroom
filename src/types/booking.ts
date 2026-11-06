import type { CampusLocationId } from "./campus";

export type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED"
  | "CONFLICT_DETECTED";

export type BookingPurpose =
  | "REGULAR_CLASS"
  | "EXTRA_LECTURE"
  | "SEMINAR"
  | "EXAM"
  | "WORKSHOP"
  | "CONFERENCE"
  | "STUDENT_EVENT";

export interface BookingTimeSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface BookingRequest {
  id: string;
  classroomId: string;
  roomNumber: string;
  campusId: CampusLocationId;
  facultyId: string;
  facultyName: string;
  departmentCode: string;
  purpose: BookingPurpose;
  title: string;
  description?: string;
  slot: BookingTimeSlot;
  attendeesCount: number;
  status: BookingStatus;
  adminRemark?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBookingId?: string;
  conflictingLecture?: string;
  message?: string;
}

