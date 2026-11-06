import { Suspense } from "react";
import { FindClassroomPage } from "@/features/student";
import { DashboardLoadingState } from "@/features/student/components/query-state";

export default function FindClassroomRoute() {
  return (
    <Suspense fallback={<DashboardLoadingState label="Opening classroom search..." />}>
      <FindClassroomPage />
    </Suspense>
  );
}
