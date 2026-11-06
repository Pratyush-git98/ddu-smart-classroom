import type { DayOfWeek } from "@/types";
import { mockDelay } from "@/services/api-client";
import { getClassroomService } from "@/features/classrooms/services/classroom-client";
import { filterClassroomsByLocatorQuery, toClassroomLocatorHint } from "@/features/classrooms/lib/locator";
import { getNotificationService } from "@/features/notifications/services/notification-client";
import type {
  StudentAcademicContext,
  StudentClassroomHint,
  StudentClassSession,
  StudentDashboardOverview,
} from "../../types";
import type { StudentDashboardService } from "../student-dashboard-service.interface";
import {
  filterSessionsByDay,
  MOCK_CHANGE_ALERTS,
  MOCK_STUDENT_CONTEXT,
  MOCK_WEEKLY_SESSIONS,
} from "./mock-student-dashboard";

class MockStudentDashboardService implements StudentDashboardService {
  async getOverview(): Promise<StudentDashboardOverview> {
    await mockDelay(420);
    const notifications = await getNotificationService().list({
      role: "STUDENT",
      recipientId: MOCK_STUDENT_CONTEXT.studentId,
    });
    return {
      academic: MOCK_STUDENT_CONTEXT,
      weekSessions: MOCK_WEEKLY_SESSIONS,
      changeAlerts: MOCK_CHANGE_ALERTS,
      notifications,
      unreadNotificationCount: notifications.filter((item) => !item.isRead).length,
    };
  }

  async getWeeklyTimetable(day: DayOfWeek | "ALL" = "ALL"): Promise<StudentClassSession[]> {
    await mockDelay(320);
    return filterSessionsByDay(MOCK_WEEKLY_SESSIONS, day);
  }

  async searchClassrooms(query: string): Promise<StudentClassroomHint[]> {
    const rooms = await getClassroomService().listCatalog();
    return filterClassroomsByLocatorQuery(rooms, query).map(toClassroomLocatorHint);
  }

  async getAcademicContext(): Promise<StudentAcademicContext> {
    await mockDelay(180);
    return MOCK_STUDENT_CONTEXT;
  }
}

export const mockStudentDashboardService: StudentDashboardService = new MockStudentDashboardService();
