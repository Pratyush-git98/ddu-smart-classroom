import { z } from "zod";

export const ClassroomFilterSchema = z.object({
  campusId: z.enum(["ALL", "IET", "DEEKSHA_BHAWAN"]).default("ALL"),
  status: z.enum(["ALL", "AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"]).default("ALL"),
  roomType: z
    .enum([
      "ALL",
      "SMART_LECTURE_HALL",
      "THEATRE_AUDITORIUM",
      "COMPUTER_LAB",
      "SEMINAR_HALL",
      "TUTORIAL_ROOM",
      "CONFERENCE_ROOM",
    ])
    .default("ALL"),
  minCapacity: z.number().int().nonnegative().optional(),
  searchQuery: z.string().optional(),
  hasRecording: z.boolean().optional(),
});

export const ClassroomSearchFiltersSchema = z.object({
  campusId: z.enum(["ALL", "IET", "DEEKSHA_BHAWAN"]).default("ALL"),
  building: z.string().default("ALL"),
  date: z.string().min(10),
  startTime: z.string().min(4),
  endTime: z.string().min(4),
  minCapacity: z.number().int().nonnegative().optional(),
  roomType: z
    .enum([
      "ALL",
      "SMART_LECTURE_HALL",
      "THEATRE_AUDITORIUM",
      "COMPUTER_LAB",
      "SEMINAR_HALL",
      "TUTORIAL_ROOM",
      "CONFERENCE_ROOM",
    ])
    .default("ALL"),
  facilities: z
    .array(z.enum(["PROJECTOR", "SMART_BOARD", "COMPUTERS", "AIR_CONDITIONING"]))
    .default([]),
  sort: z
    .enum(["CAPACITY_ASC", "CAPACITY_DESC", "FLOOR_ASC", "FLOOR_DESC"])
    .default("CAPACITY_DESC"),
});

export type ClassroomSearchFiltersInput = z.infer<typeof ClassroomSearchFiltersSchema>;

export type ClassroomFilterInput = z.infer<typeof ClassroomFilterSchema>;

export const CreateClassroomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required (e.g., LT-1 or CS-204)"),
  name: z.string().min(2, "Room label or name is required"),
  campusId: z.enum(["IET", "DEEKSHA_BHAWAN"]),
  block: z.string().min(1, "Building block or floor zone is required"),
  floor: z.number().int().min(0, "Floor index must be 0 (ground) or higher"),
  capacity: z.number().int().positive("Capacity must be positive"),
  type: z.enum([
    "SMART_LECTURE_HALL",
    "THEATRE_AUDITORIUM",
    "COMPUTER_LAB",
    "SEMINAR_HALL",
    "TUTORIAL_ROOM",
    "CONFERENCE_ROOM",
  ]),
  hasAirConditioning: z.boolean().default(true),
  hasRecordingSetup: z.boolean().default(true),
  isAccessibleForDisabled: z.boolean().default(true),
});

export type CreateClassroomInput = z.infer<typeof CreateClassroomSchema>;

export const AdminClassroomFormSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required (e.g., LT-1 or CS-204)"),
  name: z.string().min(2, "Room label or name is required"),
  campusId: z.enum(["IET", "DEEKSHA_BHAWAN"]),
  block: z.string().min(1, "Building or block is required"),
  floor: z.number().int().min(0, "Floor index must be 0 (ground) or higher"),
  capacity: z.number().int().positive("Capacity must be positive"),
  type: z.enum([
    "SMART_LECTURE_HALL",
    "THEATRE_AUDITORIUM",
    "COMPUTER_LAB",
    "SEMINAR_HALL",
    "TUTORIAL_ROOM",
    "CONFERENCE_ROOM",
  ]),
  facilities: z.array(z.enum(["PROJECTOR", "SMART_BOARD", "COMPUTERS", "AIR_CONDITIONING"])),
});

export type AdminClassroomFormInput = z.infer<typeof AdminClassroomFormSchema>;

