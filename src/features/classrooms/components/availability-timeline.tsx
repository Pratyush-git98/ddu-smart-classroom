"use client";

import { cn } from "@/lib/utils";
import type { RoomAvailability, RoomAvailabilitySlot } from "@/types";
import { timeToMinutes, windowsOverlap } from "../lib/classroom-labels";
import { AvailabilitySourceBadge } from "./availability-source-badge";

const DAY_START = timeToMinutes("09:00");
const DAY_END = timeToMinutes("17:00");
const DAY_SPAN = DAY_END - DAY_START;

function slotOffset(slot: RoomAvailabilitySlot) {
  const start = Math.max(timeToMinutes(slot.startTime) - DAY_START, 0);
  const end = Math.min(timeToMinutes(slot.endTime) - DAY_START, DAY_SPAN);
  return {
    left: `${(start / DAY_SPAN) * 100}%`,
    width: `${(Math.max(end - start, 20) / DAY_SPAN) * 100}%`,
  };
}

export function AvailabilityTimeline({
  availability,
  onSelectSlot,
}: {
  availability: RoomAvailability;
  onSelectSlot?: (slot: RoomAvailabilitySlot) => void;
}) {
  const window = availability.requestedWindow;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Day timeline · {availability.date}
        </p>
        <AvailabilitySourceBadge source={availability.source} />
      </div>

      <div
        className="relative h-11 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
        role="list"
        aria-label="Occupied and free time slots"
      >
        {availability.slots.map((slot) => {
          const geometry = slotOffset(slot);
          const inWindow = windowsOverlap(
            slot.startTime,
            slot.endTime,
            window.startTime,
            window.endTime
          );
          const occupied = slot.status === "OCCUPIED";

          return (
            <button
              key={`${slot.startTime}-${slot.endTime}`}
              type="button"
              role="listitem"
              title={`${slot.startTime}–${slot.endTime} · ${slot.label ?? slot.status}`}
              aria-label={`${slot.startTime} to ${slot.endTime}, ${occupied ? "occupied" : "free"}`}
              onClick={() => onSelectSlot?.(slot)}
              className={cn(
                "absolute top-1 bottom-1 rounded-md px-1 text-left transition-shadow focus-visible:ring-2 focus-visible:ring-indigo-500",
                occupied ? "bg-rose-300/90 hover:bg-rose-400" : "bg-emerald-300/90 hover:bg-emerald-400",
                inWindow && "ring-2 ring-indigo-700 ring-offset-1"
              )}
              style={geometry}
            >
              <span className="block truncate text-[9px] font-bold text-slate-900">
                {slot.startTime}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-emerald-400" /> Free
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-rose-400" /> Occupied
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm ring-2 ring-indigo-700" /> Selected window
        </span>
        <span className="ml-auto font-medium text-slate-600">
          {window.startTime}–{window.endTime}: {window.isFree ? "appears free" : "clash in catalog"}
        </span>
      </div>
    </div>
  );
}
