import { Suspense } from "react";
import { AdminClassroomsPage } from "@/features/admin";
import { AdminLoadingState } from "@/features/admin/components/query-state";

export default function AdminClassroomsRoute() {
  return (
    <Suspense fallback={<AdminLoadingState label="Opening classroom catalog..." />}>
      <AdminClassroomsPage />
    </Suspense>
  );
}
