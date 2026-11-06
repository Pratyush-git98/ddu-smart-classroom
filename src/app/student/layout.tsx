"use client";

import { AppShell } from "@/components/layout";
import { RoleGuard } from "@/features/authentication";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["STUDENT"]}>
      <AppShell>{children}</AppShell>
    </RoleGuard>
  );
}
