import type {
  AlternativeClassroomSuggestion,
  FacultyBooking,
  FacultyBookingCommandResult,
  FacultyBookingDraft,
} from "@/features/faculty/types";
import { campusFetch, parseJson } from "@/lib/campus-fetch";
import type {
  AcademicBookingService,
  AlternativeSuggestionQuery,
  BookingActor,
  BookingLookupResult,
} from "./booking-service.interface";

function actorHeaders(actor: BookingActor): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-DDU-Actor-Id": actor.id,
    "X-DDU-Actor-Role": actor.role,
    ...(actor.displayName ? { "X-DDU-Actor-Name": actor.displayName } : {}),
  };
}

class HttpAcademicBookingService implements AcademicBookingService {
  async createBooking(draft: FacultyBookingDraft, actor: BookingActor): Promise<FacultyBookingCommandResult> {
    const response = await campusFetch("/api/bookings", {
      method: "POST",
      cachePolicy: "noStore",
      headers: actorHeaders(actor),
      body: JSON.stringify(draft),
    });
    return parseJson<FacultyBookingCommandResult>(response);
  }

  async updateBooking(
    id: string,
    draft: FacultyBookingDraft,
    actor: BookingActor
  ): Promise<FacultyBookingCommandResult> {
    const response = await campusFetch(`/api/bookings/${id}`, {
      method: "PATCH",
      cachePolicy: "noStore",
      headers: actorHeaders(actor),
      body: JSON.stringify(draft),
    });
    return parseJson<FacultyBookingCommandResult>(response);
  }

  async cancelBooking(id: string, actor: BookingActor): Promise<FacultyBookingCommandResult> {
    const response = await campusFetch(`/api/bookings/${id}/cancel`, {
      method: "POST",
      cachePolicy: "noStore",
      headers: actorHeaders(actor),
    });
    return parseJson<FacultyBookingCommandResult>(response);
  }

  async getBookingById(id: string, actor: BookingActor): Promise<BookingLookupResult> {
    const response = await campusFetch(`/api/bookings/${id}`, {
      cachePolicy: "noStore",
      headers: actorHeaders(actor),
    });
    const payload = await parseJson<BookingLookupResult & { booking?: FacultyBooking | null }>(response);
    if (response.status === 403) {
      return {
        access: "forbidden",
        booking: null,
        message: payload.message ?? "You are not authorised to view this booking.",
      };
    }
    if (response.status === 404) {
      return {
        access: "not_found",
        booking: null,
        message: payload.message ?? "No booking exists for this reference.",
      };
    }
    return {
      access: payload.access ?? "ok",
      booking: payload.booking ?? null,
      message: payload.message,
    };
  }

  async listBookings(scope: "active" | "history" | "all", actor: BookingActor): Promise<FacultyBooking[]> {
    const response = await campusFetch(`/api/bookings?scope=${scope}`, {
      cachePolicy: "noStore",
      headers: actorHeaders(actor),
    });
    const payload = await parseJson<{ data?: FacultyBooking[]; message?: string }>(response);
    if (!response.ok) {
      throw new Error(payload.message ?? "Booking records could not be loaded.");
    }
    return payload.data ?? [];
  }

  async suggestAlternatives(
    query: AlternativeSuggestionQuery,
    actor: BookingActor
  ): Promise<AlternativeClassroomSuggestion[]> {
    const response = await campusFetch("/api/bookings/suggestions", {
      method: "POST",
      cachePolicy: "noStore",
      headers: actorHeaders(actor),
      body: JSON.stringify(query),
    });
    const payload = await parseJson<{ data?: AlternativeClassroomSuggestion[]; message?: string }>(response);
    if (!response.ok) {
      throw new Error(payload.message ?? "Alternative rooms could not be loaded.");
    }
    return payload.data ?? [];
  }
}

const bookingService = new HttpAcademicBookingService();

export function getBookingService(): AcademicBookingService {
  return bookingService;
}
