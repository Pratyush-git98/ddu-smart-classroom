import type { User, UserRole } from "@/types";

/**
 * Canonical post-login destinations.
 * Role-specific layouts additionally enforce these prefixes.
 */
export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  STUDENT: "/student/dashboard",
  FACULTY: "/faculty/dashboard",
  ADMIN: "/admin/dashboard",
  SUPER_ADMIN: "/admin/dashboard",
};

export const ROLE_AREA_PREFIXES: Record<UserRole, string> = {
  STUDENT: "/student",
  FACULTY: "/faculty",
  ADMIN: "/admin",
  SUPER_ADMIN: "/admin",
};

export const PUBLIC_AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
  "/unauthorized",
] as const;

export function getDashboardPath(role: UserRole): string {
  return ROLE_DASHBOARD_PATHS[role];
}

export function getDashboardPathForUser(user: User): string {
  return getDashboardPath(user.role);
}

export function canAccessRoleArea(userRole: UserRole, area: UserRole): boolean {
  if (userRole === area) return true;
  if (userRole === "SUPER_ADMIN" && area === "ADMIN") return true;
  return false;
}

export function isPublicAuthPath(pathname: string): boolean {
  return PUBLIC_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
