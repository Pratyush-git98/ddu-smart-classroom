"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { DDUGU_BRAND } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { STUDENT_NAV, isStudentNavActive } from "../config/student-nav";

interface StudentSidebarProps {
  onClose?: () => void;
  unreadCount?: number;
}

export function StudentSidebar({ onClose, unreadCount = 0 }: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 flex-col bg-[#0b1329] text-slate-200 border-r border-slate-800/80">
      <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
        <Link href="/student/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            D
          </div>
          <div>
            <p className="text-sm font-bold text-white">{DDUGU_BRAND.shortName} · IET</p>
            <p className="text-[11px] text-slate-400">Student portal</p>
          </div>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Classroom access
        </p>
        {STUDENT_NAV.map((item) => {
          const Icon = item.icon;
          const active = isStudentNavActive(pathname, item.href);
          const showBadge = item.href === "/student/notifications" && unreadCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                active
                  ? "bg-blue-600/20 text-white ring-1 ring-blue-500/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={cn("size-4", active ? "text-blue-300" : "text-slate-400")} />
                {item.label}
              </span>
              {showBadge && (
                <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-3 text-[10px] leading-relaxed text-slate-400">
        IET Gorakhpur · Smart Classroom locator. Timetable rooms are sample catalog spaces, not official allotments.
      </div>
    </aside>
  );
}
