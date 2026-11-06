"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFacultyBookings } from "../hooks/use-faculty-dashboard";
import type { FacultyBooking } from "../types";
import { BookingCard } from "./booking-card";
import { BookingDetailDialog, BookingFormDialog, CancelBookingDialog } from "./booking-dialogs";
import { FacultyEmptyState, FacultyErrorState, FacultyLoadingState } from "./query-state";

export function FacultyBookingsPage({ scope }: { scope: "active" | "history" }) {
  const bookings = useFacultyBookings(scope);
  const [viewBooking, setViewBooking] = useState<FacultyBooking | null>(null);
  const [editBooking, setEditBooking] = useState<FacultyBooking | null>(null);
  const [cancelBooking, setCancelBooking] = useState<FacultyBooking | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  if (bookings.isPending) {
    return <FacultyLoadingState label="Loading requisitions..." />;
  }
  if (bookings.isError) {
    return (
      <FacultyErrorState
        message="Booking records could not be loaded from the faculty service."
        onRetry={() => void bookings.refetch()}
      />
    );
  }

  const items = bookings.data ?? [];
  const isHistory = scope === "history";

  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {isHistory ? "Booking history" : "My bookings"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {isHistory
              ? "Rejected, cancelled and completed requisitions. Status is recorded by the academic booking service."
              : "Pending and approved requisitions. Edit is limited to pending future slots; cancellation is queued for backend release."}
          </p>
        </div>
        {!isHistory && (
          <Button
            type="button"
            className="bg-indigo-700 text-white hover:bg-indigo-800"
            onClick={() => setCreateOpen(true)}
          >
            New requisition
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <FacultyEmptyState
          title={isHistory ? "No historical requisitions" : "No active bookings"}
          description={
            isHistory
              ? "Completed, rejected or cancelled requests will appear here."
              : "Queue a classroom requisition. Clash detection will run on the booking API."
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onView={setViewBooking}
              onEdit={isHistory ? undefined : setEditBooking}
              onCancel={isHistory ? undefined : setCancelBooking}
            />
          ))}
        </div>
      )}

      <BookingDetailDialog
        booking={viewBooking}
        open={Boolean(viewBooking)}
        onOpenChange={(open) => !open && setViewBooking(null)}
      />
      <BookingFormDialog
        open={createOpen || Boolean(editBooking)}
        booking={editBooking}
        onOpenChange={(open) => {
          if (!open) {
            setCreateOpen(false);
            setEditBooking(null);
          }
        }}
      />
      <CancelBookingDialog
        booking={cancelBooking}
        open={Boolean(cancelBooking)}
        onOpenChange={(open) => !open && setCancelBooking(null)}
      />
    </div>
  );
}
