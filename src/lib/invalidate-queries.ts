import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

export async function invalidateAfterBookingMutation(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.faculty }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.admin }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.student }),
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
  ]);
}

export async function invalidateAfterClassroomMutation(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.timetable.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.admin }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.faculty }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.student }),
  ]);
}

export async function invalidateAfterTimetableChange(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.timetable.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.student }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.faculty }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.admin }),
  ]);
}

export async function invalidateNotificationViews(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.student }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.faculty }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboards.admin }),
  ]);
}
