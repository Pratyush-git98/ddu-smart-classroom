import type { SystemNotification } from "@/types";
import { mockDelay } from "./api-client";

export const MOCK_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-1",
    title: "Classroom Allocation Approved",
    message: "Deeksha Bhawan DB-LT1 has been confirmed for the MBA Special Lecture tomorrow at 02:00 PM.",
    category: "BOOKING_APPROVAL",
    priority: "NORMAL",
    timestamp: "10 mins ago",
    isRead: false,
    targetRole: "FACULTY",
  },
  {
    id: "notif-2",
    title: "IoT Sensor Alert: DB-LT5 HVAC Servicing",
    message: "Air conditioning telemetry in Deeksha Bhawan LT-5 triggered high-filter alert. Scheduled for technician review.",
    category: "IOT_ALERT",
    priority: "HIGH",
    timestamp: "45 mins ago",
    isRead: false,
    targetRole: "ADMIN",
  },
  {
    id: "notif-3",
    title: "Timetable Rescheduled: KCS-503",
    message: "Design & Analysis of Algorithms period shifted to IET Block A (CR-101) due to lab maintenance.",
    category: "TIMETABLE_RESCHEDULE",
    priority: "HIGH",
    timestamp: "2 hours ago",
    isRead: true,
    targetRole: "STUDENT",
  },
  {
    id: "notif-4",
    title: "Convocation Hall Audio Test Complete",
    message: "Central Auditorium sound array and 4K display verified ready for the 43rd DDUGU Convocation rehearsals.",
    category: "GENERAL_ANNOUNCEMENT",
    priority: "LOW",
    timestamp: "Yesterday",
    isRead: true,
    targetRole: "ALL",
  },
];

export async function getNotifications(): Promise<SystemNotification[]> {
  await mockDelay(40);
  return [...MOCK_NOTIFICATIONS];
}

export async function getUnreadNotificationCount(): Promise<number> {
  await mockDelay(30);
  return MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
}

