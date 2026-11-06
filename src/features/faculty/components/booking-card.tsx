"use client";

import { format, parseISO } from "date-fns";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/common/status-badge";
import { CampusBadge } from "@/components/common/campus-badge";
import { useAuth } from "@/hooks/use-auth";
import { canCancelOwnedBooking, canEditOwnedBooking, ownsBooking } from "@/features/bookings/lib/booking-access";
import { purposeLabel } from "@/features/bookings/lib/booking-labels";
import type { FacultyBooking } from "../types";
import { formatFloor, formatTimeRange } from "../lib/faculty-time";

export function BookingCard({
  booking,
  onCancel,
}: {
  booking: FacultyBooking;
  onCancel?: (booking: FacultyBooking) => void;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const editable = canEditOwnedBooking(booking, user?.id, user?.role);
  const cancellable = canCancelOwnedBooking(booking, user?.id, user?.role);
  const owned = ownsBooking(booking, user?.id);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-xs font-bold text-indigo-800">
            {format(parseISO(booking.date), "EEE d MMM yyyy")} · {formatTimeRange(booking.startTime, booking.endTime)}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-slate-900">{booking.title}</h3>
          <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-400">
            {purposeLabel(booking.purpose)} · {booking.attendeesCount} students
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
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <CampusBadge campusId={booking.venue.campusId} size="sm" />
        {!owned && (
          <span className="text-[11px] font-medium text-slate-500">Owned by {booking.facultyName}</span>
        )}
      </div>

      {booking.status === "CONFLICT_DETECTED" && booking.conflictMessage && (
        <p className="mt-2 text-xs text-orange-800">{booking.conflictMessage}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => router.push(`/faculty/bookings/${booking.id}`)}
        >
          View
        </Button>
        {editable && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => router.push(`/faculty/bookings/${booking.id}/edit`)}
          >
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
