"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingStatusBadge } from "@/components/common/status-badge";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import type { FacultyBooking } from "../types";
import { BookingSummaryRows, bookingRecordSummary } from "./booking-summary";
import { useFacultyBookingCommands } from "../hooks/use-faculty-dashboard";

export function BookingDetailDialog({
  booking,
  open,
  onOpenChange,
}: {
  booking: FacultyBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{booking.title}</DialogTitle>
          <DialogDescription>
            Status and allocation below were last confirmed by the academic booking service.
          </DialogDescription>
        </DialogHeader>
        <BookingSummaryRows {...bookingRecordSummary(booking)} />
        {booking.conflictMessage && (
          <p className="text-sm text-orange-800">{booking.conflictMessage}</p>
        )}
        {booking.adminRemark && <p className="text-sm text-slate-600">Admin remark: {booking.adminRemark}</p>}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">State</span>
          <BookingStatusBadge status={booking.status} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CancelBookingDialog({
  booking,
  open,
  onOpenChange,
}: {
  booking: FacultyBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const { cancel } = useFacultyBookingCommands();

  const confirm = async () => {
    if (!booking) return;
    try {
      const result = await cancel.mutateAsync(booking.id);
      toast({
        title: result.success ? "Cancellation confirmed" : "Cancel failed",
        description: result.message,
        variant: result.success ? "warning" : "destructive",
      });
      if (result.success) {
        onOpenChange(false);
        router.push("/faculty/bookings");
      }
    } catch (error) {
      toast({
        title: "Cancel failed",
        description: error instanceof Error ? error.message : "The booking service could not be reached.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel this booking?</DialogTitle>
          <DialogDescription>
            {booking
              ? `${booking.title} on ${booking.date} will be sent to the booking service. The room is only released if the server confirms cancellation.`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Keep booking
          </Button>
          <Button type="button" variant="destructive" onClick={() => void confirm()} disabled={cancel.isPending}>
            {cancel.isPending ? "Submitting…" : "Confirm cancellation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-slate-700">{label}</label>
      {children}
      {error && <p className="text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}
