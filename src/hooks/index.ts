export * from "./use-media-query";
export * from "./use-debounce";
export * from "./use-campus-selection";
export * from "./use-auth";
export {
  useClassroomSearch,
  useClassroomCatalog,
  useClassroomBuildings,
  useClassroom,
  useClassroomAvailability,
  useConfirmClassroomAvailability,
} from "@/features/classrooms/hooks/use-classroom-search";
export {
  useStudentTimetable,
  useStudentAcademicContext,
  useStudentOverview,
} from "@/features/student/hooks/use-student-dashboard";
export {
  useFacultySchedule,
  useFacultyBookings,
  useFacultyBooking,
  useFacultyProfile,
  useFacultyBookingCommands,
} from "@/features/faculty/hooks/use-faculty-dashboard";
export {
  useNotifications,
  useUnreadNotificationCount,
  useNotificationPreferences,
} from "@/features/notifications/hooks/use-notifications";

