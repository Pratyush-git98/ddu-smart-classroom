import type { CampusLocationId } from "./campus";

/**
 * Institutional roles recognized by the Smart Classroom portal.
 *
 * Authorization for these roles MUST be enforced by the campus backend / SSO
 * (CAS, SAML, OIDC). Frontend role checks are UX and routing only.
 */
export type UserRole = "STUDENT" | "FACULTY" | "ADMIN" | "SUPER_ADMIN";

export interface UserBase {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  departmentCode: string;
  departmentName: string;
  primaryCampus: CampusLocationId;
  avatarUrl?: string;
  emailVerified: boolean;
  isActive: boolean;
}

export interface StudentProfile {
  enrollmentNumber: string;
  rollNumber: string;
  branch: string;
  academicYear: string;
  semester: number;
  batch: string;
  section: string;
  program: string;
}

export interface FacultyProfile {
  employeeId: string;
  designation: string;
  isHod: boolean;
  coursesAssigned: string[];
}

export interface AdminProfile {
  employeeId: string;
  designation: string;
  office: string;
  clearanceLevel: "DEPARTMENT" | "CAMPUS" | "UNIVERSITY";
}

export interface StudentUser extends UserBase {
  role: "STUDENT";
  profile: StudentProfile;
}

export interface FacultyUser extends UserBase {
  role: "FACULTY";
  profile: FacultyProfile;
}

export interface AdminUser extends UserBase {
  role: "ADMIN" | "SUPER_ADMIN";
  profile: AdminProfile;
}

/** Discriminated union of authenticated portal identities. */
export type User = StudentUser | FacultyUser | AdminUser;

/**
 * @deprecated Prefer `User`. Kept as an alias so existing preview components
 * continue to type-check while the portal migrates to profile-aware models.
 */
export type AuthUser = User;

export type AuthSessionStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "expired"
  | "refreshing";

/**
 * Frontend session envelope.
 *
 * Intentionally omits passwords and access tokens. Production sessions MUST
 * live in httpOnly, Secure, SameSite cookies issued by the identity provider.
 */
export interface UserSession {
  user: User | null;
  isAuthenticated: boolean;
  status: AuthSessionStatus;
  issuedAt: string | null;
  expiresAt: string | null;
}

export function isStudentUser(user: User): user is StudentUser {
  return user.role === "STUDENT";
}

export function isFacultyUser(user: User): user is FacultyUser {
  return user.role === "FACULTY";
}

export function isAdminUser(user: User): user is AdminUser {
  return user.role === "ADMIN" || user.role === "SUPER_ADMIN";
}
