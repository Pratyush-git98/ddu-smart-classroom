import { Suspense } from "react";
import { StudentTimetablePage } from "@/features/student";
import { DashboardLoadingState } from "@/features/student/components/query-state";

export default function StudentTimetableRoute() {
  return (
    <Suspense fallback={<DashboardLoadingState label="Opening timetable..." />}>
      <StudentTimetablePage />
    </Suspense>
  );
}
