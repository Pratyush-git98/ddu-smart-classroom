import type { BookingRequest, BookingStatus, BookingPurpose } from "@/types";

export type { BookingRequest, BookingStatus, BookingPurpose };

export interface BookingCardProps {
  booking: BookingRequest;
  onApprove?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
}

