import type {
  Classroom,
  ClassroomAvailabilityQuery,
  ClassroomSearchFilters,
  ClassroomSearchMatch,
  ClassroomSearchResponse,
  RoomAvailability,
} from "@/types";
import { mockDelay } from "@/services/api-client";
import { MOCK_CLASSROOMS } from "@/services/classroom-service";
import { buildRoomAvailability } from "../availability";
import type { ClassroomService } from "../classroom-service.interface";
import { MOCK_ROOM_OCCUPANCY } from "./mock-occupancy";

function uniqueBuildings(campusId: ClassroomSearchFilters["campusId"]): string[] {
  return Array.from(
    new Set(
      MOCK_CLASSROOMS.filter((room) => campusId === "ALL" || room.campusId === campusId).map(
        (room) => room.block
      )
    )
  ).sort((a, b) => a.localeCompare(b));
}

function sortMatches(results: ClassroomSearchMatch[], sort: ClassroomSearchFilters["sort"]) {
  const copy = [...results];
  copy.sort((a, b) => {
    switch (sort) {
      case "CAPACITY_ASC":
        return a.classroom.capacity - b.classroom.capacity;
      case "CAPACITY_DESC":
        return b.classroom.capacity - a.classroom.capacity;
      case "FLOOR_ASC":
        return a.classroom.floor - b.classroom.floor;
      case "FLOOR_DESC":
        return b.classroom.floor - a.classroom.floor;
      default:
        return 0;
    }
  });
  return copy;
}

function availabilityFor(
  classroom: Classroom,
  query: Omit<ClassroomAvailabilityQuery, "classroomId">,
  source: RoomAvailability["source"]
): RoomAvailability {
  return buildRoomAvailability(
    { ...query, classroomId: classroom.id },
    MOCK_ROOM_OCCUPANCY[classroom.id] ?? [],
    source,
    classroom.status === "MAINTENANCE"
      ? { closedAllDay: true, closedLabel: "Maintenance" }
      : undefined
  );
}

function matchesFilters(classroom: Classroom, filters: ClassroomSearchFilters): boolean {
  if (filters.campusId !== "ALL" && classroom.campusId !== filters.campusId) {
    return false;
  }
  if (filters.building !== "ALL" && classroom.block !== filters.building) {
    return false;
  }
  if (filters.roomType !== "ALL" && classroom.type !== filters.roomType) {
    return false;
  }
  if (typeof filters.minCapacity === "number" && classroom.capacity < filters.minCapacity) {
    return false;
  }
  return filters.facilities.every((facility) => classroom.facilities.includes(facility));
}

class MockClassroomService implements ClassroomService {
  async search(filters: ClassroomSearchFilters): Promise<ClassroomSearchResponse> {
    await mockDelay(380);

    const windowQuery = {
      date: filters.date,
      startTime: filters.startTime,
      endTime: filters.endTime,
    };

    const results = MOCK_CLASSROOMS.filter((classroom) => matchesFilters(classroom, filters)).map(
      (classroom) => ({
        classroom,
        availability: availabilityFor(classroom, windowQuery, "PROVISIONAL_FRONTEND"),
      })
    );

    return {
      filters,
      results: sortMatches(results, filters.sort),
      buildings: uniqueBuildings(filters.campusId),
      availabilityMode: "PROVISIONAL_FRONTEND",
      generatedAt: new Date().toISOString(),
    };
  }

  async getById(id: string): Promise<Classroom | null> {
    await mockDelay(160);
    return MOCK_CLASSROOMS.find((room) => room.id === id) ?? null;
  }

  async listBuildings(campusId: ClassroomSearchFilters["campusId"] = "ALL"): Promise<string[]> {
    await mockDelay(80);
    return uniqueBuildings(campusId);
  }

  async getAvailability(query: ClassroomAvailabilityQuery): Promise<RoomAvailability> {
    await mockDelay(220);
    const classroom = MOCK_CLASSROOMS.find((room) => room.id === query.classroomId);
    if (!classroom) {
      return buildRoomAvailability(query, [], "PROVISIONAL_FRONTEND");
    }
    return availabilityFor(classroom, query, "PROVISIONAL_FRONTEND");
  }

  async confirmAvailability(query: ClassroomAvailabilityQuery): Promise<RoomAvailability> {
    await mockDelay(520);
    const classroom = MOCK_CLASSROOMS.find((room) => room.id === query.classroomId);
    if (!classroom) {
      return buildRoomAvailability(query, [], "SERVER_CONFIRMED");
    }
    return availabilityFor(classroom, query, "SERVER_CONFIRMED");
  }
}

export const classroomService: ClassroomService = new MockClassroomService();
