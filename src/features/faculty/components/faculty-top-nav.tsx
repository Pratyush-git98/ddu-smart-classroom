"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionUserMenu } from "@/features/authentication/components/session-user-menu";
import { NotificationDropdown } from "@/features/notifications";
import { FACULTY_NAV, isFacultyNavActive } from "../config/faculty-nav";

export function FacultyTopNav({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const current = FACULTY_NAV.find((item) => isFacultyNavActive(pathname, item.href));

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-slate-700 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-4" />
          </Button>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Faculty workspace
            </p>
            <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">
              {current?.label ?? "Overview"}
            </h1>
          </div>
        </div>

        <nav
          className="hidden max-w-xl items-center gap-1 overflow-x-auto lg:flex"
          aria-label="Faculty sections"
        >
          {FACULTY_NAV.map((item) => {
            const active = isFacultyNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-md px-2 py-1.5 text-xs font-medium ${
                  active ? "bg-indigo-50 text-indigo-800" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link href="/faculty/classrooms">
            <Button
              size="sm"
              className="hidden h-8 bg-indigo-700 text-xs text-white hover:bg-indigo-800 sm:inline-flex"
            >
              <Search className="size-3.5" />
              Find classroom
            </Button>
          </Link>
          <NotificationDropdown inboxHref="/faculty/notifications" />
          <SessionUserMenu />
        </div>
      </div>
    </header>
  );
}
