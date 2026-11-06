import type { DayOfWeek } from "@/types";
import { mockDelay } from "@/services/api-client";
import { getNotificationService } from "@/features/notifications/services/notification-client";
import { MOCK_CLASSROOMS } from "@/services/classroom-service";
import type {
  StudentAcademicContext,
  StudentClassroomHint,
  StudentClassSession,
  StudentDashboardOverview,
} from "../types";
import {
  filterSessionsByDay,
  MOCK_CHANGE_ALERTS,
  MOCK_STUDENT_CONTEXT,
  MOCK_WEEKLY_SESSIONS,
} from "./mock/mock-student-dashboard";

/**
 * Student dashboard data port.
 * Replace this module's implementation with campus API calls; keep the method
 * signatures so overview / timetable pages stay unchanged.
 */
export interface StudentDashboardService {
  getOverview(): Promise<StudentDashboardOverview>;
  getWeeklyTimetable(day?: DayOfWeek | "ALL"): Promise<StudentClassSession[]>;
  searchClassrooms(query: string): Promise<StudentClassroomHint[]>;
  getAcademicContext(): Promise<StudentAcademicContext>;
}

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
    await mockDelay(280);
    const needle = query.trim().toLowerCase();
    return MOCK_CLASSROOMS.filter((room) => {
      if (!needle) return true;
      return (
        room.roomNumber.toLowerCase().includes(needle) ||
        room.name.toLowerCase().includes(needle) ||
        room.block.toLowerCase().includes(needle) ||
        String(room.floor).includes(needle)
      );
    }).map((room) => ({
      id: room.id,
      roomCode: room.roomNumber,
      name: room.name,
      building: room.block,
      floor: room.floor,
      campusId: room.campusId,
      status: room.status,
      capacity: room.capacity,
    }));
  }

  async getAcademicContext(): Promise<StudentAcademicContext> {
    await mockDelay(180);
    return MOCK_STUDENT_CONTEXT;
  }
}

export const studentDashboardService: StudentDashboardService = new MockStudentDashboardService();
