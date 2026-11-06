"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FacultyBookingDraft } from "../types";
import { BookingSummaryRows, bookingDraftSummary } from "./booking-summary";
import type { Classroom } from "@/types";

export function BookingConfirmationDialog({
  open,
  onOpenChange,
  draft,
  classroom,
  isEdit,
  submitting,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: FacultyBookingDraft | null;
  classroom: Classroom | undefined;
  isEdit: boolean;
  submitting: boolean;
  onConfirm: () => void;
}) {
  if (!draft) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm booking request</DialogTitle>
          <DialogDescription>
            Review the full summary, then submit it to the academic booking service. This portal does not
            lock the room; only the server response is final.
          </DialogDescription>
        </DialogHeader>
        <BookingSummaryRows {...bookingDraftSummary(draft, classroom)} />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Go back
          </Button>
          <Button
            type="button"
            className="bg-indigo-700 text-white hover:bg-indigo-800"
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Submitting to booking service…
              </>
            ) : isEdit ? (
              "Submit amendment"
            ) : (
              "Submit booking"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
