import type { CampusLocationId } from "./campus";

export type UserRole = "STUDENT" | "FACULTY" | "ADMIN" | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentCode: string;
  departmentName: string;
  primaryCampus: CampusLocationId;
  rollNumber?: string;
  designation?: string;
  avatarUrl?: string;
}

export interface UserSession {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token?: string;
}

