import type { ReactNode } from "react";
import { format, parseISO } from "date-fns";
import { BookingStatusBadge } from "@/components/common/status-badge";
import type { FacultyBooking, FacultyBookingDraft } from "../types";
import { purposeLabel } from "@/features/bookings/lib/booking-labels";
import { formatFloor, formatTimeRange } from "../lib/faculty-time";
import type { Classroom } from "@/types";

export function BookingSummaryRows({
  title,
  purpose,
  date,
  startTime,
  endTime,
  building,
  roomLabel,
  attendeesCount,
  description,
  status,
}: {
  title: string;
  purpose: FacultyBookingDraft["purpose"];
  date: string;
  startTime: string;
  endTime: string;
  building: string;
  roomLabel: string;
  attendeesCount: number;
  description?: string;
  status?: FacultyBooking["status"];
}) {
  return (
    <dl className="space-y-2 text-sm">
      {status && (
        <Row label="Status" value={<BookingStatusBadge status={status} />} />
      )}
      <Row label="Activity" value={title} />
      <Row label="Type" value={purposeLabel(purpose)} />
      <Row
        label="When"
        value={`${format(parseISO(date), "EEE d MMM yyyy")} · ${formatTimeRange(startTime, endTime)}`}
      />
      <Row label="Classroom" value={roomLabel} />
      <Row label="Building" value={building} />
      <Row label="Expected students" value={String(attendeesCount)} />
      {description?.trim() ? <Row label="Description" value={description} /> : null}
    </dl>
  );
}

export function bookingDraftSummary(
  draft: FacultyBookingDraft,
  classroom: Classroom | undefined
) {
  return {
    title: draft.title,
    purpose: draft.purpose,
    date: draft.date,
    startTime: draft.startTime,
    endTime: draft.endTime,
    building: draft.building || classroom?.block || "—",
    roomLabel: classroom ? `${classroom.roomNumber} · ${classroom.name}` : draft.classroomId,
    attendeesCount: draft.attendeesCount,
    description: draft.description,
  };
}

export function bookingRecordSummary(booking: FacultyBooking) {
  return {
    title: booking.title,
    purpose: booking.purpose,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    building: booking.venue.building,
    roomLabel: `${booking.venue.roomCode} · ${booking.venue.displayName} · Floor ${formatFloor(booking.venue.floor)}`,
    attendeesCount: booking.attendeesCount,
    description: booking.description,
    status: booking.status,
  };
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="col-span-2 text-slate-800">{value}</dd>
    </div>
  );
}
