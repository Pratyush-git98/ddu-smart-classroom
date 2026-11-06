"use client";

import { useSearchParams } from "next/navigation";
import { FacultyBookingForm } from "./faculty-booking-form";

export function FacultyBookingCreatePage() {
  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroomId") ?? undefined;

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">New classroom booking</h2>
        <p className="mt-1 text-sm text-slate-600">
          Submit a requisition for IET or Deeksha Bhawan. Clash detection runs on the booking API after you confirm.
        </p>
      </div>
      <FacultyBookingForm presetClassroomId={classroomId} />
    </div>
  );
}
