import type { DayOfWeek } from "@/types";
import type {
  StudentAcademicContext,
  StudentClassroomHint,
  StudentClassSession,
  StudentDashboardOverview,
} from "../types";

/**
 * Student dashboard data port.
 * Feature hooks call `getStudentDashboardService()` only.
 */
export interface StudentDashboardService {
  getOverview(): Promise<StudentDashboardOverview>;
  getWeeklyTimetable(day?: DayOfWeek | "ALL"): Promise<StudentClassSession[]>;
  searchClassrooms(query: string): Promise<StudentClassroomHint[]>;
  getAcademicContext(): Promise<StudentAcademicContext>;
}
