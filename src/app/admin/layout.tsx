"use client";

import { AppShell } from "@/components/layout";
import { RoleGuard } from "@/features/authentication";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <AppShell>{children}</AppShell>
    </RoleGuard>
  );
}
