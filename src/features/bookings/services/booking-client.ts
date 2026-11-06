import type {
  AlternativeClassroomSuggestion,
  FacultyBooking,
  FacultyBookingCommandResult,
  FacultyBookingDraft,
} from "@/features/faculty/types";
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

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("The booking service returned an unreadable response.");
  }
}

class HttpAcademicBookingService implements AcademicBookingService {
  async createBooking(draft: FacultyBookingDraft, actor: BookingActor): Promise<FacultyBookingCommandResult> {
    const response = await fetch("/api/bookings", {
      method: "POST",
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
    const response = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: actorHeaders(actor),
      body: JSON.stringify(draft),
    });
    return parseJson<FacultyBookingCommandResult>(response);
  }

  async cancelBooking(id: string, actor: BookingActor): Promise<FacultyBookingCommandResult> {
    const response = await fetch(`/api/bookings/${id}/cancel`, {
      method: "POST",
      headers: actorHeaders(actor),
    });
    return parseJson<FacultyBookingCommandResult>(response);
  }

  async getBookingById(id: string, actor: BookingActor): Promise<BookingLookupResult> {
    const response = await fetch(`/api/bookings/${id}`, {
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
    const response = await fetch(`/api/bookings?scope=${scope}`, {
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
    const response = await fetch("/api/bookings/suggestions", {
      method: "POST",
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

export function getBookingService(): AcademicBookingService {
  return new HttpAcademicBookingService();
}
