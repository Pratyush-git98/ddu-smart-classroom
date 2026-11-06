"use client";

import { useState, type ReactNode } from "react";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";
import { useUnreadNotificationCount } from "@/features/notifications";
import { useFacultyOverview } from "../hooks/use-faculty-dashboard";
import { FacultySidebar } from "./faculty-sidebar";
import { FacultyTopNav } from "./faculty-top-nav";

export function FacultyShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const overview = useFacultyOverview();
  const unread = useUnreadNotificationCount();
  const unreadCount = unread.data ?? 0;
  const pendingCount = overview.data?.pendingBookingCount ?? 0;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <div className="hidden lg:flex lg:shrink-0">
        <FacultySidebar unreadCount={unreadCount} pendingCount={pendingCount} />
      </div>

      <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} label="Faculty navigation">
        <FacultySidebar
          unreadCount={unreadCount}
          pendingCount={pendingCount}
          onClose={() => setMobileOpen(false)}
        />
      </MobileNavDrawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <FacultyTopNav onToggleSidebar={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
