"use client";

import { RoleGuard } from "@/features/authentication";
import { StudentShell } from "@/features/student";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["STUDENT"]}>
      <StudentShell>{children}</StudentShell>
    </RoleGuard>
  );
}
