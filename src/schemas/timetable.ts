import { z } from "zod";

export const TimetableFilterSchema = z.object({
  campusId: z.enum(["ALL", "IET", "DEEKSHA_BHAWAN"]).default("ALL"),
  branch: z.string().optional(),
  semester: z.number().int().min(1).max(8).optional(),
  section: z.string().optional(),
  dayOfWeek: z
    .enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
    .optional(),
});

export type TimetableFilterInput = z.infer<typeof TimetableFilterSchema>;

export const CreateTimetableSlotSchema = z.object({
  dayOfWeek: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
  periodNumber: z.number().int().min(1).max(8),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  subjectCode: z.string().min(2, "Subject code required (e.g., KCS-501)"),
  subjectName: z.string().min(2, "Subject name required"),
  facultyName: z.string().min(2, "Faculty member name required"),
  classroomId: z.string().min(1, "Target smart classroom required"),
  campusId: z.enum(["IET", "DEEKSHA_BHAWAN"]),
  semester: z.number().int().min(1).max(8),
  branch: z.string().min(2, "Branch required (e.g., CSE, ECE)"),
  section: z.string().default("A"),
  type: z.enum(["LECTURE", "LAB", "TUTORIAL"]),
});

export type CreateTimetableSlotInput = z.infer<typeof CreateTimetableSlotSchema>;

