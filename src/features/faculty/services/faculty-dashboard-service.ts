import type { CampusLocationId } from "@/types";
import { mockDelay } from "@/services/api-client";
import { MOCK_CLASSROOMS } from "@/services/classroom-service";
import type {
  FacultyBooking,
  FacultyBookingCommandResult,
  FacultyBookingDraft,
  FacultyClassroomHint,
  FacultyLecture,
  FacultyOverviewData,
  FacultyProfileContext,
} from "../types";
import { lecturesOnDate, toLocalIsoDate } from "../lib/faculty-time";
import {
  MOCK_FACULTY_BOOKINGS,
  MOCK_FACULTY_LECTURES,
  MOCK_FACULTY_NOTIFICATIONS,
  MOCK_FACULTY_PROFILE,
} from "./mock/mock-faculty-dashboard";

/**
 * Faculty workspace port.
 *
 * Booking create / update / cancel MUST be validated and committed by the
 * campus booking API (transactional lock + clash matrix). This client never
 * decides room availability.
 */
export interface FacultyDashboardService {
  getOverview(now?: Date): Promise<FacultyOverviewData>;
  getWeeklySchedule(): Promise<FacultyLecture[]>;
  getBookings(scope: "active" | "history"): Promise<FacultyBooking[]>;
  getBooking(id: string): Promise<FacultyBooking | null>;
  searchClassrooms(query: string): Promise<FacultyClassroomHint[]>;
  getProfile(): Promise<FacultyProfileContext>;
  submitBooking(draft: FacultyBookingDraft): Promise<FacultyBookingCommandResult>;
  updateBooking(id: string, draft: FacultyBookingDraft): Promise<FacultyBookingCommandResult>;
  cancelBooking(id: string): Promise<FacultyBookingCommandResult>;
}

const HISTORY_STATUSES = new Set(["REJECTED", "CANCELLED", "COMPLETED"]);

function cloneBookings(): FacultyBooking[] {
  return MOCK_FACULTY_BOOKINGS.map((item) => ({ ...item, venue: { ...item.venue } }));
}

let bookingStore: FacultyBooking[] = cloneBookings();

function venueFromCatalog(classroomId: string, fallbackRoom: string, campusId: CampusLocationId) {
  const room = MOCK_CLASSROOMS.find((item) => item.id === classroomId || item.roomNumber === fallbackRoom);
  return {
    roomCode: room?.roomNumber ?? fallbackRoom,
    displayName: room?.name ?? "Sample teaching space",
    building: room?.block ?? "IET academic block",
    floor: room?.floor ?? 1,
    campusId: room?.campusId ?? campusId,
  };
}

function draftToBooking(id: string, draft: FacultyBookingDraft, existing?: FacultyBooking): FacultyBooking {
  const now = new Date().toISOString();
  return {
    id,
    facultyId: MOCK_FACULTY_PROFILE.facultyId,
    title: draft.title,
    purpose: draft.purpose,
    status: existing?.status ?? "PENDING",
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    attendeesCount: draft.attendeesCount,
    venue: venueFromCatalog(draft.classroomId, draft.roomNumber, draft.campusId),
    classroomId: draft.classroomId,
    description: draft.description,
    adminRemark: existing?.adminRemark,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

class MockFacultyDashboardService implements FacultyDashboardService {
  async getOverview(now = new Date()): Promise<FacultyOverviewData> {
    await mockDelay(400);
    const today = toLocalIsoDate(now);
    const todayLectures = lecturesOnDate(MOCK_FACULTY_LECTURES, today);
    const upcomingLectures = MOCK_FACULTY_LECTURES.filter(
      (item) => item.date > today || (item.date === today && item.endTime > `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`)
    ).sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));

    return {
      profile: MOCK_FACULTY_PROFILE,
      todayLectures,
      upcomingLectures: upcomingLectures.slice(0, 4),
      weekLectures: MOCK_FACULTY_LECTURES,
      bookings: bookingStore,
      totalBookings: bookingStore.length,
      pendingBookingCount: bookingStore.filter((item) => item.status === "PENDING").length,
      notifications: MOCK_FACULTY_NOTIFICATIONS,
      unreadNotificationCount: MOCK_FACULTY_NOTIFICATIONS.filter((item) => !item.isRead).length,
    };
  }

  async getWeeklySchedule(): Promise<FacultyLecture[]> {
    await mockDelay(280);
    return [...MOCK_FACULTY_LECTURES];
  }

  async getBookings(scope: "active" | "history"): Promise<FacultyBooking[]> {
    await mockDelay(300);
    return bookingStore.filter((item) =>
      scope === "history" ? HISTORY_STATUSES.has(item.status) : !HISTORY_STATUSES.has(item.status)
    );
  }

  async getBooking(id: string): Promise<FacultyBooking | null> {
    await mockDelay(160);
    return bookingStore.find((item) => item.id === id) ?? null;
  }

  async searchClassrooms(query: string): Promise<FacultyClassroomHint[]> {
    await mockDelay(260);
    const needle = query.trim().toLowerCase();
    return MOCK_CLASSROOMS.filter((room) => {
      if (!needle) return true;
      return (
        room.roomNumber.toLowerCase().includes(needle) ||
        room.name.toLowerCase().includes(needle) ||
        room.block.toLowerCase().includes(needle) ||
        String(room.floor).includes(needle)
      );
    }).map((room) => ({
      id: room.id,
      roomCode: room.roomNumber,
      name: room.name,
      building: room.block,
      floor: room.floor,
      campusId: room.campusId,
      status: room.status,
      capacity: room.capacity,
    }));
  }

  async getProfile(): Promise<FacultyProfileContext> {
    await mockDelay(160);
    return MOCK_FACULTY_PROFILE;
  }

  async submitBooking(draft: FacultyBookingDraft): Promise<FacultyBookingCommandResult> {
    await mockDelay(500);
    const booking = draftToBooking(`fbk-${Date.now()}`, draft);
    bookingStore = [booking, ...bookingStore];
    return {
      success: true,
      booking,
      pendingBackendValidation: true,
      message:
        "Requisition queued. The academic booking service must validate clashes and commit the allocation transactionally.",
    };
  }

  async updateBooking(id: string, draft: FacultyBookingDraft): Promise<FacultyBookingCommandResult> {
    await mockDelay(420);
    const existing = bookingStore.find((item) => item.id === id);
    if (!existing) {
      return {
        success: false,
        pendingBackendValidation: true,
        message: "Booking was not found. Refresh and try again.",
      };
    }
    const updated = draftToBooking(id, draft, existing);
    updated.status = "PENDING";
    bookingStore = bookingStore.map((item) => (item.id === id ? updated : item));
    return {
      success: true,
      booking: updated,
      pendingBackendValidation: true,
      message: "Amendment queued for backend re-validation. Clash detection is not performed in this portal.",
    };
  }

  async cancelBooking(id: string): Promise<FacultyBookingCommandResult> {
    await mockDelay(360);
    const existing = bookingStore.find((item) => item.id === id);
    if (!existing) {
      return {
        success: false,
        pendingBackendValidation: true,
        message: "Booking was not found.",
      };
    }
    const cancelled: FacultyBooking = {
      ...existing,
      status: "CANCELLED",
      updatedAt: new Date().toISOString(),
    };
    bookingStore = bookingStore.map((item) => (item.id === id ? cancelled : item));
    return {
      success: true,
      booking: cancelled,
      pendingBackendValidation: true,
      message: "Cancellation requested. Final release of the room slot is confirmed by the booking service.",
    };
  }
}

export const facultyDashboardService: FacultyDashboardService = new MockFacultyDashboardService();
