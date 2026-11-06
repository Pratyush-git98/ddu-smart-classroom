import { classroomService } from "./mock/mock-classroom-adapter";
import type { ClassroomService } from "./classroom-service.interface";

/**
 * Swap the mock adapter for a campus API client here.
 * Pages and hooks should import `getClassroomService()` only.
 */
export function getClassroomService(): ClassroomService {
  return classroomService;
}
