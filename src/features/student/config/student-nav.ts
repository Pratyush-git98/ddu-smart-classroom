import {
  Bell,
  CalendarDays,
  LayoutDashboard,
  MapPinned,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface StudentNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match?: string;
}

export const STUDENT_NAV: StudentNavItem[] = [
  { label: "Overview", href: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Timetable", href: "/student/timetable", icon: CalendarDays },
  { label: "Find Classroom", href: "/student/find-classroom", icon: MapPinned },
  { label: "Notifications", href: "/student/notifications", icon: Bell },
  { label: "Profile", href: "/student/profile", icon: UserRound },
];

export function isStudentNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
