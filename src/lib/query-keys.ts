import type { ClassroomAvailabilityQuery, ClassroomSearchFilters, NotificationQuery } from "@/types";
import { serializeClassroomSearchFilters } from "@/features/classrooms/lib/default-filters";

function serializeNotificationQuery(query: NotificationQuery): string {
  return JSON.stringify({
    recipientId: query.recipientId ?? null,
    role: query.role ?? null,
    category: query.category ?? null,
    severity: query.severity ?? null,
    unreadOnly: Boolean(query.unreadOnly),
  });
}

/**
 * Canonical TanStack Query keys.
 *
 * Prefix-based trees let mutations invalidate a whole domain
 * (`queryKeys.classrooms.all`) without listing every consumer.
 */
export const queryKeys = {
  classrooms: {
    all: ["classrooms"] as const,
    catalog: () => [...queryKeys.classrooms.all, "catalog"] as const,
    buildings: (campusId: string) => [...queryKeys.classrooms.all, "buildings", campusId] as const,
    search: (filters: ClassroomSearchFilters) =>
      [...queryKeys.classrooms.all, "search", serializeClassroomSearchFilters(filters)] as const,
    locator: (audience: "student" | "faculty", query: string) =>
      [...queryKeys.classrooms.all, "locator", audience, query.trim().toLowerCase()] as const,
    detail: (id: string) => [...queryKeys.classrooms.all, "detail", id] as const,
    availability: (query: ClassroomAvailabilityQuery) =>
      [...queryKeys.classrooms.all, "availability", query.classroomId, query.date, query.startTime, query.endTime] as const,
  },
  timetable: {
    all: ["timetable"] as const,
    student: (userId?: string) => [...queryKeys.timetable.all, "student", userId ?? "anonymous"] as const,
    faculty: (userId?: string) => [...queryKeys.timetable.all, "faculty", userId ?? "anonymous"] as const,
    admin: () => [...queryKeys.timetable.all, "admin"] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    list: (scope: string, actorId?: string) =>
      [...queryKeys.bookings.all, "list", scope, actorId ?? "anonymous"] as const,
    detail: (id: string, actorId?: string) =>
      [...queryKeys.bookings.all, "detail", id, actorId ?? "anonymous"] as const,
    adminApprovals: (serializedQuery: string) =>
      [...queryKeys.bookings.all, "admin-approvals", serializedQuery] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (query: NotificationQuery) =>
      [...queryKeys.notifications.all, "list", serializeNotificationQuery(query)] as const,
    unread: (inbox: Pick<NotificationQuery, "recipientId" | "role">) =>
      [...queryKeys.notifications.all, "unread", inbox.recipientId ?? "anonymous", inbox.role ?? "none"] as const,
    preferences: (userId?: string) => [...queryKeys.notifications.all, "preferences", userId ?? "anonymous"] as const,
    admin: () => [...queryKeys.notifications.all, "admin"] as const,
  },
  profiles: {
    all: ["profiles"] as const,
    student: (userId?: string) => [...queryKeys.profiles.all, "student", userId ?? "anonymous"] as const,
    faculty: (userId?: string) => [...queryKeys.profiles.all, "faculty", userId ?? "anonymous"] as const,
  },
  dashboards: {
    student: ["student-dashboard"] as const,
    faculty: ["faculty-dashboard"] as const,
    admin: ["admin-dashboard"] as const,
  },
} as const;
