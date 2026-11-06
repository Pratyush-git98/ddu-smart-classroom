import type { UserRole } from "@/types";
import type {
  AlternativeClassroomSuggestion,
  FacultyBooking,
  FacultyBookingCommandResult,
  FacultyBookingDraft,
} from "@/features/faculty/types";

export interface BookingActor {
  id: string;
  role: UserRole;
  displayName?: string;
}

export interface BookingLookupResult {
  access: "ok" | "forbidden" | "not_found";
  booking: FacultyBooking | null;
  message?: string;
}

export interface AlternativeSuggestionQuery {
  classroomId: string;
  building?: string;
  date: string;
  startTime: string;
  endTime: string;
  attendeesCount: number;
  excludeBookingId?: string;
}

/**
 * Academic booking port.
 *
 * The frontend never decides whether a room is free. `createBooking` and
 * `updateBooking` MUST call the campus booking API, which runs clash detection
 * and returns the committed (or rejected) record.
 */
export interface AcademicBookingService {
  createBooking(draft: FacultyBookingDraft, actor: BookingActor): Promise<FacultyBookingCommandResult>;
  updateBooking(
    id: string,
    draft: FacultyBookingDraft,
    actor: BookingActor
  ): Promise<FacultyBookingCommandResult>;
  cancelBooking(id: string, actor: BookingActor): Promise<FacultyBookingCommandResult>;
  getBookingById(id: string, actor: BookingActor): Promise<BookingLookupResult>;
  listBookings(scope: "active" | "history" | "all", actor: BookingActor): Promise<FacultyBooking[]>;
  suggestAlternatives(
    query: AlternativeSuggestionQuery,
    actor: BookingActor
  ): Promise<AlternativeClassroomSuggestion[]>;
}
