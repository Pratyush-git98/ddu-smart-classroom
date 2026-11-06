import type { DayOfWeek } from "@/types";
import type {
  ClassroomChangeAlert,
  SampleVenue,
  StudentAcademicContext,
  StudentClassSession,
} from "../../types";

/**
 * Preview timetable for frontend development only.
 * Venues are sample spaces from the IET / Deeksha Bhawan facility catalog.
 * They are NOT official published DDUGU or IET classroom assignments.
 */
export const MOCK_DATA_DISCLAIMER =
  "Sample timetable for portal preview. Room codes are facility-catalog locators, not official IET allotments.";

const IET_BLOCK_A_F1: SampleVenue = {
  roomCode: "CR-101",
  displayName: "Sample Lecture Hall A",
  building: "IET Block A (CSE & IT Wing)",
  floor: 1,
  wing: "Ground academic corridor",
  campusId: "IET",
};

const IET_BLOCK_A_F1_ALT: SampleVenue = {
  roomCode: "CR-102",
  displayName: "Sample Computing Lab",
  building: "IET Block A (CSE & IT Wing)",
  floor: 1,
  wing: "Lab bay",
  campusId: "IET",
};

const IET_BLOCK_B_F2: SampleVenue = {
  roomCode: "EC-201",
  displayName: "Sample Shared Lecture Room",
  building: "IET Block B (ECE & EE Wing)",
  floor: 2,
  wing: "East corridor",
  campusId: "IET",
};

const IET_SEMINAR: SampleVenue = {
  roomCode: "IET-SH1",
  displayName: "Sample Seminar Hall",
  building: "IET Central Academic Wing",
  floor: 1,
  wing: "Seminar court",
  campusId: "IET",
};

const DEEKSHA_LT: SampleVenue = {
  roomCode: "DB-LT1",
  displayName: "Sample Lecture Theatre",
  building: "Deeksha Bhawan Academic Complex",
  floor: 0,
  wing: "Ground floor theatres",
  campusId: "DEEKSHA_BHAWAN",
};

export const MOCK_STUDENT_CONTEXT: StudentAcademicContext = {
  studentId: "usr-std-01",
  displayName: "Aditya Verma",
  branchCode: "CSE",
  branchName: "Computer Science & Engineering",
  academicYear: "3rd Year",
  semester: 5,
  batch: "2023-2027",
  section: "A",
  program: "B.Tech Computer Science & Engineering",
  rollNumber: "2024CS042",
  enrollmentNumber: "DDU/IET/2023/042",
  primaryCampus: "IET",
};

function session(
  partial: Omit<StudentClassSession, "facultyName"> & { facultyName?: string }
): StudentClassSession {
  return {
    facultyName: "Faculty (sample)",
    ...partial,
  };
}

/**
 * B.Tech CSE 5th Semester, Section A — illustrative weekly grid using AKTU-style
 * paper codes already used in this portal. Periods follow the campus 09:00–17:00 day.
 */
export const MOCK_WEEKLY_SESSIONS: StudentClassSession[] = [
  session({
    id: "mon-p1",
    dayOfWeek: "Monday",
    periodNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
    subjectCode: "KCS-501",
    subjectName: "Operating Systems",
    facultyName: "Dr. Arvind Tripathi",
    sessionType: "LECTURE",
    venue: IET_BLOCK_A_F1,
  }),
  session({
    id: "mon-p2",
    dayOfWeek: "Monday",
    periodNumber: 2,
    startTime: "10:00",
    endTime: "11:00",
    subjectCode: "KCS-502",
    subjectName: "Compiler Design",
    facultyName: "Er. Pratibha Singh",
    sessionType: "LECTURE",
    venue: IET_BLOCK_A_F1,
  }),
  session({
    id: "mon-p3",
    dayOfWeek: "Monday",
    periodNumber: 3,
    startTime: "11:00",
    endTime: "12:00",
    subjectCode: "KCS-503",
    subjectName: "Design & Analysis of Algorithms",
    facultyName: "Dr. Neha Srivastava",
    sessionType: "LECTURE",
    venue: IET_BLOCK_B_F2,
  }),
  session({
    id: "mon-p5",
    dayOfWeek: "Monday",
    periodNumber: 5,
    startTime: "14:00",
    endTime: "16:00",
    subjectCode: "KCS-551",
    subjectName: "Operating Systems Lab",
    facultyName: "Er. Pratibha Singh",
    sessionType: "LAB",
    venue: IET_BLOCK_A_F1_ALT,
  }),

  session({
    id: "tue-p1",
    dayOfWeek: "Tuesday",
    periodNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
    subjectCode: "KCS-504",
    subjectName: "Database Management Systems",
    facultyName: "Dr. Rakesh Yadav",
    sessionType: "LECTURE",
    venue: IET_BLOCK_A_F1,
  }),
  session({
    id: "tue-p2",
    dayOfWeek: "Tuesday",
    periodNumber: 2,
    startTime: "10:00",
    endTime: "11:00",
    subjectCode: "KCS-501",
    subjectName: "Operating Systems",
    facultyName: "Dr. Arvind Tripathi",
    sessionType: "LECTURE",
    venue: IET_BLOCK_A_F1,
  }),
  session({
    id: "tue-p4",
    dayOfWeek: "Tuesday",
    periodNumber: 4,
    startTime: "12:00",
    endTime: "13:00",
    subjectCode: "KCS-502",
    subjectName: "Compiler Design",
    facultyName: "Er. Pratibha Singh",
    sessionType: "TUTORIAL",
    venue: IET_SEMINAR,
  }),
  session({
    id: "tue-p5",
    dayOfWeek: "Tuesday",
    periodNumber: 5,
    startTime: "14:00",
    endTime: "15:00",
    subjectCode: "KNC-501",
    subjectName: "Constitution of India",
    facultyName: "Dr. Meera Joshi",
    sessionType: "LECTURE",
    venue: IET_SEMINAR,
  }),

  session({
    id: "wed-p2",
    dayOfWeek: "Wednesday",
    periodNumber: 2,
    startTime: "10:00",
    endTime: "11:00",
    subjectCode: "KCS-503",
    subjectName: "Design & Analysis of Algorithms",
    facultyName: "Dr. Neha Srivastava",
    sessionType: "LECTURE",
    venue: IET_BLOCK_B_F2,
    previousVenue: IET_BLOCK_A_F1,
    changeNote: "Moved after a sample occupancy clash in Block A (preview data).",
  }),
  session({
    id: "wed-p3",
    dayOfWeek: "Wednesday",
    periodNumber: 3,
    startTime: "11:00",
    endTime: "12:00",
    subjectCode: "KCS-504",
    subjectName: "Database Management Systems",
    facultyName: "Dr. Rakesh Yadav",
    sessionType: "LECTURE",
    venue: IET_BLOCK_A_F1,
  }),
  session({
    id: "wed-p5",
    dayOfWeek: "Wednesday",
    periodNumber: 5,
    startTime: "14:00",
    endTime: "16:00",
    subjectCode: "KCS-553",
    subjectName: "DBMS Lab",
    facultyName: "Dr. Rakesh Yadav",
    sessionType: "LAB",
    venue: IET_BLOCK_A_F1_ALT,
  }),

  session({
    id: "thu-p1",
    dayOfWeek: "Thursday",
    periodNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
    subjectCode: "KCS-502",
    subjectName: "Compiler Design",
    facultyName: "Er. Pratibha Singh",
    sessionType: "LECTURE",
    venue: IET_BLOCK_A_F1,
  }),
  session({
    id: "thu-p3",
    dayOfWeek: "Thursday",
    periodNumber: 3,
    startTime: "11:00",
    endTime: "12:00",
    subjectCode: "KCS-501",
    subjectName: "Operating Systems",
    facultyName: "Dr. Arvind Tripathi",
    sessionType: "TUTORIAL",
    venue: IET_SEMINAR,
  }),
  session({
    id: "thu-p5",
    dayOfWeek: "Thursday",
    periodNumber: 5,
    startTime: "14:00",
    endTime: "15:00",
    subjectCode: "KCS-503",
    subjectName: "Design & Analysis of Algorithms",
    facultyName: "Dr. Neha Srivastava",
    sessionType: "LECTURE",
    venue: IET_BLOCK_B_F2,
  }),
  session({
    id: "thu-p6",
    dayOfWeek: "Thursday",
    periodNumber: 6,
    startTime: "15:00",
    endTime: "16:00",
    subjectCode: "OE-MBA",
    subjectName: "Open Elective: Managerial Economics",
    facultyName: "Prof. Sudhir Srivastava",
    sessionType: "LECTURE",
    venue: DEEKSHA_LT,
  }),

  session({
    id: "fri-p1",
    dayOfWeek: "Friday",
    periodNumber: 1,
    startTime: "09:00",
    endTime: "10:00",
    subjectCode: "KCS-504",
    subjectName: "Database Management Systems",
    facultyName: "Dr. Rakesh Yadav",
    sessionType: "LECTURE",
    venue: IET_BLOCK_A_F1,
  }),
  session({
    id: "fri-p2",
    dayOfWeek: "Friday",
    periodNumber: 2,
    startTime: "10:00",
    endTime: "11:00",
    subjectCode: "KCS-501",
    subjectName: "Operating Systems",
    facultyName: "Dr. Arvind Tripathi",
    sessionType: "LECTURE",
    venue: IET_BLOCK_A_F1,
  }),
  session({
    id: "fri-p3",
    dayOfWeek: "Friday",
    periodNumber: 3,
    startTime: "11:00",
    endTime: "12:00",
    subjectCode: "KCS-502",
    subjectName: "Compiler Design",
    facultyName: "Er. Pratibha Singh",
    sessionType: "LECTURE",
    venue: IET_BLOCK_A_F1,
  }),
  session({
    id: "fri-p4",
    dayOfWeek: "Friday",
    periodNumber: 4,
    startTime: "12:00",
    endTime: "13:00",
    subjectCode: "KCS-503",
    subjectName: "Design & Analysis of Algorithms",
    facultyName: "Dr. Neha Srivastava",
    sessionType: "LECTURE",
    venue: IET_BLOCK_B_F2,
    previousVenue: IET_SEMINAR,
    changeNote: "Relocated from the seminar hall for a sample departmental meeting.",
  }),
  session({
    id: "fri-p5",
    dayOfWeek: "Friday",
    periodNumber: 5,
    startTime: "14:00",
    endTime: "15:00",
    subjectCode: "KCS-551",
    subjectName: "Operating Systems Lab",
    facultyName: "Er. Pratibha Singh",
    sessionType: "LAB",
    venue: IET_BLOCK_A_F1_ALT,
  }),
  session({
    id: "fri-p6",
    dayOfWeek: "Friday",
    periodNumber: 6,
    startTime: "15:00",
    endTime: "16:00",
    subjectCode: "OE-MBA",
    subjectName: "Open Elective: Managerial Economics",
    facultyName: "Prof. Sudhir Srivastava",
    sessionType: "LECTURE",
    venue: DEEKSHA_LT,
  }),

  session({
    id: "sat-p2",
    dayOfWeek: "Saturday",
    periodNumber: 2,
    startTime: "10:00",
    endTime: "12:00",
    subjectCode: "KCS-552",
    subjectName: "Algorithms Lab",
    facultyName: "Dr. Neha Srivastava",
    sessionType: "LAB",
    venue: IET_BLOCK_A_F1_ALT,
  }),
];

export const MOCK_CHANGE_ALERTS: ClassroomChangeAlert[] = [
  {
    id: "alert-1",
    sessionId: "fri-p4",
    subjectCode: "KCS-503",
    subjectName: "Design & Analysis of Algorithms",
    dayOfWeek: "Friday",
    startTime: "12:00",
    fromVenue: IET_SEMINAR,
    toVenue: IET_BLOCK_B_F2,
    reason: "Sample relocation — seminar hall reserved for a departmental briefing.",
    publishedAt: "2026-11-06T08:40:00+05:30",
  },
  {
    id: "alert-2",
    sessionId: "wed-p2",
    subjectCode: "KCS-503",
    subjectName: "Design & Analysis of Algorithms",
    dayOfWeek: "Wednesday",
    startTime: "10:00",
    fromVenue: IET_BLOCK_A_F1,
    toVenue: IET_BLOCK_B_F2,
    reason: "Sample occupancy clash in Block A lecture hall.",
    publishedAt: "2026-11-04T17:15:00+05:30",
  },
];

export function filterSessionsByDay(
  sessions: StudentClassSession[],
  day: DayOfWeek | "ALL"
): StudentClassSession[] {
  const filtered = day === "ALL" ? sessions : sessions.filter((item) => item.dayOfWeek === day);
  return [...filtered].sort((a, b) => {
    const dayDelta =
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(a.dayOfWeek) -
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(b.dayOfWeek);
    if (dayDelta !== 0) return dayDelta;
    return a.periodNumber - b.periodNumber;
  });
}
