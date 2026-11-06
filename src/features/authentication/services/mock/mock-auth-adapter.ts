import type { AuthResult, AuthService, AuthSessionSnapshot } from "../auth-service.interface";
import type {
  LoginInput,
  StudentRegistrationInput,
  FacultyRegistrationInput,
  ForgotPasswordInput,
  VerifyEmailInput,
} from "@/schemas/auth";
import { mockDelay } from "@/services/api-client";
import {
  buildGuestUser,
  MOCK_DIRECTORY,
} from "./mock-users";
import {
  clearMockSession,
  createMockSession,
  readMockSession,
  refreshMockSession,
} from "./mock-session-store";

/**
 * Isolated mock authentication adapter.
 *
 * Pages must not import this file. Obtain an AuthService from `getAuthService()`
 * so campus SSO or a secure API can replace this class without rewriting UI.
 */
export class MockAuthAdapter implements AuthService {
  async login(credentials: LoginInput): Promise<AuthResult> {
    await mockDelay(650);

    const email = credentials.email.trim().toLowerCase();
    const directoryEntry = MOCK_DIRECTORY[email];

    if (directoryEntry) {
      if (directoryEntry.password !== credentials.password) {
        return {
          success: false,
          errorCode: "INVALID_CREDENTIALS",
          message:
            "Invalid institutional credentials. Please verify your @ddugu.ac.in email and password.",
        };
      }

      const session = createMockSession(directoryEntry.user);
      return {
        success: true,
        message: `Institutional authentication successful. Welcome, ${directoryEntry.user.displayName}.`,
        user: directoryEntry.user,
        session,
      };
    }

    if (email.endsWith("@ddugu.ac.in") || email.endsWith(".ac.in")) {
      const user = buildGuestUser(email, credentials.role);
      const session = createMockSession(user);
      return {
        success: true,
        message: "University Identity Provider verified your credentials (demo adapter).",
        user,
        session,
      };
    }

    return {
      success: false,
      errorCode: "INVALID_CREDENTIALS",
      message:
        "Invalid institutional credentials. Please verify your @ddugu.ac.in email and password.",
    };
  }

  async logout(): Promise<void> {
    await mockDelay(180);
    clearMockSession();
  }

  async getSession(): Promise<AuthSessionSnapshot> {
    await mockDelay(120);
    return readMockSession();
  }

  async refreshSession(): Promise<AuthSessionSnapshot> {
    await mockDelay(200);
    const current = readMockSession();
    if (!current.user) {
      return current;
    }
    if (current.isExpired) {
      return current;
    }
    return refreshMockSession();
  }

  async registerStudent(data: StudentRegistrationInput): Promise<AuthResult> {
    await mockDelay(900);

    return {
      success: true,
      requiresEmailVerification: true,
      verificationEmail: data.email,
      message: `Registration pre-approved for ${data.fullName}. A 6-digit confirmation code has been dispatched to your official student webmail (${data.email}).`,
    };
  }

  async registerFaculty(data: FacultyRegistrationInput): Promise<AuthResult> {
    await mockDelay(900);

    return {
      success: true,
      requiresEmailVerification: true,
      verificationEmail: data.email,
      message: `Faculty profile registered for ${data.fullName}. Verification link and OTP dispatched to ${data.email}. Academic clearance will sync upon verification.`,
    };
  }

  async requestPasswordReset(
    input: ForgotPasswordInput
  ): Promise<{ success: boolean; message: string }> {
    await mockDelay(650);

    return {
      success: true,
      message: `Password reset instructions have been transmitted to ${input.email}. Check your DDUGU institutional webmail inbox or spam folder.`,
    };
  }

  async verifyEmailOtp(
    input: VerifyEmailInput
  ): Promise<{ success: boolean; message: string }> {
    await mockDelay(600);

    if (input.otp === "000000") {
      return {
        success: false,
        message: "The verification code entered has expired. Please request a fresh OTP.",
      };
    }

    return {
      success: true,
      message:
        "Institutional email address verified successfully! Your academic profile is now activated.",
    };
  }

  async resendVerificationOtp(email: string): Promise<{ success: boolean; message: string }> {
    await mockDelay(500);

    return {
      success: true,
      message: `A new 6-digit verification code has been dispatched to ${email}.`,
    };
  }
}

export const mockAuthAdapter = new MockAuthAdapter();
