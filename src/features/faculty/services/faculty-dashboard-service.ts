import { mockDelay } from "@/services/api-client";
import { MOCK_CLASSROOMS } from "@/services/classroom-service";
import { getBookingService } from "@/features/bookings/services/booking-client";
import type { BookingActor } from "@/features/bookings/services/booking-service.interface";
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
  getOverview(actor: BookingActor, now?: Date): Promise<FacultyOverviewData>;
  getWeeklySchedule(): Promise<FacultyLecture[]>;
  getBookings(scope: "active" | "history", actor: BookingActor): Promise<FacultyBooking[]>;
  getBooking(id: string, actor: BookingActor): Promise<FacultyBooking | null>;
  searchClassrooms(query: string): Promise<FacultyClassroomHint[]>;
  getProfile(): Promise<FacultyProfileContext>;
  submitBooking(draft: FacultyBookingDraft, actor: BookingActor): Promise<FacultyBookingCommandResult>;
  updateBooking(id: string, draft: FacultyBookingDraft, actor: BookingActor): Promise<FacultyBookingCommandResult>;
  cancelBooking(id: string, actor: BookingActor): Promise<FacultyBookingCommandResult>;
}

class MockFacultyDashboardService implements FacultyDashboardService {
  async getOverview(actor: BookingActor, now = new Date()): Promise<FacultyOverviewData> {
    await mockDelay(200);
    const today = toLocalIsoDate(now);
    const todayLectures = lecturesOnDate(MOCK_FACULTY_LECTURES, today);
    const upcomingLectures = MOCK_FACULTY_LECTURES.filter(
      (item) => item.date > today || (item.date === today && item.endTime > `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`)
    ).sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
    const bookings = await getBookingService().listBookings("all", actor);

    return {
      profile: MOCK_FACULTY_PROFILE,
      todayLectures,
      upcomingLectures: upcomingLectures.slice(0, 4),
      weekLectures: MOCK_FACULTY_LECTURES,
      bookings,
      totalBookings: bookings.length,
      pendingBookingCount: bookings.filter((item) => item.status === "PENDING").length,
      notifications: MOCK_FACULTY_NOTIFICATIONS,
      unreadNotificationCount: MOCK_FACULTY_NOTIFICATIONS.filter((item) => !item.isRead).length,
    };
  }

  async getWeeklySchedule(): Promise<FacultyLecture[]> {
    await mockDelay(280);
    return [...MOCK_FACULTY_LECTURES];
  }

  async getBookings(scope: "active" | "history", actor: BookingActor): Promise<FacultyBooking[]> {
    return getBookingService().listBookings(scope, actor);
  }

  async getBooking(id: string, actor: BookingActor): Promise<FacultyBooking | null> {
    const lookup = await getBookingService().getBookingById(id, actor);
    return lookup.booking;
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

  async submitBooking(draft: FacultyBookingDraft, actor: BookingActor): Promise<FacultyBookingCommandResult> {
    return getBookingService().createBooking(draft, actor);
  }

  async updateBooking(
    id: string,
    draft: FacultyBookingDraft,
    actor: BookingActor
  ): Promise<FacultyBookingCommandResult> {
    return getBookingService().updateBooking(id, draft, actor);
  }

  async cancelBooking(id: string, actor: BookingActor): Promise<FacultyBookingCommandResult> {
    return getBookingService().cancelBooking(id, actor);
  }
}

export const facultyDashboardService: FacultyDashboardService = new MockFacultyDashboardService();
