import React from "react";
import { Badge } from "@/components/ui/badge";
import { ROOM_STATUS_CONFIG, BOOKING_STATUS_CONFIG } from "@/lib/design-tokens";
import type { RoomStatus, BookingStatus } from "@/types";
import { cn } from "@/lib/utils";

interface RoomStatusBadgeProps {
  status: RoomStatus;
  className?: string;
  showDot?: boolean;
}

export function RoomStatusBadge({
  status,
  className,
  showDot = true,
}: RoomStatusBadgeProps) {
  const config = ROOM_STATUS_CONFIG[status] ?? {
    label: status,
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-400",
  };

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium border text-xs px-2 py-0.5", config.badgeClass, className)}
    >
      {showDot && (
        <span
          className={cn("size-1.5 rounded-full shrink-0 animate-pulse", config.dotClass)}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </Badge>
  );
}

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = BOOKING_STATUS_CONFIG[status] ?? {
    label: status,
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium border text-xs px-2 py-0.5", config.badgeClass, className)}
    >
      {config.label}
    </Badge>
  );
}

