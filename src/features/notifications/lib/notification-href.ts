import type { Notification, UserRole } from "@/types";

function rolePrefix(role: UserRole): "/student" | "/faculty" | "/admin" {
  if (role === "STUDENT") return "/student";
  if (role === "FACULTY") return "/faculty";
  return "/admin";
}

function withQuery(path: string, params?: Record<string, string>): string {
  if (!params) return path;
  const search = new URLSearchParams(params);
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

/**
 * Resolves a role-aware inbox destination for a notice target.
 */
export function resolveNotificationHref(notification: Notification, role: UserRole): string {
  const prefix = rolePrefix(role);
  const { entityType, entityId, params } = notification.target;

  switch (entityType) {
    case "BOOKING":
      if (role === "FACULTY" && entityId) return `/faculty/bookings/${entityId}`;
      if (role === "ADMIN" || role === "SUPER_ADMIN") return "/admin/approvals";
      return `${prefix}/dashboard`;
    case "TIMETABLE":
      if (role === "STUDENT") return withQuery("/student/timetable", params);
      if (role === "FACULTY") return "/faculty/schedule";
      return "/admin/timetable";
    case "CLASSROOM":
      if (role === "STUDENT") return withQuery("/student/find-classroom", params);
      if (role === "FACULTY") return withQuery("/faculty/classrooms", params);
      return withQuery("/admin/classrooms", params);
    case "APPROVALS":
      return role === "ADMIN" || role === "SUPER_ADMIN" ? "/admin/approvals" : `${prefix}/dashboard`;
    default:
      return `${prefix}/notifications`;
  }
}

export function notificationInboxPath(role: UserRole): string {
  return `${rolePrefix(role)}/notifications`;
}
