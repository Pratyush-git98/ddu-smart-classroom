"use client";

import { RoleGuard } from "@/features/authentication";
import { AdminShell } from "@/features/admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
      <AdminShell>{children}</AdminShell>
    </RoleGuard>
  );
}
