import { z } from "zod";

export const CreateBookingSchema = z.object({
  classroomId: z.string().min(1, "Please select a classroom"),
  campusId: z.enum(["IET", "DEEKSHA_BHAWAN"], {
    error: "Select either IET or Deeksha Bhawan",
  }),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  purpose: z.enum([
    "REGULAR_CLASS",
    "EXTRA_LECTURE",
    "SEMINAR",
    "EXAM",
    "WORKSHOP",
    "CONFERENCE",
    "STUDENT_EVENT",
  ]),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must follow YYYY-MM-DD format"),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Start time must be HH:MM (24h)"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "End time must be HH:MM (24h)"),
  attendeesCount: z
    .number()
    .int()
    .positive("Estimated attendees must be greater than 0")
    .max(500, "Capacity cannot exceed 500"),
  description: z.string().max(500).optional(),
  requiresRecording: z.boolean().default(false),
  requiresAc: z.boolean().default(false),
}).refine(
  (data) => data.startTime < data.endTime,
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
);

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

export const BookingApprovalSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  action: z.enum(["APPROVE", "REJECT"]),
  adminRemark: z.string().max(300).optional(),
});

export type BookingApprovalInput = z.infer<typeof BookingApprovalSchema>;

