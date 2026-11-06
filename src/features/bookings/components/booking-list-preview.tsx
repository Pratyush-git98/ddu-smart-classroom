import React from "react";
import { BookingRequestCard } from "./booking-request-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import type { BookingRequest } from "@/types";

interface BookingListPreviewProps {
  bookings: BookingRequest[];
  className?: string;
}

export function BookingListPreview({ bookings, className }: BookingListPreviewProps) {
  return (
    <Card className={`border-slate-200 shadow-xs bg-white ${className ?? ""}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="size-4 text-blue-600" />
            <span>Active Room Requisitions & Bookings</span>
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional approvals for lectures, workshops, and symposiums
          </p>
        </div>
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          {bookings.filter((b) => b.status === "PENDING").length} Pending Dean Review
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {bookings.map((booking) => (
            <BookingRequestCard key={booking.id} booking={booking} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

