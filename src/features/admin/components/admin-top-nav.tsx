"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SessionUserMenu } from "@/features/authentication/components/session-user-menu";
import { NotificationDropdown } from "@/features/notifications";
import { ADMIN_NAV, isAdminNavActive } from "../config/admin-nav";

export function AdminTopNav({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const current = ADMIN_NAV.find((item) => isAdminNavActive(pathname, item.href));

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
              Admin workspace
            </p>
            <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">
              {current?.label ?? "Overview"}
            </h1>
          </div>
        </div>

        <nav className="hidden max-w-3xl items-center gap-1 overflow-x-auto xl:flex" aria-label="Admin sections">
          {ADMIN_NAV.map((item) => {
            const active = isAdminNavActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-md px-2 py-1.5 text-xs font-medium ${
                  active ? "bg-violet-50 text-violet-800" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <NotificationDropdown inboxHref="/admin/notifications" />
          <SessionUserMenu />
        </div>
      </div>
    </header>
  );
}
