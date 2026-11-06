import { campusFetch, parseJson } from "@/lib/campus-fetch";
import type {
  Classroom,
  ClassroomAvailabilityQuery,
  ClassroomSearchFilters,
  ClassroomSearchResponse,
  RoomAvailability,
} from "@/types";
import type { ClassroomService } from "./classroom-service.interface";

class HttpClassroomService implements ClassroomService {
  async search(filters: ClassroomSearchFilters): Promise<ClassroomSearchResponse> {
    const response = await campusFetch("/api/classrooms/search", {
      method: "POST",
      cachePolicy: "noStore",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });
    if (!response.ok) {
      throw new Error("Classroom search could not be completed.");
    }
    return parseJson<ClassroomSearchResponse>(response);
  }

  async getById(id: string): Promise<Classroom | null> {
    const response = await campusFetch(`/api/classrooms/${id}`, { cachePolicy: "publicStatic" });
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error("Classroom details could not be loaded.");
    }
    const payload = await parseJson<{ data: Classroom | null }>(response);
    return payload.data;
  }

  async listCatalog(): Promise<Classroom[]> {
    const response = await campusFetch("/api/classrooms/catalog", { cachePolicy: "publicStatic" });
    if (!response.ok) {
      throw new Error("The classroom catalog could not be loaded.");
    }
    const payload = await parseJson<{ data?: Classroom[] }>(response);
    return payload.data ?? [];
  }

  async listBuildings(campusId?: ClassroomSearchFilters["campusId"]): Promise<string[]> {
    const params = new URLSearchParams({ campusId: campusId ?? "ALL" });
    const response = await campusFetch(`/api/classrooms/buildings?${params.toString()}`, {
      cachePolicy: "publicStatic",
    });
    if (!response.ok) {
      throw new Error("Building lists could not be loaded.");
    }
    const payload = await parseJson<{ data?: string[] }>(response);
    return payload.data ?? [];
  }

  async getAvailability(query: ClassroomAvailabilityQuery): Promise<RoomAvailability> {
    return this.postAvailability(query, false);
  }

  async confirmAvailability(query: ClassroomAvailabilityQuery): Promise<RoomAvailability> {
    return this.postAvailability(query, true);
  }

  private async postAvailability(query: ClassroomAvailabilityQuery, confirm: boolean): Promise<RoomAvailability> {
    const path = confirm ? "/api/classrooms/availability?confirm=1" : "/api/classrooms/availability";
    const response = await campusFetch(path, {
      method: "POST",
      cachePolicy: "noStore",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });
    if (!response.ok) {
      throw new Error("Classroom availability could not be confirmed.");
    }
    return parseJson<RoomAvailability>(response);
  }
}

const classroomService = new HttpClassroomService();

/**
 * Swap this HTTP adapter for a campus API client if the route surface changes.
 * Hooks should import `getClassroomService()` only.
 */
export function getClassroomService(): ClassroomService {
  return classroomService;
}
