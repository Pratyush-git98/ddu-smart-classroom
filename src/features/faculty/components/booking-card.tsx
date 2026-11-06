"use client";

import { format, parseISO } from "date-fns";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/common/status-badge";
import { CampusBadge } from "@/components/common/campus-badge";
import type { FacultyBooking } from "../types";
import { canCancelBooking, canEditBooking, formatFloor, formatTimeRange } from "../lib/faculty-time";

export function BookingCard({
  booking,
  onView,
  onEdit,
  onCancel,
}: {
  booking: FacultyBooking;
  onView: (booking: FacultyBooking) => void;
  onEdit?: (booking: FacultyBooking) => void;
  onCancel?: (booking: FacultyBooking) => void;
}) {
  const editable = canEditBooking(booking);
  const cancellable = canCancelBooking(booking);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs font-bold text-indigo-800">
            {format(parseISO(booking.date), "EEE d MMM yyyy")} · {formatTimeRange(booking.startTime, booking.endTime)}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-slate-900">{booking.title}</h3>
          <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-400">
            {booking.purpose.replace(/_/g, " ")}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-600">
        <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
        <span>
          <span className="font-mono font-bold text-slate-900">{booking.venue.roomCode}</span>
          <span className="mt-0.5 block">
            {booking.venue.building} · Floor {formatFloor(booking.venue.floor)}
          </span>
        </span>
      </p>
      <div className="mt-2">
        <CampusBadge campusId={booking.venue.campusId} size="sm" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => onView(booking)}>
          View
        </Button>
        {editable && onEdit && (
          <Button type="button" size="sm" variant="outline" onClick={() => onEdit(booking)}>
            Edit
          </Button>
        )}
        {cancellable && onCancel && (
          <Button type="button" size="sm" variant="destructive" onClick={() => onCancel(booking)}>
            Cancel
          </Button>
        )}
      </div>
    </article>
  );
}
