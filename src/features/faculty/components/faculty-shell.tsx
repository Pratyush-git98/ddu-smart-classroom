"use client";

import { useState, type ReactNode } from "react";
import { useFacultyOverview } from "../hooks/use-faculty-dashboard";
import { FacultySidebar } from "./faculty-sidebar";
import { FacultyTopNav } from "./faculty-top-nav";

export function FacultyShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const overview = useFacultyOverview();
  const unreadCount = overview.data?.unreadNotificationCount ?? 0;
  const pendingCount = overview.data?.pendingBookingCount ?? 0;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <div className="hidden lg:flex lg:shrink-0">
        <FacultySidebar unreadCount={unreadCount} pendingCount={pendingCount} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-50 h-full w-72">
            <FacultySidebar
              unreadCount={unreadCount}
              pendingCount={pendingCount}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <FacultyTopNav onToggleSidebar={() => setMobileOpen(true)} unreadCount={unreadCount} />
        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
