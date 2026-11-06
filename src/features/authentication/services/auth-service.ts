import type {
  AuthClientInterface,
  AuthResult,
  DemoCredential,
} from "../types";
import type {
  LoginInput,
  StudentRegistrationInput,
  FacultyRegistrationInput,
  ForgotPasswordInput,
  VerifyEmailInput,
} from "@/schemas/auth";
import { mockDelay } from "@/services/api-client";

/**
 * Realistic Mock Demo Credentials for Frontend Demonstration.
 * Clearly marked for preview and testing purposes.
 */
export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: "STUDENT",
    label: "Undergraduate Student",
    email: "student@ddugu.ac.in",
    passwordHint: "Student@1234",
    department: "Computer Science & Engineering",
    campus: "IET",
    description: "B.Tech CSE 5th Semester • Section A • Roll No: 2024CS042",
  },
  {
    role: "FACULTY",
    label: "Department Faculty / HOD",
    email: "faculty@ddugu.ac.in",
    passwordHint: "Faculty@1234",
    department: "Computer Science & Engineering",
    campus: "IET",
    description: "Dr. Arvind Tripathi • Professor & Head • Emp ID: DDU-FAC-101",
  },
  {
    role: "ADMIN",
    label: "Dean / Academic Admin",
    email: "admin@ddugu.ac.in",
    passwordHint: "Admin@1234",
    department: "Office of the Dean Academics",
    campus: "DEEKSHA_BHAWAN",
    description: "Central Academic Complex • Clash Matrix & Timetable Overrides",
  },
];

/**
 * MockAuthService
 *
 * NOTE FOR PRODUCTION:
 * This service encapsulates frontend authentication demonstrations.
 * In a production deployment:
 * 1. Passwords and credentials MUST be posted over HTTPS directly to the DDUGU SAML/CAS
 *    Identity Provider or secure OAuth2/OIDC token endpoint.
 * 2. Secure HTTP-only, SameSite cookies MUST be utilized for session tokens.
 * 3. Never store credentials, passwords or JWTs in browser localStorage/sessionStorage.
 */
class MockAuthService implements AuthClientInterface {
  async login(credentials: LoginInput): Promise<AuthResult> {
    await mockDelay(750); // Simulate network latency

    const email = credentials.email.trim().toLowerCase();

    // Check against demo accounts
    if (email === "student@ddugu.ac.in") {
      return {
        success: true,
        message: "Institutional authentication successful. Welcome back, Student.",
        user: {
          id: "usr-std-01",
          name: "Aditya Verma",
          email: "student@ddugu.ac.in",
          role: "STUDENT",
          departmentCode: "CSE",
          departmentName: "Computer Science & Engineering",
          primaryCampus: "IET",
          rollNumber: "2024CS042",
        },
      };
    }

    if (email === "faculty@ddugu.ac.in") {
      return {
        success: true,
        message: "Institutional authentication successful. Welcome, Professor.",
        user: {
          id: "usr-fac-01",
          name: "Dr. Arvind Tripathi",
          email: "faculty@ddugu.ac.in",
          role: "FACULTY",
          departmentCode: "CSE",
          departmentName: "Computer Science & Engineering",
          primaryCampus: "IET",
          designation: "Professor & Head of Department",
        },
      };
    }

    if (email === "admin@ddugu.ac.in") {
      return {
        success: true,
        message: "Administrative clearance confirmed. Welcome, Dean Academics.",
        user: {
          id: "usr-adm-01",
          name: "Prof. Sudhir Srivastava",
          email: "admin@ddugu.ac.in",
          role: "ADMIN",
          departmentCode: "ACAD",
          departmentName: "Office of the Dean Academics",
          primaryCampus: "DEEKSHA_BHAWAN",
          designation: "Dean of Academic Affairs",
        },
      };
    }

    // Default institutional acceptance for any @ddugu.ac.in address during demo
    if (email.endsWith("@ddugu.ac.in") || email.endsWith(".ac.in")) {
      return {
        success: true,
        message: "University Identity Provider verified your credentials.",
        user: {
          id: `usr-demo-${Date.now()}`,
          name: email.split("@")[0].replace(".", " ").toUpperCase(),
          email,
          role: credentials.role,
          departmentCode: "IET-GEN",
          departmentName: "Faculty of Technology",
          primaryCampus: "IET",
        },
      };
    }

    return {
      success: false,
      errorCode: "INVALID_CREDENTIALS",
      message: "Invalid institutional credentials. Please verify your @ddugu.ac.in email and password.",
    };
  }

  async registerStudent(data: StudentRegistrationInput): Promise<AuthResult> {
    await mockDelay(900);

    return {
      success: true,
      requiresEmailVerification: true,
      verificationEmail: data.email,
      message: `Registration pre-approved for ${data.fullName}. A 6-digit confirmation code has been dispatched to your official student webmail (${data.email}).`,
      user: {
        id: `std-${Date.now()}`,
        name: data.fullName,
        email: data.email,
        role: "STUDENT",
        departmentCode: data.branch,
        departmentName: data.department,
        primaryCampus: "IET",
        rollNumber: data.enrollmentNumber,
      },
    };
  }

  async registerFaculty(data: FacultyRegistrationInput): Promise<AuthResult> {
    await mockDelay(900);

    return {
      success: true,
      requiresEmailVerification: true,
      verificationEmail: data.email,
      message: `Faculty profile registered for ${data.fullName}. Verification link and OTP dispatched to ${data.email}. Academic clearance will sync upon verification.`,
      user: {
        id: `fac-${Date.now()}`,
        name: data.fullName,
        email: data.email,
        role: "FACULTY",
        departmentCode: "DEPT",
        departmentName: data.department,
        primaryCampus: "IET",
        designation: data.designation,
      },
    };
  }

  async requestPasswordReset(input: ForgotPasswordInput): Promise<{ success: boolean; message: string }> {
    await mockDelay(650);

    return {
      success: true,
      message: `Password reset instructions and security token have been transmitted to ${input.email}. Check your DDUGU institutional webmail inbox or spam folder.`,
    };
  }

  async verifyEmailOtp(input: VerifyEmailInput): Promise<{ success: boolean; message: string }> {
    await mockDelay(600);

    // In demo mode: accept 123456 or any 6-digit numeric OTP
    if (input.otp === "000000") {
      return {
        success: false,
        message: "The verification code entered has expired. Please request a fresh OTP.",
      };
    }

    return {
      success: true,
      message: "Institutional email address verified successfully! Your academic profile is now activated.",
    };
  }

  async resendVerificationOtp(email: string): Promise<{ success: boolean; message: string }> {
    await mockDelay(500);

    return {
      success: true,
      message: `A new 6-digit verification code has been dispatched to ${email}.`,
    };
  }

  async logout(): Promise<void> {
    await mockDelay(200);
    // Explicitly avoids localStorage tokens. In real implementation, invokes POST /api/auth/logout
  }
}

export const authService = new MockAuthService();

