import {
  Bell,
  Bookmark,
  CalendarDays,
  History,
  LayoutDashboard,
  MapPinned,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface FacultyNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const FACULTY_NAV: FacultyNavItem[] = [
  { label: "Overview", href: "/faculty/dashboard", icon: LayoutDashboard },
  { label: "My Schedule", href: "/faculty/schedule", icon: CalendarDays },
  { label: "Find Classroom", href: "/faculty/find-classroom", icon: MapPinned },
  { label: "My Bookings", href: "/faculty/bookings", icon: Bookmark },
  { label: "Booking History", href: "/faculty/bookings/history", icon: History },
  { label: "Notifications", href: "/faculty/notifications", icon: Bell },
  { label: "Profile", href: "/faculty/profile", icon: UserRound },
];

export function isFacultyNavActive(pathname: string, href: string): boolean {
  if (href === "/faculty/bookings") {
    return pathname === "/faculty/bookings";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
