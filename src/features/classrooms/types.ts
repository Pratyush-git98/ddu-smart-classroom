import type { Classroom, RoomStatus, RoomType, CampusLocationId } from "@/types";

export type { Classroom, RoomStatus, RoomType, CampusLocationId };

export interface ClassroomDisplayProps {
  classroom: Classroom;
  onSelect?: (classroom: Classroom) => void;
  showActions?: boolean;
}

