import type { CampusLocationId } from "./campus";

export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";

export type RoomType =
  | "SMART_LECTURE_HALL"
  | "THEATRE_AUDITORIUM"
  | "COMPUTER_LAB"
  | "SEMINAR_HALL"
  | "TUTORIAL_ROOM"
  | "CONFERENCE_ROOM";

export interface RoomEquipment {
  id: string;
  type: "SMART_BOARD" | "LASER_PROJECTOR" | "MIC_AUDIO" | "LECTURE_CAPTURE" | "IOT_HVAC" | "BIOMETRIC_ATTENDANCE";
  name: string;
  isOnline: boolean;
  lastPing?: string;
}

export interface Classroom {
  id: string;
  roomNumber: string;
  name: string;
  campusId: CampusLocationId;
  block: string;
  floor: number;
  capacity: number;
  type: RoomType;
  status: RoomStatus;
  currentOccupancy?: number;
  currentLecture?: {
    subject: string;
    facultyName: string;
    courseCode: string;
    endTime: string;
  };
  equipment: RoomEquipment[];
  hasAirConditioning: boolean;
  hasRecordingSetup: boolean;
  isAccessibleForDisabled: boolean;
}

export interface ClassroomFilterParams {
  campusId?: CampusLocationId | "ALL";
  status?: RoomStatus | "ALL";
  roomType?: RoomType | "ALL";
  minCapacity?: number;
  searchQuery?: string;
  hasRecording?: boolean;
}

