import { mockDelay } from "@/services/api-client";
import { getBookingService } from "@/features/bookings/services/booking-client";
import { getClassroomService } from "@/features/classrooms/services/classroom-client";
import { filterClassroomsByLocatorQuery, toClassroomLocatorHint } from "@/features/classrooms/lib/locator";
import { getNotificationService } from "@/features/notifications/services/notification-client";
import type { BookingActor } from "@/features/bookings/services/booking-service.interface";
import type {
  FacultyBooking,
  FacultyBookingCommandResult,
  FacultyBookingDraft,
  FacultyClassroomHint,
  FacultyLecture,
  FacultyOverviewData,
  FacultyProfileContext,
} from "../../types";
import { lecturesOnDate, toLocalIsoDate } from "../../lib/faculty-time";
import type { FacultyDashboardService } from "../faculty-dashboard-service.interface";
import { MOCK_FACULTY_LECTURES, MOCK_FACULTY_PROFILE } from "./mock-faculty-dashboard";

class MockFacultyDashboardService implements FacultyDashboardService {
  async getOverview(actor: BookingActor, now = new Date()): Promise<FacultyOverviewData> {
    await mockDelay(200);
    const today = toLocalIsoDate(now);
    const todayLectures = lecturesOnDate(MOCK_FACULTY_LECTURES, today);
    const upcomingLectures = MOCK_FACULTY_LECTURES.filter(
      (item) =>
        item.date > today ||
        (item.date === today &&
          item.endTime > `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`)
    ).sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
    const bookings = await getBookingService().listBookings("all", actor);
    const notifications = await getNotificationService().list({
      role: "FACULTY",
      recipientId: actor.id,
    });

    return {
      profile: MOCK_FACULTY_PROFILE,
      todayLectures,
      upcomingLectures: upcomingLectures.slice(0, 4),
      weekLectures: MOCK_FACULTY_LECTURES,
      bookings,
      totalBookings: bookings.length,
      pendingBookingCount: bookings.filter((item) => item.status === "PENDING").length,
      notifications,
      unreadNotificationCount: notifications.filter((item) => !item.isRead).length,
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
    const rooms = await getClassroomService().listCatalog();
    return filterClassroomsByLocatorQuery(rooms, query).map(toClassroomLocatorHint);
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

export const mockFacultyDashboardService: FacultyDashboardService = new MockFacultyDashboardService();
