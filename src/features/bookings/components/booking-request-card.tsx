"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CampusBadge } from "@/components/common/campus-badge";
import { BookingStatusBadge } from "@/components/common/status-badge";
import { Calendar, Clock, Users, Check, X } from "lucide-react";
import type { BookingRequest } from "@/types";

interface BookingRequestCardProps {
  booking: BookingRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  className?: string;
}

export function BookingRequestCard({
  booking,
  onApprove,
  onReject,
  className,
}: BookingRequestCardProps) {
  const [currentStatus, setCurrentStatus] = useState(booking.status);

  const handleApprove = () => {
    setCurrentStatus("APPROVED");
    onApprove?.(booking.id);
  };

  const handleReject = () => {
    setCurrentStatus("REJECTED");
    onReject?.(booking.id);
  };

  return (
    <Card className={`border-slate-200/90 bg-white shadow-xs ${className ?? ""}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-900">
                {booking.roomNumber}
              </span>
              <CampusBadge campusId={booking.campusId} size="sm" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-800 line-clamp-1">
              {booking.title}
            </CardTitle>
          </div>
          <BookingStatusBadge status={currentStatus} />
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1 space-y-2.5 text-xs text-slate-600">
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3 text-slate-400" />
            <span>{booking.slot.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3 text-slate-400" />
            <span>{booking.slot.startTime} - {booking.slot.endTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="size-3 text-slate-400" />
            <span>{booking.attendeesCount} Expected</span>
          </div>
          <div className="text-slate-500 font-mono">
            {booking.departmentCode} Dept
          </div>
        </div>

        <div className="text-[11px] text-slate-500">
          Requested by: <strong className="text-slate-800">{booking.facultyName}</strong>
        </div>
      </CardContent>

      {currentStatus === "PENDING" && (
        <CardFooter className="p-4 pt-0 flex gap-2 justify-end border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            className="text-xs text-rose-700 hover:bg-rose-50 border-rose-200 h-7 px-2.5"
          >
            <X className="size-3 mr-1" />
            Reject
          </Button>
          <Button
            size="sm"
            onClick={handleApprove}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-7 px-2.5"
          >
            <Check className="size-3 mr-1" />
            Approve Slot
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
