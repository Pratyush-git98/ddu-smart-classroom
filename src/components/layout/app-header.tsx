"use client";

import React from "react";
import { DDUGU_BRAND } from "@/lib/design-tokens";
import { useActiveCampus } from "@/providers/app-provider";
import { CampusBadge } from "@/components/common/campus-badge";
import { Button } from "@/components/ui/button";
import { SessionUserMenu } from "@/features/authentication/components/session-user-menu";
import {
  Search,
  SlidersHorizontal,
  GraduationCap,
} from "lucide-react";
import { NotificationDropdown } from "@/features/notifications";

interface AppHeaderProps {
  onToggleSidebar?: () => void;
}

export function AppHeader({
  onToggleSidebar,
}: AppHeaderProps) {
  const { activeCampus, setActiveCampus } = useActiveCampus();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile trigger & University branding */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="lg:hidden text-slate-700 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            <SlidersHorizontal className="size-4" />
          </Button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-blue-900 text-white shadow-xs ring-1 ring-blue-950/20">
            <GraduationCap className="size-5 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-slate-900 sm:text-base">
                {DDUGU_BRAND.shortName}
              </span>
              <span className="hidden md:inline-block text-xs font-medium text-slate-400">|</span>
              <span className="hidden md:inline-block text-xs font-medium text-slate-600">
                {DDUGU_BRAND.portalName}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Gorakhpur, U.P. • {DDUGU_BRAND.accreditation}
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Quick Campus Filter Switcher */}
      <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setActiveCampus("ALL")}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            activeCampus === "ALL"
              ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All Facilities
        </button>
        <button
          type="button"
          onClick={() => setActiveCampus("IET")}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            activeCampus === "IET"
              ? "bg-white text-blue-700 shadow-xs ring-1 ring-blue-200"
              : "text-slate-600 hover:text-blue-700"
          }`}
        >
          IET Campus
        </button>
        <button
          type="button"
          onClick={() => setActiveCampus("DEEKSHA_BHAWAN")}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
            activeCampus === "DEEKSHA_BHAWAN"
              ? "bg-white text-indigo-700 shadow-xs ring-1 ring-indigo-200"
              : "text-slate-600 hover:text-indigo-700"
          }`}
        >
          Deeksha Bhawan
        </button>
      </div>

      {/* Right: Actions, Search, Notifications, Role preview */}
      <div className="flex items-center gap-2 sm:gap-3">
        {activeCampus !== "ALL" && (
          <div className="hidden sm:block">
            <CampusBadge campusId={activeCampus} size="sm" />
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2 text-xs text-slate-500 border-slate-200 hover:text-slate-900"
        >
          <Search className="size-3.5" />
          <span>Quick Search (CR, LT, Faculty)...</span>
          <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
            ⌘K
          </kbd>
        </Button>

        <NotificationDropdown />

        <SessionUserMenu />
      </div>
    </header>
  );
}
