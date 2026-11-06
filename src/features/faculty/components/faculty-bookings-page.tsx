"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFacultyBookings } from "../hooks/use-faculty-dashboard";
import type { FacultyBooking } from "../types";
import { BookingCard } from "./booking-card";
import { CancelBookingDialog } from "./booking-dialogs";
import { StaleDataHint } from "@/components/query/stale-data-hint";
import { FacultyEmptyState, FacultyErrorState, FacultyLoadingState } from "./query-state";

export function FacultyBookingsPage({ scope }: { scope: "active" | "history" }) {
  const router = useRouter();
  const bookings = useFacultyBookings(scope);
  const [cancelBooking, setCancelBooking] = useState<FacultyBooking | null>(null);

  if (bookings.isPending) {
    return <FacultyLoadingState label="Loading requisitions..." />;
  }
  if (bookings.isError) {
    return (
      <FacultyErrorState
        message="Booking records could not be loaded from the academic booking service."
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
              ? "Rejected, cancelled and completed requisitions recorded by the booking service."
              : "Pending, approved and conflicted requisitions. Edit and cancel are limited to bookings you own."}
          </p>
        </div>
        {!isHistory && (
          <Button
            type="button"
            className="bg-indigo-700 text-white hover:bg-indigo-800"
            onClick={() => router.push("/faculty/bookings/new")}
          >
            New booking
          </Button>
        )}
      </div>

      <StaleDataHint
        hasData={Boolean(bookings.data)}
        isFetching={bookings.isFetching}
        isStale={bookings.isStale}
        dataUpdatedAt={bookings.dataUpdatedAt}
      />

      {items.length === 0 ? (
        <FacultyEmptyState
          title={isHistory ? "No historical requisitions" : "No active bookings"}
          description={
            isHistory
              ? "Completed, rejected or cancelled requests will appear here."
              : "Create a classroom booking. Availability is confirmed only after the booking API responds."
          }
          action={
            !isHistory ? (
              <Button
                type="button"
                className="bg-indigo-700 text-white hover:bg-indigo-800"
                onClick={() => router.push("/faculty/bookings/new")}
              >
                New booking
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={isHistory ? undefined : setCancelBooking}
            />
          ))}
        </div>
      )}

      <CancelBookingDialog
        booking={cancelBooking}
        open={Boolean(cancelBooking)}
        onOpenChange={(open) => !open && setCancelBooking(null)}
      />
    </div>
  );
}
