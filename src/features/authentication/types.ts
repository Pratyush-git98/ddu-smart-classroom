import type { UserRole, CampusLocationId, AuthUser } from "@/types";
import type {
  LoginInput,
  StudentRegistrationInput,
  FacultyRegistrationInput,
  ForgotPasswordInput,
  VerifyEmailInput,
} from "@/schemas/auth";

export type { UserRole, CampusLocationId, AuthUser };

/**
 * Result returned by authentication operations.
 * Explicitly designed for future backend API / Campus SSO consumption.
 */
export interface AuthResult {
  success: boolean;
  message: string;
  user?: AuthUser;
  requiresEmailVerification?: boolean;
  verificationEmail?: string;
  errorCode?: "INVALID_CREDENTIALS" | "USER_NOT_FOUND" | "EMAIL_NOT_VERIFIED" | "ACCOUNT_LOCKED" | "UNAUTHORIZED_ROLE";
}

/**
 * Interface for backend Authentication & SSO adapters.
 * Future SSO (CAS / SAML / OAuth 2.0 / Shibboleth) or REST microservices
 * must implement this contract.
 */
export interface AuthClientInterface {
  login(credentials: LoginInput): Promise<AuthResult>;
  registerStudent(data: StudentRegistrationInput): Promise<AuthResult>;
  registerFaculty(data: FacultyRegistrationInput): Promise<AuthResult>;
  requestPasswordReset(input: ForgotPasswordInput): Promise<{ success: boolean; message: string }>;
  verifyEmailOtp(input: VerifyEmailInput): Promise<{ success: boolean; message: string }>;
  resendVerificationOtp(email: string): Promise<{ success: boolean; message: string }>;
  logout(): Promise<void>;
}

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

/**
 * Password Strength Metrics
 */
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
