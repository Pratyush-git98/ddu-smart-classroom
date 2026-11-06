import type { CampusLocationId } from "./campus";

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export interface TimetableSlot {
  id: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  classroomId: string;
  roomNumber: string;
  campusId: CampusLocationId;
  semester: number;
  branch: string;
  section: string;
  type: "LECTURE" | "LAB" | "TUTORIAL";
}

export interface TimetableFilterParams {
  campusId?: CampusLocationId | "ALL";
  branch?: string;
  semester?: number;
  section?: string;
  dayOfWeek?: DayOfWeek;
  facultyId?: string;
  roomNumber?: string;
}

