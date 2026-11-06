import type { AdminUser, FacultyUser, StudentUser, User } from "@/types";
import type { DemoCredential } from "../../types";

/**
 * Frontend-only demonstration identities.
 * Passwords exist solely to exercise the login form and are never persisted.
 */
export const MOCK_SESSION_TTL_MS = 30 * 60 * 1000;

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

const MOCK_STUDENT: StudentUser = {
  id: "usr-std-01",
  displayName: "Aditya Verma",
  email: "student@ddugu.ac.in",
  role: "STUDENT",
  departmentCode: "CSE",
  departmentName: "Computer Science & Engineering",
  primaryCampus: "IET",
  emailVerified: true,
  isActive: true,
  profile: {
    enrollmentNumber: "DDU/IET/2023/042",
    rollNumber: "2024CS042",
    branch: "CSE",
    academicYear: "3rd Year",
    semester: 5,
    batch: "2023-2027",
    section: "A",
    program: "B.Tech Computer Science & Engineering",
  },
};

const MOCK_FACULTY: FacultyUser = {
  id: "usr-fac-01",
  displayName: "Dr. Arvind Tripathi",
  email: "faculty@ddugu.ac.in",
  role: "FACULTY",
  departmentCode: "CSE",
  departmentName: "Computer Science & Engineering",
  primaryCampus: "IET",
  emailVerified: true,
  isActive: true,
  profile: {
    employeeId: "DDU-FAC-101",
    designation: "Professor & Head of Department",
    isHod: true,
    coursesAssigned: ["KCS-501", "KCS-502"],
  },
};

const MOCK_ADMIN: AdminUser = {
  id: "usr-adm-01",
  displayName: "Prof. Sudhir Srivastava",
  email: "admin@ddugu.ac.in",
  role: "ADMIN",
  departmentCode: "ACAD",
  departmentName: "Office of the Dean Academics",
  primaryCampus: "DEEKSHA_BHAWAN",
  emailVerified: true,
  isActive: true,
  profile: {
    employeeId: "DDU-ADM-001",
    designation: "Dean of Academic Affairs",
    office: "Deeksha Bhawan Academic Complex",
    clearanceLevel: "CAMPUS",
  },
};

export const MOCK_DIRECTORY: Record<string, { password: string; user: User }> = {
  "student@ddugu.ac.in": { password: "Student@1234", user: MOCK_STUDENT },
  "faculty@ddugu.ac.in": { password: "Faculty@1234", user: MOCK_FACULTY },
  "admin@ddugu.ac.in": { password: "Admin@1234", user: MOCK_ADMIN },
};

export function buildGuestUser(email: string, role: User["role"]): User {
  const localPart = email.split("@")[0]?.replace(".", " ") ?? "University Member";
  const displayName = localPart.replace(/\b\w/g, (c) => c.toUpperCase());

  if (role === "STUDENT") {
    const student: StudentUser = {
      id: `usr-std-${Date.now()}`,
      displayName,
      email,
      role: "STUDENT",
      departmentCode: "IET-GEN",
      departmentName: "Faculty of Technology",
      primaryCampus: "IET",
      emailVerified: true,
      isActive: true,
      profile: {
        enrollmentNumber: "PENDING",
        rollNumber: "PENDING",
        branch: "GEN",
        academicYear: "1st Year",
        semester: 1,
        batch: "2026-2030",
        section: "A",
        program: "Undergraduate Programme",
      },
    };
    return student;
  }

  if (role === "FACULTY") {
    const faculty: FacultyUser = {
      id: `usr-fac-${Date.now()}`,
      displayName,
      email,
      role: "FACULTY",
      departmentCode: "IET-GEN",
      departmentName: "Faculty of Technology",
      primaryCampus: "IET",
      emailVerified: true,
      isActive: true,
      profile: {
        employeeId: "DDU-FAC-GUEST",
        designation: "Assistant Professor",
        isHod: false,
        coursesAssigned: [],
      },
    };
    return faculty;
  }

  const admin: AdminUser = {
    id: `usr-adm-${Date.now()}`,
    displayName,
    email,
    role: role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "ADMIN",
    departmentCode: "ACAD",
    departmentName: "Office of the Dean Academics",
    primaryCampus: "DEEKSHA_BHAWAN",
    emailVerified: true,
    isActive: true,
    profile: {
      employeeId: "DDU-ADM-GUEST",
      designation: "Academic Administrator",
      office: "Central Academic Office",
      clearanceLevel: role === "SUPER_ADMIN" ? "UNIVERSITY" : "DEPARTMENT",
    },
  };
  return admin;
}
