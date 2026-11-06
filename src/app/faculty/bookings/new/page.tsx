"use client";

import { Suspense } from "react";
import { FacultyBookingCreatePage } from "@/features/faculty";
import { FacultyLoadingState } from "@/features/faculty/components/query-state";

export default function FacultyNewBookingRoute() {
  return (
    <Suspense fallback={<FacultyLoadingState label="Opening booking form..." />}>
      <FacultyBookingCreatePage />
    </Suspense>
  );
}
