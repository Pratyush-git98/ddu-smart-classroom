import type { FacultyDashboardService } from "./faculty-dashboard-service.interface";
import { mockFacultyDashboardService } from "./mock/mock-faculty-dashboard-adapter";

/**
 * Lectures and profile still come from the mock academic adapter until a
 * faculty API exists. Booking mutations go through `getBookingService()`.
 */
export function getFacultyDashboardService(): FacultyDashboardService {
  return mockFacultyDashboardService;
}

export const facultyDashboardService = getFacultyDashboardService();
