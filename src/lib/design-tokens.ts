/**
 * Design Tokens for DDUGU Smart Classroom Management System
 * Unified tokens for the academic SaaS design system:
 * - Dark navy sidebar (#0F172A / slate-900 palette)
 * - Light neutral content area (#F8FAFC)
 * - Subtle academic blue accents (#1D4ED8 / #2563EB)
 * - High accessibility contrast ratios (WCAG AAA/AA compliant)
 */

export const DDUGU_BRAND = {
  name: "Deen Dayal Upadhyaya Gorakhpur University",
  shortName: "DDUGU",
  hindiName: "दीनदयाल उपाध्याय गोरखपुर विश्वविद्यालय",
  motto: "आ नो भद्राः क्रतवो यन्तु विश्वतः (Let noble thoughts come to us from every side)",
  established: 1957,
  accreditation: "NAAC A++ Grade Accredited",
  location: "Gorakhpur, Uttar Pradesh, India",
  portalName: "Smart Classroom & Facility Management System",
} as const;

export const CAMPUS_FACILITIES = {
  IET: {
    id: "IET" as const,
    name: "Institute of Engineering & Technology",
    shortCode: "IET",
    description: "Engineering & Applied Sciences Campus with modern smart labs & seminar halls",
    wings: ["Block A (CSE & IT)", "Block B (ECE & EE)", "Block C (ME & Civil)", "Central Computing Facility"],
    badgeClass: "bg-blue-900/10 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    accentColor: "#1d4ed8",
    totalClassrooms: 42,
    activeSensors: 168,
  },
  DEEKSHA_BHAWAN: {
    id: "DEEKSHA_BHAWAN" as const,
    name: "Deeksha Bhawan Academic Complex",
    shortCode: "DB",
    description: "Central Academic Complex featuring tiered smart Lecture Theatres (LT-1 to LT-6) and Convocation Auditorium",
    wings: ["Ground Floor (LT-1, LT-2)", "First Floor (LT-3, LT-4)", "Second Floor (LT-5, LT-6)", "Central Auditorium Wing"],
    badgeClass: "bg-indigo-900/10 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
    accentColor: "#4338ca",
    totalClassrooms: 28,
    activeSensors: 112,
  },
} as const;

export type CampusId = keyof typeof CAMPUS_FACILITIES;

export const ROOM_STATUS_CONFIG = {
  AVAILABLE: {
    label: "Available",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    dotClass: "bg-emerald-500",
  },
  OCCUPIED: {
    label: "In Session",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
    dotClass: "bg-blue-500",
  },
  RESERVED: {
    label: "Reserved",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    dotClass: "bg-amber-500",
  },
  MAINTENANCE: {
    label: "Maintenance",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    dotClass: "bg-rose-500",
  },
} as const;

export const BOOKING_STATUS_CONFIG = {
  PENDING: {
    label: "Pending Review",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  APPROVED: {
    label: "Approved",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  REJECTED: {
    label: "Rejected",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
  },
  COMPLETED: {
    label: "Completed",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  CONFLICT_DETECTED: {
    label: "Conflict detected",
    badgeClass: "bg-orange-50 text-orange-800 border-orange-200",
  },
} as const;

export const USER_ROLES = {
  STUDENT: {
    id: "STUDENT" as const,
    label: "Student",
    description: "View timetable, locate smart classrooms, view live room occupancy",
    color: "blue",
  },
  FACULTY: {
    id: "FACULTY" as const,
    label: "Faculty",
    description: "Request room allocations, access IoT controls, schedule lectures & exams",
    color: "indigo",
  },
  ADMIN: {
    id: "ADMIN" as const,
    label: "Department Admin / Dean",
    description: "Approve bookings, manage clash matrices, assign semester master timetables",
    color: "violet",
  },
  SUPER_ADMIN: {
    id: "SUPER_ADMIN" as const,
    label: "Central University Admin",
    description: "Campus-wide facility management, sensor telemetry, system auditing",
    color: "slate",
  },
} as const;

