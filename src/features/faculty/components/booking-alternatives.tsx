"use client";

import { Button } from "@/components/ui/button";
import { CampusBadge } from "@/components/common/campus-badge";
import type { AlternativeClassroomSuggestion } from "../types";
import { formatFloor } from "../lib/faculty-time";
import { facilityLabel } from "@/features/classrooms/lib/classroom-labels";
import type { ClassroomFacility } from "@/types";

export function BookingAlternatives({
  alternatives,
  onSelect,
}: {
  alternatives: AlternativeClassroomSuggestion[];
  onSelect: (suggestion: AlternativeClassroomSuggestion) => void;
}) {
  if (alternatives.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        The booking service did not find another room that matches this capacity, facility set and time window.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {alternatives.map((item) => (
        <li key={item.classroomId} className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-mono text-sm font-bold text-slate-900">{item.roomNumber}</p>
              <p className="text-sm text-slate-700">{item.name}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {item.building} · Floor {formatFloor(item.floor)} · {item.capacity} seats
              </p>
            </div>
            <CampusBadge campusId={item.campusId} size="sm" />
          </div>
          <p className="mt-2 text-xs text-slate-600">{item.reason}</p>
          {item.facilities.length > 0 && (
            <p className="mt-1 text-[11px] text-slate-500">
              {item.facilities
                .map((facility) => facilityLabel(facility as ClassroomFacility))
                .join(" · ")}
            </p>
          )}
          <Button
            type="button"
            size="sm"
            className="mt-3 bg-indigo-700 text-white hover:bg-indigo-800"
            onClick={() => onSelect(item)}
          >
            Use this classroom
          </Button>
        </li>
      ))}
    </ul>
  );
}
