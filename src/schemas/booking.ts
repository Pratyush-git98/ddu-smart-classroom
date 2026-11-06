import { z } from "zod";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const BOOKING_PURPOSE_VALUES = [
  "REGULAR_CLASS",
  "EXTRA_LECTURE",
  "SEMINAR",
  "EXAM",
  "WORKSHOP",
  "CONFERENCE",
  "STUDENT_EVENT",
] as const;

function localIsoDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function localClock(date = new Date()): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function addBookingSlotRules<T extends z.ZodType>(schema: T) {
  return schema.superRefine((value, ctx) => {
    const data = value as {
      date: string;
      startTime: string;
      endTime: string;
    };

    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time",
      });
    }

    const today = localIsoDate();
    if (data.date < today) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "Bookings cannot be created for past dates",
      });
    }

    if (data.date === today && data.startTime <= localClock()) {
      ctx.addIssue({
        code: "custom",
        path: ["startTime"],
        message: "Start time must still be in the future",
      });
    }
  });
}

const bookingSlotFields = {
  classroomId: z.string().min(1, "Please select a classroom"),
  campusId: z.enum(["IET", "DEEKSHA_BHAWAN"], {
    error: "Select either IET or Deeksha Bhawan",
  }),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  purpose: z.enum(BOOKING_PURPOSE_VALUES, {
    error: "Select an activity type",
  }),
  date: z.string().regex(DATE_PATTERN, "Date must follow YYYY-MM-DD format"),
  startTime: z.string().regex(TIME_PATTERN, "Start time must be HH:MM (24h)"),
  endTime: z.string().regex(TIME_PATTERN, "End time must be HH:MM (24h)"),
  attendeesCount: z
    .number({ error: "Expected student count is required" })
    .int("Expected student count must be a whole number")
    .positive("Expected student count must be greater than 0")
    .max(500, "Capacity cannot exceed 500"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
};

export const CreateBookingSchema = addBookingSlotRules(
  z.object({
    ...bookingSlotFields,
    requiresRecording: z.boolean().default(false),
    requiresAc: z.boolean().default(false),
  })
);

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

export const FacultyBookingFormSchema = addBookingSlotRules(
  z.object({
    classroomId: bookingSlotFields.classroomId,
    building: z.string().min(1, "Please select a building"),
    title: bookingSlotFields.title,
    purpose: bookingSlotFields.purpose,
    date: bookingSlotFields.date,
    startTime: bookingSlotFields.startTime,
    endTime: bookingSlotFields.endTime,
    attendeesCount: bookingSlotFields.attendeesCount,
    description: z
      .string()
      .max(500, "Description cannot exceed 500 characters")
      .optional()
      .or(z.literal("")),
  })
);

export type FacultyBookingFormInput = z.infer<typeof FacultyBookingFormSchema>;

export const BookingApprovalSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  action: z.enum(["APPROVE", "REJECT"]),
  adminRemark: z.string().max(300).optional(),
});

export type BookingApprovalInput = z.infer<typeof BookingApprovalSchema>;
