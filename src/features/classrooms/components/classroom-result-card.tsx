"use client";

import type { ReactNode } from "react";
import { MapPinned, Monitor, Projector, Snowflake, Tv, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampusBadge } from "@/components/common/campus-badge";
import { RoomStatusBadge } from "@/components/common/status-badge";
import type { ClassroomFacility, ClassroomSearchMatch } from "@/types";
import { facilityLabel, formatFloorLabel, roomTypeLabel } from "../lib/classroom-labels";
import { AvailabilitySourceBadge } from "./availability-source-badge";
import { AvailabilityTimeline } from "./availability-timeline";

const FACILITY_ICON: Record<ClassroomFacility, typeof Projector> = {
  PROJECTOR: Projector,
  SMART_BOARD: Tv,
  COMPUTERS: Monitor,
  AIR_CONDITIONING: Snowflake,
};

export function ClassroomResultCard({
  match,
  onViewDetails,
  onSelectSlot,
  onConfirmAvailability,
  confirming,
  requestAction,
}: {
  match: ClassroomSearchMatch;
  onViewDetails: () => void;
  onSelectSlot: (startTime: string, endTime: string) => void;
  onConfirmAvailability: () => void;
  confirming?: boolean;
  requestAction?: ReactNode;
}) {
  const { classroom, availability } = match;
  const windowFree = availability.requestedWindow.isFree && classroom.status !== "MAINTENANCE";

  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-mono text-lg font-extrabold tracking-tight text-slate-900">
              {classroom.roomNumber}
            </h3>
            <CampusBadge campusId={classroom.campusId} size="sm" />
          </div>
          <p className="mt-0.5 text-sm font-medium text-slate-800">{classroom.name}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <MapPinned className="size-3.5 shrink-0" />
            {classroom.block} · {formatFloorLabel(classroom.floor)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <RoomStatusBadge status={classroom.status} />
          <AvailabilitySourceBadge source={availability.source} />
        </div>
      </header>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 ring-1 ring-slate-200">
          <Users className="size-3.5" />
          {classroom.capacity} seats
        </span>
        <span className="rounded-md bg-slate-50 px-2 py-1 ring-1 ring-slate-200">
          {roomTypeLabel(classroom.type)}
        </span>
        <span
          className={
            windowFree
              ? "rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-800 ring-1 ring-emerald-200"
              : "rounded-md bg-rose-50 px-2 py-1 font-medium text-rose-800 ring-1 ring-rose-200"
          }
        >
          {windowFree ? "Window looks free" : "Window looks occupied"}
        </span>
      </div>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {classroom.facilities.map((facility) => {
          const Icon = FACILITY_ICON[facility];
          return (
            <li
              key={facility}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700"
            >
              <Icon className="size-3 text-indigo-600" />
              {facilityLabel(facility)}
              {facility === "COMPUTERS" && classroom.computerCount
                ? ` · ${classroom.computerCount}`
                : null}
            </li>
          );
        })}
      </ul>

      <div className="mt-4">
        <AvailabilityTimeline
          availability={availability}
          onSelectSlot={(slot) => onSelectSlot(slot.startTime, slot.endTime)}
        />
      </div>

      <footer className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <Button type="button" variant="outline" size="sm" className="h-8" onClick={onViewDetails}>
          Room details
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 text-indigo-700"
          disabled={confirming}
          onClick={onConfirmAvailability}
        >
          {confirming ? "Checking booking service…" : "Confirm with server"}
        </Button>
        <div className="ml-auto">{requestAction}</div>
      </footer>
    </article>
  );
}
