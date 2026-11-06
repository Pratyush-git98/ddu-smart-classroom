"use client";

import { AppShell } from "@/components/layout";
import { RoleGuard } from "@/features/authentication";

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["FACULTY"]}>
      <AppShell>{children}</AppShell>
    </RoleGuard>
  );
}
