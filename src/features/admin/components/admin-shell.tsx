"use client";

import { useState, type ReactNode } from "react";
import { useUnreadNotificationCount } from "@/features/notifications";
import { useAdminOverview } from "../hooks/use-admin-dashboard";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopNav } from "./admin-top-nav";

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const overview = useAdminOverview();
  const unread = useUnreadNotificationCount();
  const unreadCount = unread.data ?? 0;
  const pendingCount = overview.data?.stats.pendingApprovals ?? 0;
  const issueCount = overview.data?.stats.unresolvedIssues ?? 0;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <div className="hidden lg:flex lg:shrink-0">
        <AdminSidebar unreadCount={unreadCount} pendingCount={pendingCount} issueCount={issueCount} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 h-full w-72">
            <AdminSidebar
              unreadCount={unreadCount}
              pendingCount={pendingCount}
              issueCount={issueCount}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopNav onToggleSidebar={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
