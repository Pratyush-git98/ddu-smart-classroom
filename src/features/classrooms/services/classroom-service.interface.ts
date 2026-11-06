import type {
  Classroom,
  ClassroomAvailabilityQuery,
  ClassroomSearchFilters,
  ClassroomSearchResponse,
  RoomAvailability,
} from "@/types";

/**
 * Classroom finder port.
 *
 * Search results may include **provisional frontend availability** derived from
 * the facility catalog. That hint is not a booking lock.
 *
 * Production adapters MUST:
 * 1. Call the campus booking / timetable API for clash-checked availability.
 * 2. Return `availability.source = "SERVER_CONFIRMED"` only after that check.
 * 3. Support live refresh (`confirmAvailability` / polling / websocket) without
 *    changing this method surface.
 */
export interface ClassroomService {
  search(filters: ClassroomSearchFilters): Promise<ClassroomSearchResponse>;
  getById(id: string): Promise<Classroom | null>;
  listBuildings(campusId?: ClassroomSearchFilters["campusId"]): Promise<string[]>;
  getAvailability(query: ClassroomAvailabilityQuery): Promise<RoomAvailability>;
  /**
   * Re-check a single room against the booking service.
   * Mock adapters still label the payload SERVER_CONFIRMED to exercise the UI contract.
   */
  confirmAvailability(query: ClassroomAvailabilityQuery): Promise<RoomAvailability>;
}
