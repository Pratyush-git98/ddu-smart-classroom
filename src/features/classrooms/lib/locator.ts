import type { Classroom } from "@/types";

export interface ClassroomLocatorHint {
  id: string;
  roomCode: string;
  name: string;
  building: string;
  floor: number;
  campusId: Classroom["campusId"];
  status: Classroom["status"];
  capacity: number;
}

export function toClassroomLocatorHint(room: Classroom): ClassroomLocatorHint {
  return {
    id: room.id,
    roomCode: room.roomNumber,
    name: room.name,
    building: room.block,
    floor: room.floor,
    campusId: room.campusId,
    status: room.status,
    capacity: room.capacity,
  };
}

export function filterClassroomsByLocatorQuery(rooms: Classroom[], query: string): Classroom[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return rooms;
  return rooms.filter(
    (room) =>
      room.roomNumber.toLowerCase().includes(needle) ||
      room.name.toLowerCase().includes(needle) ||
      room.block.toLowerCase().includes(needle) ||
      String(room.floor).includes(needle)
  );
}
