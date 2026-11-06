"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { canEditOwnedBooking } from "@/features/bookings/lib/booking-access";
import { useFacultyBooking } from "../hooks/use-faculty-dashboard";
import { FacultyBookingForm } from "./faculty-booking-form";
import { FacultyEmptyState, FacultyErrorState, FacultyLoadingState } from "./query-state";

export function FacultyBookingEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const lookup = useFacultyBooking(params.id);

  if (lookup.isPending) {
    return <FacultyLoadingState label="Loading booking for amendment..." />;
  }
  if (lookup.isError) {
    return (
      <FacultyErrorState
        message="The booking service could not load this requisition."
        onRetry={() => void lookup.refetch()}
      />
    );
  }

  const result = lookup.data;
  if (!result || result.access === "not_found" || !result.booking) {
    return (
      <FacultyEmptyState
        title="Booking not found"
        description="This requisition cannot be edited because it is not in the booking service."
      />
    );
  }
  if (result.access === "forbidden") {
    return (
      <FacultyEmptyState
        title="Not authorised"
        description="You cannot edit a booking you do not own unless you are an academic admin."
      />
    );
  }

  const booking = result.booking;
  if (!canEditOwnedBooking(booking, user?.id, user?.role)) {
    return (
      <FacultyEmptyState
        title="This booking cannot be edited"
        description="Only pending or conflicted future bookings can be amended, and only by the owner or an academic admin."
        action={
          <Button type="button" variant="outline" onClick={() => router.push(`/faculty/bookings/${booking.id}`)}>
            View booking
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Edit booking</h2>
        <p className="mt-1 text-sm text-slate-600">
          Changes are re-validated by the booking service. A conflict will not overwrite availability on this device.
        </p>
      </div>
      <FacultyBookingForm
        booking={booking}
        onSuccess={(id) => router.push(`/faculty/bookings/${id}?status=success`)}
      />
    </div>
  );
}
