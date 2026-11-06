"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionUserMenu } from "@/features/authentication/components/session-user-menu";
import { STUDENT_NAV, isStudentNavActive } from "../config/student-nav";

interface StudentTopNavProps {
  onToggleSidebar: () => void;
  unreadCount?: number;
}

export function StudentTopNav({ onToggleSidebar, unreadCount = 0 }: StudentTopNavProps) {
  const pathname = usePathname();
  const current = STUDENT_NAV.find((item) => isStudentNavActive(pathname, item.href));

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden text-slate-700"
            aria-label="Open navigation"
          >
            <Menu className="size-4" />
          </Button>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Student workspace
            </p>
            <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">
              {current?.label ?? "Overview"}
            </h1>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Student sections">
          {STUDENT_NAV.map((item) => {
            const active = isStudentNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${
                  active ? "bg-blue-50 text-blue-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link href="/student/notifications" className="relative">
            <Button variant="ghost" size="icon" aria-label="Notifications" className="text-slate-600">
              <Bell className="size-4" />
            </Button>
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
          <SessionUserMenu />
        </div>
      </div>
    </header>
  );
}
