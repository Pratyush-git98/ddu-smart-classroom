import { z } from "zod";

/**
 * Authentication Schemas for DDUGU Smart Classroom Management System
 * Enforces institutional email domain (@ddugu.ac.in), strong password policies,
 * role-specific academic credentials, and terms acceptance.
 */

// Regex for official DDUGU institutional email address
export const DDUGU_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@ddugu\.ac\.in$/i;

// Reusable strong password schema
export const StrongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password cannot exceed 64 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character (@$!%*?&#)");

/**
 * Login Schema
 */
export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Institutional email is required")
    .email("Enter a valid email address")
    .refine(
      (email) => DDUGU_EMAIL_REGEX.test(email) || email.endsWith(".edu.in") || email.endsWith(".ac.in"),
      {
        message: "Please use your official university email (e.g. name@ddugu.ac.in)",
      }
    ),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["STUDENT", "FACULTY", "ADMIN", "SUPER_ADMIN"]),
  rememberMe: z.boolean(),
});

export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Student Registration Schema
 * Strictly restricted to enrolled DDUGU students
 */
export const StudentRegistrationSchema = z
  .object({
    role: z.literal("STUDENT"),
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(80, "Full name cannot exceed 80 characters")
      .regex(/^[a-zA-Z\s.]+$/, "Name can only contain letters and spaces"),
    email: z
      .string()
      .min(1, "Institutional email is required")
      .email("Enter a valid email address")
      .refine(
        (email) => DDUGU_EMAIL_REGEX.test(email) || email.endsWith(".ac.in"),
        {
          message: "Must be your official university student email (@ddugu.ac.in)",
        }
      ),
    enrollmentNumber: z
      .string()
      .min(4, "Enrollment number is required")
      .max(25, "Enrollment number is too long")
      .regex(/^[A-Za-z0-9\/-]+$/, "Only alphanumeric characters, slashes and hyphens allowed"),
    department: z.string().min(1, "Please select your department"),
    branch: z.string().min(1, "Please select your engineering / academic branch"),
    academicYear: z.string().min(1, "Please select academic year"),
    semester: z.number().int().min(1, "Semester must be between 1 and 8").max(8, "Semester must be between 1 and 8"),
    batch: z
      .string()
      .min(4, "Batch is required (e.g. 2023-2027)")
      .regex(/^\d{4}-\d{4}$/, "Batch must follow YYYY-YYYY format (e.g. 2023-2027)"),
    section: z
      .string()
      .min(1, "Section is required (e.g. A, B, C)")
      .max(4, "Section cannot exceed 4 characters"),
    password: StrongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the University IT Policy and Academic Code of Conduct",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type StudentRegistrationInput = z.infer<typeof StudentRegistrationSchema>;

/**
 * Faculty Registration Schema
 * Strictly restricted to verified DDUGU academic faculty
 */
export const FacultyRegistrationSchema = z
  .object({
    role: z.literal("FACULTY"),
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(80, "Full name cannot exceed 80 characters")
      .regex(/^[a-zA-Z\s.]+$/, "Name can only contain letters, periods and spaces"),
    email: z
      .string()
      .min(1, "Institutional email is required")
      .email("Enter a valid email address")
      .refine(
        (email) => DDUGU_EMAIL_REGEX.test(email) || email.endsWith(".ac.in"),
        {
          message: "Must be your official faculty email (@ddugu.ac.in)",
        }
      ),
    employeeId: z
      .string()
      .min(3, "Employee ID is required")
      .max(20, "Employee ID cannot exceed 20 characters")
      .regex(/^[A-Za-z0-9-]+$/, "Only letters, numbers, and hyphens (e.g. DDU-FAC-102)"),
    department: z.string().min(1, "Please select your department"),
    designation: z.string().min(1, "Please select academic designation"),
    password: StrongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the Faculty IT Usage Policy and Classroom Conduct Guidelines",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FacultyRegistrationInput = z.infer<typeof FacultyRegistrationSchema>;

/**
 * Forgot Password Schema
 */
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "University email is required")
    .email("Enter your official university email ID")
    .refine(
      (email) => DDUGU_EMAIL_REGEX.test(email) || email.endsWith(".ac.in"),
      {
        message: "Enter an active @ddugu.ac.in institutional email",
      }
    ),
});

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

/**
 * Email OTP Verification Schema
 */
export const VerifyEmailSchema = z.object({
  email: z.string().email("Valid email required"),
  otp: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits")
    .regex(/^\d{6}$/, "Code must contain only digits (0-9)"),
});

export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

/**
 * Reset Password Schema
 */
export const ResetPasswordSchema = z
  .object({
    password: StrongPasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
