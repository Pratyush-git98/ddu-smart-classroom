import React from "react";
import { CampusBadge } from "@/components/common/campus-badge";
import { User } from "lucide-react";
import type { TimetableSlot } from "@/types";

interface TimetableSlotCardProps {
  slot: TimetableSlot;
  className?: string;
}

export function TimetableSlotCard({ slot, className }: TimetableSlotCardProps) {
  const isLab = slot.type === "LAB";

  return (
    <div
      className={`rounded-lg border p-2.5 transition-all text-left ${
        isLab
          ? "border-purple-200 bg-purple-50/50 hover:bg-purple-50"
          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-2xs"
      } ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="font-mono text-[11px] font-bold text-blue-800">
          {slot.subjectCode}
        </span>
        <span
          className={`text-[9px] font-bold uppercase rounded px-1 py-0.2 ${
            isLab ? "bg-purple-200 text-purple-800" : "bg-blue-100 text-blue-700"
          }`}
        >
          {slot.type}
        </span>
      </div>

      <div className="text-xs font-semibold text-slate-900 line-clamp-1 mb-1">
        {slot.subjectName}
      </div>

      <div className="space-y-0.5 text-[11px] text-slate-500">
        <div className="flex items-center gap-1">
          <User className="size-3 text-slate-400 shrink-0" />
          <span className="truncate">{slot.facultyName}</span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <span className="font-mono font-medium text-slate-700">
            {slot.roomNumber}
          </span>
          <CampusBadge campusId={slot.campusId} size="sm" showIcon={false} />
        </div>
      </div>
    </div>
  );
}
