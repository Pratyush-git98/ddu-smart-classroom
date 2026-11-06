import { FacultyBookingFormSchema } from "@/schemas/booking";
import { MOCK_CLASSROOMS } from "@/services/classroom-service";
import { mockDelay } from "@/services/api-client";
import type { Classroom, ClassroomFacility } from "@/types";
import type {
  AlternativeClassroomSuggestion,
  FacultyBooking,
  FacultyBookingCommandResult,
  FacultyBookingDraft,
} from "@/features/faculty/types";
import { MOCK_FACULTY_BOOKINGS, MOCK_FACULTY_LECTURES } from "@/features/faculty/services/mock/mock-faculty-dashboard";
import { MOCK_FACULTY_PROFILE } from "@/features/faculty/services/mock/mock-faculty-dashboard";
import { windowsOverlap } from "@/features/classrooms/lib/classroom-labels";
import { MOCK_ROOM_OCCUPANCY } from "@/features/classrooms/services/mock/mock-occupancy";
import { canCancelOwnedBooking, canEditOwnedBooking, canViewBooking, isPrivilegedBookingActor } from "../../lib/booking-access";
import type {
  AcademicBookingService,
  AlternativeSuggestionQuery,
  BookingActor,
  BookingLookupResult,
} from "../booking-service.interface";

const HISTORY_STATUSES = new Set(["REJECTED", "CANCELLED", "COMPLETED"]);

function cloneBookings(): FacultyBooking[] {
  return MOCK_FACULTY_BOOKINGS.map((item) => ({ ...item, venue: { ...item.venue } }));
}

let bookingStore: FacultyBooking[] = cloneBookings();

function emptyResult(message: string, extras?: Partial<FacultyBookingCommandResult>): FacultyBookingCommandResult {
  return {
    success: false,
    conflict: false,
    pendingBackendValidation: true,
    message,
    alternatives: [],
    ...extras,
  };
}

function classroomById(id: string): Classroom | undefined {
  return MOCK_CLASSROOMS.find((room) => room.id === id);
}

function venueFromClassroom(classroom: Classroom) {
  return {
    roomCode: classroom.roomNumber,
    displayName: classroom.name,
    building: classroom.block,
    floor: classroom.floor,
    campusId: classroom.campusId,
  };
}

function occupancyBlocks(classroomId: string) {
  return MOCK_ROOM_OCCUPANCY[classroomId] ?? [];
}

function activeBookingsForRoom(classroomId: string, date: string, ignoreId?: string): FacultyBooking[] {
  return bookingStore.filter(
    (item) =>
      item.id !== ignoreId &&
      item.classroomId === classroomId &&
      item.date === date &&
      (item.status === "APPROVED" || item.status === "PENDING")
  );
}

function findConflict(
  classroom: Classroom,
  draft: FacultyBookingDraft,
  ignoreBookingId?: string
): string | null {
  if (classroom.status === "MAINTENANCE") {
    return `${classroom.roomNumber} is closed for maintenance. The booking service cannot allocate this room.`;
  }

  const occupancyHit = occupancyBlocks(classroom.id).find((block) =>
    windowsOverlap(draft.startTime, draft.endTime, block.startTime, block.endTime)
  );
  if (occupancyHit) {
    return `${classroom.roomNumber} is already occupied (${occupancyHit.label}, ${occupancyHit.startTime}–${occupancyHit.endTime}).`;
  }

  const lectureHit = MOCK_FACULTY_LECTURES.find(
    (lecture) =>
      lecture.date === draft.date &&
      lecture.venue.roomCode === classroom.roomNumber &&
      windowsOverlap(draft.startTime, draft.endTime, lecture.startTime, lecture.endTime)
  );
  if (lectureHit) {
    return `Timetable clash with ${lectureHit.subjectName} (${lectureHit.startTime}–${lectureHit.endTime}).`;
  }

  const bookingHit = activeBookingsForRoom(classroom.id, draft.date, ignoreBookingId).find((item) =>
    windowsOverlap(draft.startTime, draft.endTime, item.startTime, item.endTime)
  );
  if (bookingHit) {
    return `Overlaps approved/pending booking “${bookingHit.title}” (${bookingHit.startTime}–${bookingHit.endTime}).`;
  }

  return null;
}

function isWindowFree(classroom: Classroom, draft: FacultyBookingDraft, ignoreBookingId?: string): boolean {
  return findConflict(classroom, draft, ignoreBookingId) === null;
}

function suggestionReason(candidate: Classroom, requested?: Classroom): string {
  const bits = [`${candidate.capacity} seats`];
  if (requested) {
    const shared = candidate.facilities.filter((item) => requested.facilities.includes(item));
    if (shared.length > 0) bits.push(`shared facilities: ${shared.join(", ").toLowerCase()}`);
    if (candidate.block === requested.block) bits.push("same building");
  }
  bits.push("server-confirmed free for this window");
  return bits.join(" · ");
}

function buildAlternatives(
  draft: FacultyBookingDraft,
  requested: Classroom | undefined,
  ignoreBookingId?: string
): AlternativeClassroomSuggestion[] {
  const scored = MOCK_CLASSROOMS.map((candidate) => {
    if (requested && candidate.id === requested.id) return null;
    if (candidate.status === "MAINTENANCE") return null;
    if (candidate.capacity < draft.attendeesCount) return null;
    if (requested && candidate.campusId !== requested.campusId) return null;
    if (!isWindowFree(candidate, draft, ignoreBookingId)) return null;

    const sharedFacilities = requested
      ? candidate.facilities.filter((item) => requested.facilities.includes(item)).length
      : 0;
    const capacityDelta = candidate.capacity - draft.attendeesCount;
    const score = sharedFacilities * 10 - capacityDelta / 20 + (requested && candidate.block === requested.block ? 4 : 0);

    return { candidate, score, sharedFacilities };
  }).filter((item): item is { candidate: Classroom; score: number; sharedFacilities: number } => item !== null);

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 4).map(({ candidate }) => ({
    classroomId: candidate.id,
    roomNumber: candidate.roomNumber,
    name: candidate.name,
    building: candidate.block,
    floor: candidate.floor,
    campusId: candidate.campusId,
    capacity: candidate.capacity,
    facilities: candidate.facilities as ClassroomFacility[],
    reason: suggestionReason(candidate, requested),
  }));
}

function validateDraft(draft: FacultyBookingDraft): string | null {
  const parsed = FacultyBookingFormSchema.safeParse({
    classroomId: draft.classroomId,
    building: draft.building,
    title: draft.title,
    purpose: draft.purpose,
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    attendeesCount: draft.attendeesCount,
    description: draft.description ?? "",
  });
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "The booking request is invalid.";
  }
  return null;
}

function toBooking(
  id: string,
  draft: FacultyBookingDraft,
  classroom: Classroom,
  actor: BookingActor,
  existing?: FacultyBooking
): FacultyBooking {
  const now = new Date().toISOString();
  return {
    id,
    facultyId: existing?.facultyId ?? actor.id,
    facultyName: existing?.facultyName ?? actor.displayName ?? MOCK_FACULTY_PROFILE.displayName,
    title: draft.title,
    purpose: draft.purpose,
    status: "PENDING",
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    attendeesCount: draft.attendeesCount,
    venue: venueFromClassroom(classroom),
    classroomId: classroom.id,
    description: draft.description?.trim() ? draft.description.trim() : undefined,
    adminRemark: existing?.adminRemark,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function deny(message: string): FacultyBookingCommandResult {
  return emptyResult(message);
}

class MockAcademicBookingService implements AcademicBookingService {
  async createBooking(draft: FacultyBookingDraft, actor: BookingActor): Promise<FacultyBookingCommandResult> {
    await mockDelay(480);
    const invalid = validateDraft(draft);
    if (invalid) return deny(invalid);

    const classroom = classroomById(draft.classroomId);
    if (!classroom) return deny("The selected classroom is not in the facility catalog.");
    if (draft.building && classroom.block !== draft.building) {
      return deny("Building and classroom do not match. Refresh the form and try again.");
    }

    const conflict = findConflict(classroom, draft);
    const alternatives = conflict ? buildAlternatives(draft, classroom) : [];
    const booking = toBooking(`fbk-${Date.now()}`, draft, classroom, actor);

    if (conflict) {
      booking.status = "CONFLICT_DETECTED";
      booking.conflictMessage = conflict;
      bookingStore = [booking, ...bookingStore];
      return {
        success: false,
        booking,
        conflict: true,
        pendingBackendValidation: true,
        message: `Scheduling conflict confirmed by the booking service. ${conflict}`,
        alternatives,
        availabilityCheckedAt: new Date().toISOString(),
      };
    }

    bookingStore = [booking, ...bookingStore];
    return {
      success: true,
      booking,
      conflict: false,
      pendingBackendValidation: true,
      message: "Booking accepted by the academic booking service and queued as pending review.",
      alternatives: [],
      availabilityCheckedAt: new Date().toISOString(),
    };
  }

  async updateBooking(
    id: string,
    draft: FacultyBookingDraft,
    actor: BookingActor
  ): Promise<FacultyBookingCommandResult> {
    await mockDelay(420);
    const existing = bookingStore.find((item) => item.id === id);
    if (!existing) return deny("Booking was not found. Refresh and try again.");
    if (!canEditOwnedBooking(existing, actor.id, actor.role)) {
      return deny("You cannot edit this booking. Only the owner or an academic admin may change it.");
    }

    const invalid = validateDraft(draft);
    if (invalid) return deny(invalid);

    const classroom = classroomById(draft.classroomId);
    if (!classroom) return deny("The selected classroom is not in the facility catalog.");

    const conflict = findConflict(classroom, draft, existing.id);
    const alternatives = conflict ? buildAlternatives(draft, classroom, existing.id) : [];
    const updated = toBooking(id, draft, classroom, actor, existing);

    if (conflict) {
      updated.status = "CONFLICT_DETECTED";
      updated.conflictMessage = conflict;
      bookingStore = bookingStore.map((item) => (item.id === id ? updated : item));
      return {
        success: false,
        booking: updated,
        conflict: true,
        pendingBackendValidation: true,
        message: `Scheduling conflict confirmed by the booking service. ${conflict}`,
        alternatives,
        availabilityCheckedAt: new Date().toISOString(),
      };
    }

    updated.status = "PENDING";
    updated.conflictMessage = undefined;
    bookingStore = bookingStore.map((item) => (item.id === id ? updated : item));
    return {
      success: true,
      booking: updated,
      conflict: false,
      pendingBackendValidation: true,
      message: "Amendment accepted by the booking service. Clash checks were re-run server-side.",
      alternatives: [],
      availabilityCheckedAt: new Date().toISOString(),
    };
  }

  async cancelBooking(id: string, actor: BookingActor): Promise<FacultyBookingCommandResult> {
    await mockDelay(360);
    const existing = bookingStore.find((item) => item.id === id);
    if (!existing) return deny("Booking was not found.");
    if (!canCancelOwnedBooking(existing, actor.id, actor.role)) {
      return deny("You cannot cancel this booking. Only the owner or an academic admin may release it.");
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
      conflict: false,
      pendingBackendValidation: true,
      message: "Cancellation confirmed by the booking service. The room slot has been released.",
      alternatives: [],
      availabilityCheckedAt: new Date().toISOString(),
    };
  }

  async getBookingById(id: string, actor: BookingActor): Promise<BookingLookupResult> {
    await mockDelay(180);
    const booking = bookingStore.find((item) => item.id === id) ?? null;
    if (!booking) {
      return { access: "not_found", booking: null, message: "No booking exists for this reference." };
    }
    if (!canViewBooking(booking, actor.id, actor.role)) {
      return {
        access: "forbidden",
        booking: null,
        message: "You are not authorised to view this booking.",
      };
    }
    return { access: "ok", booking };
  }

  async listBookings(scope: "active" | "history" | "all", actor: BookingActor): Promise<FacultyBooking[]> {
    await mockDelay(280);
    const visible = bookingStore.filter((item) => {
      if (isPrivilegedBookingActor(actor.role)) return true;
      return item.facultyId === actor.id || item.facultyId === "usr-fac-99";
    });

    if (scope === "all") return visible;
    return visible.filter((item) =>
      scope === "history" ? HISTORY_STATUSES.has(item.status) : !HISTORY_STATUSES.has(item.status)
    );
  }

  async suggestAlternatives(
    query: AlternativeSuggestionQuery
  ): Promise<AlternativeClassroomSuggestion[]> {
    await mockDelay(260);
    const requested = classroomById(query.classroomId);
    const draft: FacultyBookingDraft = {
      classroomId: query.classroomId,
      building: query.building ?? requested?.block ?? "",
      title: "Availability probe",
      purpose: "EXTRA_LECTURE",
      date: query.date,
      startTime: query.startTime,
      endTime: query.endTime,
      attendeesCount: query.attendeesCount,
    };
    return buildAlternatives(draft, requested, query.excludeBookingId);
  }
}

export const academicBookingService: AcademicBookingService = new MockAcademicBookingService();
