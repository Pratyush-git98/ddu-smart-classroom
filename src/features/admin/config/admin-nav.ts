import {
  Bell,
  Building2,
  CalendarClock,
  ClipboardCheck,
  LayoutDashboard,
  ScrollText,
  ShieldAlert,
  Users,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Classrooms", href: "/admin/classrooms", icon: Building2 },
  { label: "Manage Users", href: "/admin/users", icon: Users },
  { label: "Timetable Management", href: "/admin/timetable", icon: CalendarClock },
  { label: "Booking Approvals", href: "/admin/approvals", icon: ClipboardCheck },
  { label: "Classroom Issues", href: "/admin/issues", icon: ShieldAlert },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
];

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin/dashboard") {
    return pathname === "/admin/dashboard" || pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
