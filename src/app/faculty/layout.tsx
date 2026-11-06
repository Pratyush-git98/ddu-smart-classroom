"use client";

import { RoleGuard } from "@/features/authentication";
import { FacultyShell } from "@/features/faculty";

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["FACULTY"]}>
      <FacultyShell>{children}</FacultyShell>
    </RoleGuard>
  );
}
