import type { CampusLocationId } from "@/types";

export interface StudentScheduleLecture {
  id: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  timeSlot: string;
  roomNumber: string;
  campusId: CampusLocationId;
  block: string;
  isCurrent: boolean;
  attendanceVerified: boolean;
}

export interface StudentProfileSummary {
  rollNumber: string;
  studentName: string;
  branch: string;
  semester: number;
  section: string;
  attendanceRate: number;
}

