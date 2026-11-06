import type { CampusLocationId } from "./campus";

export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";

export type RoomType =
  | "SMART_LECTURE_HALL"
  | "THEATRE_AUDITORIUM"
  | "COMPUTER_LAB"
  | "SEMINAR_HALL"
  | "TUTORIAL_ROOM"
  | "CONFERENCE_ROOM";

export type ClassroomFacility = "PROJECTOR" | "SMART_BOARD" | "COMPUTERS" | "AIR_CONDITIONING";

export type AvailabilitySource = "PROVISIONAL_FRONTEND" | "SERVER_CONFIRMED";

export type ClassroomSearchSort = "CAPACITY_ASC" | "CAPACITY_DESC" | "FLOOR_ASC" | "FLOOR_DESC";

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
  facilities: ClassroomFacility[];
  computerCount?: number;
  hasAirConditioning: boolean;
  hasRecordingSetup: boolean;
  isAccessibleForDisabled: boolean;
  /** Campus facilities office has not published a floor plan for most rooms yet. */
  blueprintUrl?: string | null;
}

export interface RoomAvailabilitySlot {
  startTime: string;
  endTime: string;
  status: "FREE" | "OCCUPIED";
  label?: string;
}

export interface RoomAvailability {
  classroomId: string;
  date: string;
  source: AvailabilitySource;
  checkedAt: string;
  slots: RoomAvailabilitySlot[];
  requestedWindow: {
    startTime: string;
    endTime: string;
    isFree: boolean;
  };
}

export interface ClassroomSearchFilters {
  campusId: CampusLocationId | "ALL";
  building: string | "ALL";
  date: string;
  startTime: string;
  endTime: string;
  minCapacity?: number;
  roomType: RoomType | "ALL";
  facilities: ClassroomFacility[];
  sort: ClassroomSearchSort;
}

export interface ClassroomSearchMatch {
  classroom: Classroom;
  availability: RoomAvailability;
}

export interface ClassroomSearchResponse {
  filters: ClassroomSearchFilters;
  results: ClassroomSearchMatch[];
  buildings: string[];
  /** Mock/catalog search never locks a slot. Live clash checks belong on the booking API. */
  availabilityMode: AvailabilitySource;
  generatedAt: string;
}

export interface ClassroomAvailabilityQuery {
  classroomId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ClassroomFilterParams {
  campusId?: CampusLocationId | "ALL";
  status?: RoomStatus | "ALL";
  roomType?: RoomType | "ALL";
  minCapacity?: number;
  searchQuery?: string;
  hasRecording?: boolean;
}
