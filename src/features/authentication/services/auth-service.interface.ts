import type { User, UserSession } from "@/types";
import type {
  LoginInput,
  StudentRegistrationInput,
  FacultyRegistrationInput,
  ForgotPasswordInput,
  VerifyEmailInput,
} from "@/schemas/auth";

/**
 * SECURITY NOTICE
 * ---------------
 * This interface is a frontend contract only. Hiding navigation links or
 * returning early from a React layout is NOT authorization.
 *
 * Production deployments MUST:
 * 1. Authenticate via campus SSO (CAS / SAML / OIDC) or a trusted API.
 * 2. Issue session credentials as httpOnly, Secure, SameSite cookies.
 * 3. Re-authorize every protected API and server route on the backend.
 * 4. Never persist passwords or access tokens in localStorage / sessionStorage.
 *
 * Swap the mock adapter for an SSO/API adapter by changing `getAuthService()`
 * in `auth-client.ts`. Pages and hooks should depend only on this interface.
 */

export interface AuthSessionSnapshot {
  user: User | null;
  issuedAt: string | null;
  expiresAt: string | null;
  isExpired: boolean;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  session?: AuthSessionSnapshot;
  requiresEmailVerification?: boolean;
  verificationEmail?: string;
  errorCode?:
    | "INVALID_CREDENTIALS"
    | "USER_NOT_FOUND"
    | "EMAIL_NOT_VERIFIED"
    | "ACCOUNT_LOCKED"
    | "UNAUTHORIZED_ROLE"
    | "SESSION_EXPIRED";
}

export interface AuthService {
  login(credentials: LoginInput): Promise<AuthResult>;
  logout(): Promise<void>;
  getSession(): Promise<AuthSessionSnapshot>;
  refreshSession(): Promise<AuthSessionSnapshot>;
  registerStudent(data: StudentRegistrationInput): Promise<AuthResult>;
  registerFaculty(data: FacultyRegistrationInput): Promise<AuthResult>;
  requestPasswordReset(input: ForgotPasswordInput): Promise<{ success: boolean; message: string }>;
  verifyEmailOtp(input: VerifyEmailInput): Promise<{ success: boolean; message: string }>;
  resendVerificationOtp(email: string): Promise<{ success: boolean; message: string }>;
}

export type { UserSession };
