import type {
  BookingRequest,
  ConflictCheckResult,
} from "@/types";
import type { CreateBookingInput } from "@/schemas";
import { mockDelay } from "./api-client";

export const MOCK_BOOKINGS: BookingRequest[] = [
  {
    id: "bk-101",
    classroomId: "iet-cs-101",
    roomNumber: "CR-101",
    campusId: "IET",
    facultyId: "fac-101",
    facultyName: "Dr. Arvind Tripathi",
    departmentCode: "CSE",
    purpose: "REGULAR_CLASS",
    title: "Operating Systems Lecture (KCS-501)",
    slot: {
      date: "2026-11-06",
      startTime: "10:00",
      endTime: "11:00",
    },
    attendeesCount: 65,
    status: "APPROVED",
    createdAt: "2026-11-05T09:00:00Z",
    updatedAt: "2026-11-05T10:15:00Z",
  },
  {
    id: "bk-102",
    classroomId: "db-lt-01",
    roomNumber: "DB-LT1",
    campusId: "DEEKSHA_BHAWAN",
    facultyId: "fac-104",
    facultyName: "Prof. Sudhir Srivastava",
    departmentCode: "MGMT",
    purpose: "SEMINAR",
    title: "Business Analytics & AI in Economics Workshop",
    slot: {
      date: "2026-11-06",
      startTime: "14:00",
      endTime: "16:00",
    },
    attendeesCount: 130,
    status: "APPROVED",
    createdAt: "2026-11-04T11:20:00Z",
    updatedAt: "2026-11-04T12:00:00Z",
  },
  {
    id: "bk-103",
    classroomId: "iet-sh-01",
    roomNumber: "IET-SH1",
    campusId: "IET",
    facultyId: "fac-109",
    facultyName: "Dr. Meenakshi Rai",
    departmentCode: "ECE",
    purpose: "WORKSHOP",
    title: "Hands-on VLSI & Semiconductor Design Bootcamp",
    slot: {
      date: "2026-11-07",
      startTime: "11:00",
      endTime: "13:00",
    },
    attendeesCount: 180,
    status: "PENDING",
    createdAt: "2026-11-06T08:30:00Z",
    updatedAt: "2026-11-06T08:30:00Z",
  },
  {
    id: "bk-104",
    classroomId: "db-lt-03",
    roomNumber: "DB-LT3",
    campusId: "DEEKSHA_BHAWAN",
    facultyId: "fac-112",
    facultyName: "Dr. Rohit Kumar",
    departmentCode: "AS",
    purpose: "EXTRA_LECTURE",
    title: "Remedial Engineering Mathematics III",
    slot: {
      date: "2026-11-08",
      startTime: "15:00",
      endTime: "17:00",
    },
    attendeesCount: 90,
    status: "PENDING",
    createdAt: "2026-11-06T09:15:00Z",
    updatedAt: "2026-11-06T09:15:00Z",
  },
];

export async function getBookings(): Promise<BookingRequest[]> {
  await mockDelay(60);
  return [...MOCK_BOOKINGS];
}

export async function checkBookingConflict(
  classroomId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<ConflictCheckResult> {
  await mockDelay(50);
  const conflict = MOCK_BOOKINGS.find(
    (b) =>
      b.classroomId === classroomId &&
      b.slot.date === date &&
      b.status === "APPROVED" &&
      ((startTime >= b.slot.startTime && startTime < b.slot.endTime) ||
        (endTime > b.slot.startTime && endTime <= b.slot.endTime) ||
        (startTime <= b.slot.startTime && endTime >= b.slot.endTime))
  );

  if (conflict) {
    return {
      hasConflict: true,
      conflictingBookingId: conflict.id,
      conflictingLecture: conflict.title,
      message: `Time slot clashes with approved booking "${conflict.title}" (${conflict.slot.startTime} - ${conflict.slot.endTime}).`,
    };
  }

  return { hasConflict: false };
}

export async function createBooking(input: CreateBookingInput): Promise<BookingRequest> {
  await mockDelay(100);
  const newBooking: BookingRequest = {
    id: `bk-${Date.now()}`,
    classroomId: input.classroomId,
    roomNumber: input.classroomId.toUpperCase(),
    campusId: input.campusId,
    facultyId: "fac-current",
    facultyName: "Prof. Faculty Member",
    departmentCode: "CSE",
    purpose: input.purpose,
    title: input.title,
    description: input.description,
    slot: {
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
    },
    attendeesCount: input.attendeesCount,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  MOCK_BOOKINGS.unshift(newBooking);
  return newBooking;
}

