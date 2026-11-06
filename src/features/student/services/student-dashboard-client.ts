import type { StudentDashboardService } from "./student-dashboard-service.interface";
import { mockStudentDashboardService } from "./mock/mock-student-dashboard-adapter";

/**
 * Swap `mockStudentDashboardService` for an HTTP adapter when the student
 * academic API is available. Classroom locator search already goes through
 * `getClassroomService()`.
 */
export function getStudentDashboardService(): StudentDashboardService {
  return mockStudentDashboardService;
}

export const studentDashboardService = getStudentDashboardService();
