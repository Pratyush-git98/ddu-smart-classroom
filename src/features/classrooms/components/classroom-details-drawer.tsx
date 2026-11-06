"use client";

import { useEffect, type ReactNode } from "react";
import { Monitor, Projector, Snowflake, Tv, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CampusBadge } from "@/components/common/campus-badge";
import { RoomStatusBadge } from "@/components/common/status-badge";
import type { Classroom, ClassroomFacility, RoomAvailability } from "@/types";
import { facilityLabel, formatFloorLabel, roomTypeLabel } from "../lib/classroom-labels";
import { AvailabilityTimeline } from "./availability-timeline";

const FACILITY_ICON: Record<ClassroomFacility, typeof Projector> = {
  PROJECTOR: Projector,
  SMART_BOARD: Tv,
  COMPUTERS: Monitor,
  AIR_CONDITIONING: Snowflake,
};

export function ClassroomDetailsDrawer({
  classroom,
  availability,
  open,
  onOpenChange,
  onSelectSlot,
  footer,
}: {
  classroom: Classroom | null;
  availability: RoomAvailability | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectSlot?: (startTime: string, endTime: string) => void;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open || !classroom) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50"
        aria-label="Close room details"
        onClick={() => onOpenChange(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="classroom-drawer-title"
        className="absolute inset-x-0 bottom-0 flex max-h-[88vh] w-full flex-col overflow-y-auto rounded-t-2xl bg-white shadow-2xl md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:max-w-md md:rounded-none"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
              Room details
            </p>
            <h2 id="classroom-drawer-title" className="font-mono text-xl font-extrabold text-slate-900">
              {classroom.roomNumber}
            </h2>
            <p className="text-sm text-slate-600">{classroom.name}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </Button>
        </header>

        <div className="space-y-5 px-5 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <CampusBadge campusId={classroom.campusId} size="sm" />
            <RoomStatusBadge status={classroom.status} />
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Detail label="Building" value={classroom.block} />
            <Detail label="Floor" value={formatFloorLabel(classroom.floor)} />
            <Detail label="Seating" value={`${classroom.capacity} seats`} />
            <Detail label="Type" value={roomTypeLabel(classroom.type)} />
          </dl>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">Facilities</h3>
            <ul className="mt-2 space-y-1.5">
              {classroom.facilities.map((facility) => {
                const Icon = FACILITY_ICON[facility];
                return (
                  <li
                    key={facility}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800"
                  >
                    <Icon className="size-4 text-indigo-600" />
                    {facilityLabel(facility)}
                    {facility === "COMPUTERS" && classroom.computerCount
                      ? ` (${classroom.computerCount} machines)`
                      : null}
                  </li>
                );
              })}
            </ul>
          </section>

          {availability && (
            <AvailabilityTimeline
              availability={availability}
              onSelectSlot={(slot) => onSelectSlot?.(slot.startTime, slot.endTime)}
            />
          )}

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Floor plan / blueprint
            </h3>
            <FloorPlanPlaceholder
              roomNumber={classroom.roomNumber}
              capacity={classroom.capacity}
              hasPublishedPlan={Boolean(classroom.blueprintUrl)}
            />
          </section>
        </div>

        {footer && <div className="mt-auto border-t border-slate-200 px-5 py-4">{footer}</div>}
      </aside>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function FloorPlanPlaceholder({
  roomNumber,
  capacity,
  hasPublishedPlan,
}: {
  roomNumber: string;
  capacity: number;
  hasPublishedPlan: boolean;
}) {
  const seats = Math.min(24, Math.max(8, Math.round(capacity / 8)));

  return (
    <div className="mt-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1 font-medium">
          <Users className="size-3.5" />
          Schematic only · {roomNumber}
        </span>
        <span>{hasPublishedPlan ? "Official plan linked" : "Official blueprint pending"}</span>
      </div>
      <div className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
        <div className="mb-3 h-6 rounded bg-slate-800 text-center text-[10px] font-semibold leading-6 text-white">
          Teaching wall / board
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {Array.from({ length: seats }).map((_, index) => (
            <span key={index} className="h-5 rounded-sm bg-indigo-100 ring-1 ring-indigo-200" />
          ))}
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-400">Corridor</p>
      </div>
    </div>
  );
}
