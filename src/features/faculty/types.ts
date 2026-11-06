import type { BookingPurpose, BookingStatus, CampusLocationId, DayOfWeek } from "@/types";

export type FacultySessionType = "LECTURE" | "LAB" | "TUTORIAL";

export interface FacultyVenue {
  roomCode: string;
  displayName: string;
  building: string;
  floor: number;
  campusId: CampusLocationId;
}

export interface FacultyLecture {
  id: string;
  date: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  sessionType: FacultySessionType;
  section: string;
  semester: number;
  venue: FacultyVenue;
}

export interface FacultyBooking {
  id: string;
  facultyId: string;
  facultyName: string;
  title: string;
  purpose: BookingPurpose;
  status: BookingStatus;
  date: string;
  startTime: string;
  endTime: string;
  attendeesCount: number;
  venue: FacultyVenue;
  classroomId: string;
  description?: string;
  adminRemark?: string;
  conflictMessage?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Draft sent to the academic booking API.
 * Clash detection and commit are backend responsibilities.
 */
export interface FacultyBookingDraft {
  classroomId: string;
  building: string;
  roomNumber?: string;
  campusId?: CampusLocationId;
  title: string;
  purpose: BookingPurpose;
  date: string;
  startTime: string;
  endTime: string;
  attendeesCount: number;
  description?: string;
}

export interface AlternativeClassroomSuggestion {
  classroomId: string;
  roomNumber: string;
  name: string;
  building: string;
  floor: number;
  campusId: CampusLocationId;
  capacity: number;
  facilities: string[];
  reason: string;
}

export interface FacultyBookingCommandResult {
  success: boolean;
  booking?: FacultyBooking;
  conflict: boolean;
  pendingBackendValidation: boolean;
  message: string;
  alternatives: AlternativeClassroomSuggestion[];
  availabilityCheckedAt?: string;
}

export interface FacultyNotificationItem {
  id: string;
  title: string;
  message: string;
  kind: "BOOKING" | "SCHEDULE" | "GENERAL";
  publishedAt: string;
  isRead: boolean;
  href?: string;
}

export interface FacultyProfileContext {
  facultyId: string;
  displayName: string;
  employeeId: string;
  designation: string;
  departmentCode: string;
  departmentName: string;
  isHod: boolean;
  coursesAssigned: string[];
  primaryCampus: CampusLocationId;
  email: string;
}

export interface FacultyClassroomHint {
  id: string;
  roomCode: string;
  name: string;
  building: string;
  floor: number;
  campusId: CampusLocationId;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
  capacity: number;
}

export interface FacultyOverviewData {
  profile: FacultyProfileContext;
  todayLectures: FacultyLecture[];
  upcomingLectures: FacultyLecture[];
  weekLectures: FacultyLecture[];
  bookings: FacultyBooking[];
  totalBookings: number;
  pendingBookingCount: number;
  notifications: FacultyNotificationItem[];
  unreadNotificationCount: number;
}

export interface FacultyRequisitionDraft {
  campusId: CampusLocationId;
  targetRoomNumber: string;
  lectureTitle: string;
  courseCode: string;
  expectedStudents: number;
  date: string;
  startTime: string;
  endTime: string;
  requiresLectureRecording: boolean;
}

export interface FacultyIoTPreset {
  roomId: string;
  projectorPower: boolean;
  screenDown: boolean;
  acTemperature: number;
  micVolume: number;
  recordingActive: boolean;
}
