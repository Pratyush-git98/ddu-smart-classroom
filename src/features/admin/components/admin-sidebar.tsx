"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { DDUGU_BRAND } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { ADMIN_NAV, isAdminNavActive } from "../config/admin-nav";

export function AdminSidebar({
  onClose,
  unreadCount = 0,
  pendingCount = 0,
  issueCount = 0,
}: {
  onClose?: () => void;
  unreadCount?: number;
  pendingCount?: number;
  issueCount?: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-800/80 bg-[#0b1329] text-slate-200">
      <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="flex size-9 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
            D
          </div>
          <div>
            <p className="text-sm font-bold text-white">{DDUGU_BRAND.shortName} · Admin</p>
            <p className="text-[11px] text-slate-400">Campus operations</p>
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

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin sections">
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Governance
        </p>
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const active = isAdminNavActive(pathname, item.href);
          const badge =
            item.href === "/admin/notifications"
              ? unreadCount
              : item.href === "/admin/approvals"
                ? pendingCount
                : item.href === "/admin/issues"
                  ? issueCount
                  : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                active
                  ? "bg-violet-600/20 text-white ring-1 ring-violet-500/40"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={cn("size-4", active ? "text-violet-300" : "text-slate-400")} />
                {item.label}
              </span>
              {badge > 0 && (
                <span className="rounded-full bg-violet-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <p className="border-t border-slate-800 p-3 text-[10px] leading-relaxed text-slate-400">
        Privileged writes are authorized by campus IAM. This console never decides clash outcomes on its own.
      </p>
    </aside>
  );
}
