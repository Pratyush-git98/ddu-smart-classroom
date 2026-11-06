"use client";

import React from "react";
import Link from "next/link";
import { useActiveCampus } from "@/providers/app-provider";
import { useAuth } from "@/hooks/use-auth";
import { getNavigationForRole } from "@/features/authentication/config/navigation";
import { DDUGU_BRAND } from "@/lib/design-tokens";
import {
  Building2,
  Landmark,
  X,
  KeyRound,
  UserPlus,
  Lock,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface AppSidebarProps {
  onClose?: () => void;
  className?: string;
}

export function AppSidebar({ onClose, className }: AppSidebarProps) {
  const { activeCampus, setActiveCampus } = useActiveCampus();
  const { user, isAuthenticated } = useAuth();

  const roleNav = getNavigationForRole(isAuthenticated && user ? user.role : null);

  const navItems: NavGroup[] = [
    ...roleNav.map((group) => ({
      group: group.group,
      items: group.items.map((item) => ({
        label: item.label,
        href: item.href,
        icon: item.icon,
        badge: item.badge,
      })),
    })),
    ...(!isAuthenticated
      ? [
          {
            group: "Institutional SSO & Access",
            items: [
              {
                label: "Portal Sign In",
                href: "/login",
                icon: KeyRound,
              },
              {
                label: "Profile Registration",
                href: "/register",
                icon: UserPlus,
              },
              {
                label: "Clearance Governance",
                href: "/unauthorized",
                icon: Lock,
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <aside
      className={`flex h-full w-72 flex-col bg-[#0b1329] text-slate-200 border-r border-slate-800/80 shadow-xl ${
        className ?? ""
      }`}
    >
      {/* Sidebar Header / Brand Crest */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-md shadow-blue-900/40 transition-transform group-hover:scale-105">
            D
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>{DDUGU_BRAND.shortName}</span>
              <span className="text-[10px] rounded bg-blue-500/20 px-1 py-0.2 text-blue-300 border border-blue-500/30">
                PROD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
              Smart Classroom System
            </p>
          </div>
        </Link>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Campus Selector Card */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/40">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-2 px-1">
          Target University Campus
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {/* IET Campus Button */}
          <button
            type="button"
            onClick={() => setActiveCampus(activeCampus === "IET" ? "ALL" : "IET")}
            className={`flex flex-col items-start rounded-lg p-2 text-left transition-all border ${
              activeCampus === "IET"
                ? "bg-blue-950/70 border-blue-500/50 text-white shadow-xs ring-1 ring-blue-500/40"
                : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Building2 className="size-3.5 text-blue-400" />
              <span className="text-xs font-bold">IET</span>
            </div>
            <span className="text-[10px] text-slate-400">42 Classrooms</span>
          </button>

          {/* Deeksha Bhawan Button */}
          <button
            type="button"
            onClick={() =>
              setActiveCampus(activeCampus === "DEEKSHA_BHAWAN" ? "ALL" : "DEEKSHA_BHAWAN")
            }
            className={`flex flex-col items-start rounded-lg p-2 text-left transition-all border ${
              activeCampus === "DEEKSHA_BHAWAN"
                ? "bg-indigo-950/70 border-indigo-500/50 text-white shadow-xs ring-1 ring-indigo-500/40"
                : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Landmark className="size-3.5 text-indigo-400" />
              <span className="text-xs font-bold">Deeksha B.</span>
            </div>
            <span className="text-[10px] text-slate-400">28 Theatres</span>
          </button>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-3 text-sm">
        {navItems.map((group) => (
          <div key={group.group}>
            <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              {group.group}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    {item.href.startsWith("/") ? (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800/70 hover:text-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="size-4 text-slate-400 transition-colors group-hover:text-blue-400" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${
                              item.badgeColor ??
                              "bg-slate-800 text-slate-300 border-slate-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800/70 hover:text-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="size-4 text-slate-400 transition-colors group-hover:text-blue-400" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${
                              item.badgeColor ??
                              "bg-slate-800 text-slate-300 border-slate-700"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Info / NAAC Accreditation */}
      <div className="border-t border-slate-800/80 p-3 bg-slate-950/60">
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-medium text-slate-200">
              Campus IoT Mesh: Active
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400 leading-tight">
            DDUGU Gorakhpur • {DDUGU_BRAND.accreditation}
          </p>
        </div>
      </div>
    </aside>
  );
}
