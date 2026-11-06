import type {
  AvailabilitySource,
  CampusLocationId,
  Classroom,
  ClassroomFacility,
  ClassroomSearchFilters,
  ClassroomSearchMatch,
  ClassroomSearchResponse,
  ClassroomSearchSort,
  RoomAvailability,
  RoomStatus,
  RoomType,
} from "@/types";

export type {
  AvailabilitySource,
  CampusLocationId,
  Classroom,
  ClassroomFacility,
  ClassroomSearchFilters,
  ClassroomSearchMatch,
  ClassroomSearchResponse,
  ClassroomSearchSort,
  RoomAvailability,
  RoomStatus,
  RoomType,
};

export interface ClassroomDisplayProps {
  classroom: Classroom;
  onSelect?: (classroom: Classroom) => void;
  showActions?: boolean;
}

export const CLASSROOM_FACILITY_OPTIONS: { id: ClassroomFacility; label: string }[] = [
  { id: "PROJECTOR", label: "Projector" },
  { id: "SMART_BOARD", label: "Smart board" },
  { id: "COMPUTERS", label: "Computers" },
  { id: "AIR_CONDITIONING", label: "Air conditioning" },
];

export const ROOM_TYPE_OPTIONS: { id: RoomType | "ALL"; label: string }[] = [
  { id: "ALL", label: "Any room type" },
  { id: "SMART_LECTURE_HALL", label: "Smart lecture hall" },
  { id: "THEATRE_AUDITORIUM", label: "Theatre / auditorium" },
  { id: "COMPUTER_LAB", label: "Computer lab" },
  { id: "SEMINAR_HALL", label: "Seminar hall" },
  { id: "TUTORIAL_ROOM", label: "Tutorial room" },
  { id: "CONFERENCE_ROOM", label: "Conference room" },
];

export const CLASSROOM_SORT_OPTIONS: { id: ClassroomSearchSort; label: string }[] = [
  { id: "CAPACITY_DESC", label: "Capacity (high to low)" },
  { id: "CAPACITY_ASC", label: "Capacity (low to high)" },
  { id: "FLOOR_ASC", label: "Floor (low to high)" },
  { id: "FLOOR_DESC", label: "Floor (high to low)" },
];
