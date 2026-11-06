"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { canCancelOwnedBooking, canEditOwnedBooking } from "@/features/bookings/lib/booking-access";
import { useFacultyBooking } from "../hooks/use-faculty-dashboard";
import { BookingSummaryRows, bookingRecordSummary } from "./booking-summary";
import { CancelBookingDialog } from "./booking-dialogs";
import { FacultyEmptyState, FacultyErrorState, FacultyLoadingState } from "./query-state";

export function FacultyBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const lookup = useFacultyBooking(params.id);
  const [cancelOpen, setCancelOpen] = useState(false);
  const justSucceeded = searchParams.get("status") === "success";

  if (lookup.isPending) {
    return <FacultyLoadingState label="Loading booking from the academic service..." />;
  }

  if (lookup.isError) {
    return (
      <FacultyErrorState
        message="The booking service could not return this record."
        onRetry={() => void lookup.refetch()}
      />
    );
  }

  const result = lookup.data;
  if (!result || result.access === "not_found" || !result.booking) {
    return (
      <FacultyEmptyState
        title="Booking not found"
        description={result?.message ?? "This requisition is not in the booking service."}
        action={
          <Button type="button" variant="outline" onClick={() => router.push("/faculty/bookings")}>
            Back to bookings
          </Button>
        }
      />
    );
  }

  if (result.access === "forbidden") {
    return (
      <FacultyEmptyState
        title="Not authorised"
        description={result.message ?? "You cannot view a booking you do not own."}
        action={
          <Button type="button" variant="outline" onClick={() => router.push("/faculty/bookings")}>
            Back to bookings
          </Button>
        }
      />
    );
  }

  const booking = result.booking;
  const canEdit = canEditOwnedBooking(booking, user?.id, user?.role);
  const canCancel = canCancelOwnedBooking(booking, user?.id, user?.role);

  return (
    <div className="space-y-4 pb-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Booking {booking.id}</p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">{booking.title}</h2>
        <p className="mt-1 text-sm text-slate-600">
          Requested by {booking.facultyName}. Status below is the last confirmed response from the booking service.
        </p>
      </div>

      {justSucceeded && (
        <div className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          The academic booking service accepted this request.
        </div>
      )}

      {booking.status === "CONFLICT_DETECTED" && (
        <div className="flex gap-2 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-900">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {booking.conflictMessage ?? "The booking service detected a scheduling conflict for this room and time."}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <BookingSummaryRows {...bookingRecordSummary(booking)} />
        {booking.adminRemark && (
          <p className="mt-3 text-sm text-slate-600">
            <span className="font-semibold">Admin remark: </span>
            {booking.adminRemark}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/faculty/bookings")}>
          Back
        </Button>
        {canEdit && (
          <Button
            className="bg-indigo-700 text-white hover:bg-indigo-800"
            render={<Link href={`/faculty/bookings/${booking.id}/edit`} />}
          >
            Edit booking
          </Button>
        )}
        {canCancel && (
          <Button type="button" variant="destructive" onClick={() => setCancelOpen(true)}>
            Cancel booking
          </Button>
        )}
        {!canEdit && !canCancel && booking.facultyId !== user?.id && (
          <p className="self-center text-xs text-slate-500">
            You can view this record, but only the owner or an academic admin can change it.
          </p>
        )}
      </div>

      <CancelBookingDialog booking={booking} open={cancelOpen} onOpenChange={setCancelOpen} />
    </div>
  );
}
