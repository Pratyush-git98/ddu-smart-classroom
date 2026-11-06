import type { UserRole } from "@/types";
import {
  BellRing,
  BookOpenCheck,
  CalendarDays,
  Clock,
  GraduationCap,
  LayoutDashboard,
  LayoutGrid,
  Shield,
  type LucideIcon,
} from "lucide-react";

export interface RoleNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  roles: UserRole[];
}

export interface RoleNavGroup {
  group: string;
  items: RoleNavItem[];
}

export const ROLE_NAVIGATION: RoleNavGroup[] = [
  {
    group: "Workspace",
    items: [
      {
        label: "Student Dashboard",
        href: "/student/dashboard",
        icon: GraduationCap,
        roles: ["STUDENT"],
      },
      {
        label: "Faculty Dashboard",
        href: "/faculty/dashboard",
        icon: BookOpenCheck,
        roles: ["FACULTY"],
      },
      {
        label: "Admin Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    group: "Facility Management",
    items: [
      {
        label: "Classrooms & Smart Labs",
        href: "/#classrooms",
        icon: LayoutGrid,
        badge: "70 Total",
        roles: ["STUDENT", "FACULTY", "ADMIN", "SUPER_ADMIN"],
      },
      {
        label: "Booking Requisitions",
        href: "/#bookings",
        icon: CalendarDays,
        roles: ["FACULTY", "ADMIN", "SUPER_ADMIN"],
      },
      {
        label: "Timetable & Shifts",
        href: "/#timetable",
        icon: Clock,
        roles: ["STUDENT", "FACULTY", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    group: "Governance",
    items: [
      {
        label: "Clash Matrix & Analytics",
        href: "/admin/dashboard",
        icon: Shield,
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        label: "Notifications",
        href: "/#notifications",
        icon: BellRing,
        roles: ["STUDENT", "FACULTY", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
];

export function getNavigationForRole(role: UserRole | null): RoleNavGroup[] {
  if (!role) {
    return ROLE_NAVIGATION.map((group) => ({
      ...group,
      items: group.items.filter((item) => item.href.startsWith("/#") || item.href === "/"),
    })).filter((group) => group.items.length > 0);
  }

  return ROLE_NAVIGATION.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.roles.includes(role)),
  })).filter((group) => group.items.length > 0);
}
