import type { CampusLocationId } from "@/types";

export interface FacultyRequisitionDraft {
  campusId: CampusLocationId;
  targetRoomNumber: string;
  lectureTitle: string;
  courseCode: string;
  expectedStudents: number;
  date: string;
  startTime: string;
  endTime: string;
  requiresLectureRecording: boolean;
}

export interface FacultyIoTPreset {
  roomId: string;
  projectorPower: boolean;
  screenDown: boolean;
  acTemperature: number;
  micVolume: number;
  recordingActive: boolean;
}

