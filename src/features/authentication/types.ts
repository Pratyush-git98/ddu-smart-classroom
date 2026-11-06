import type { UserRole, CampusLocationId, User } from "@/types";

export type { UserRole, CampusLocationId, User };
export type {
  AuthResult,
  AuthService,
  AuthSessionSnapshot,
} from "./services/auth-service.interface";

/**
 * Pre-configured demo credentials for university demonstration and reviewer inspection.
 */
export interface DemoCredential {
  role: UserRole;
  label: string;
  email: string;
  passwordHint: string;
  department: string;
  campus: CampusLocationId;
  description: string;
}

export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordRuleStatus {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export interface PasswordStrengthResult {
  score: PasswordStrengthScore;
  label: "Very Weak" | "Weak" | "Fair" | "Good" | "Strong";
  colorClass: string;
  progressPercent: number;
  rules: PasswordRuleStatus;
}
