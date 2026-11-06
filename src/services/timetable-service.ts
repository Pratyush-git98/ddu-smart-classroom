import type { DayOfWeek, TimetableFilterParams, TimetableSlot } from "@/types";
import { mockDelay } from "./api-client";

export const MOCK_TIMETABLE_SLOTS: TimetableSlot[] = [
  // Monday slots
  {
    id: "tt-1",
    dayOfWeek: "Monday",
    periodNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
    subjectCode: "KCS-501",
    subjectName: "Database Management Systems",
    facultyName: "Dr. Arvind Tripathi",
    classroomId: "iet-cs-101",
    roomNumber: "CR-101",
    campusId: "IET",
    semester: 5,
    branch: "CSE",
    section: "A",
    type: "LECTURE",
  },
  {
    id: "tt-2",
    dayOfWeek: "Monday",
    periodNumber: 2,
    startTime: "10:00",
    endTime: "11:00",
    subjectCode: "KCS-502",
    subjectName: "Compiler Design",
    facultyName: "Er. Pratibha Singh",
    classroomId: "iet-cs-101",
    roomNumber: "CR-101",
    campusId: "IET",
    semester: 5,
    branch: "CSE",
    section: "A",
    type: "LECTURE",
  },
  {
    id: "tt-3",
    dayOfWeek: "Monday",
    periodNumber: 3,
    startTime: "11:00",
    endTime: "12:00",
    subjectCode: "KCS-551",
    subjectName: "DBMS Practical Lab",
    facultyName: "Dr. Arvind Tripathi",
    classroomId: "iet-cs-102",
    roomNumber: "CR-102",
    campusId: "IET",
    semester: 5,
    branch: "CSE",
    section: "A",
    type: "LAB",
  },
  {
    id: "tt-4",
    dayOfWeek: "Monday",
    periodNumber: 5,
    startTime: "14:00",
    endTime: "15:00",
    subjectCode: "MBA-102",
    subjectName: "Managerial Economics",
    facultyName: "Prof. Sudhir Srivastava",
    classroomId: "db-lt-01",
    roomNumber: "DB-LT1",
    campusId: "DEEKSHA_BHAWAN",
    semester: 1,
    branch: "MBA",
    section: "A",
    type: "LECTURE",
  },
  // Tuesday slots
  {
    id: "tt-5",
    dayOfWeek: "Tuesday",
    periodNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
    subjectCode: "KCS-503",
    subjectName: "Design & Analysis of Algorithms",
    facultyName: "Dr. Rajesh Pandey",
    classroomId: "iet-cs-101",
    roomNumber: "CR-101",
    campusId: "IET",
    semester: 5,
    branch: "CSE",
    section: "A",
    type: "LECTURE",
  },
  {
    id: "tt-6",
    dayOfWeek: "Tuesday",
    periodNumber: 2,
    startTime: "10:00",
    endTime: "11:00",
    subjectCode: "KCS-504",
    subjectName: "Web Technology & Cloud Systems",
    facultyName: "Er. Anand Maurya",
    classroomId: "iet-cs-101",
    roomNumber: "CR-101",
    campusId: "IET",
    semester: 5,
    branch: "CSE",
    section: "A",
    type: "LECTURE",
  },
  {
    id: "tt-7",
    dayOfWeek: "Tuesday",
    periodNumber: 4,
    startTime: "12:00",
    endTime: "13:00",
    subjectCode: "COMM-201",
    subjectName: "Financial Accounting & Auditing",
    facultyName: "Dr. Neha Verma",
    classroomId: "db-lt-02",
    roomNumber: "DB-LT2",
    campusId: "DEEKSHA_BHAWAN",
    semester: 3,
    branch: "Commerce",
    section: "A",
    type: "LECTURE",
  },
];

export async function getTimetableSlots(params?: TimetableFilterParams): Promise<TimetableSlot[]> {
  await mockDelay(60);
  let result = [...MOCK_TIMETABLE_SLOTS];

  if (params?.campusId && params.campusId !== "ALL") {
    result = result.filter((s) => s.campusId === params.campusId);
  }
  if (params?.branch) {
    result = result.filter((s) => s.branch.toLowerCase() === params.branch?.toLowerCase());
  }
  if (params?.semester) {
    result = result.filter((s) => s.semester === params.semester);
  }
  if (params?.dayOfWeek) {
    result = result.filter((s) => s.dayOfWeek === params.dayOfWeek);
  }

  return result;
}

export async function getDaySchedule(day: DayOfWeek): Promise<TimetableSlot[]> {
  await mockDelay(50);
  return MOCK_TIMETABLE_SLOTS.filter((s) => s.dayOfWeek === day);
}

