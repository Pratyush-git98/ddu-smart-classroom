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

/**
 * Faculty workspace port.
 *
 * Booking create / update / cancel MUST be validated and committed by the
 * campus booking API. This client never decides room availability.
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
