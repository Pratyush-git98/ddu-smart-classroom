"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ClassSessionStatus, StudentSessionType } from "../types";

const STATUS_STYLES: Record<ClassSessionStatus, string> = {
  LIVE: "bg-blue-600 text-white border-blue-600",
  UPCOMING: "bg-sky-50 text-sky-800 border-sky-200",
  COMPLETED: "bg-slate-100 text-slate-600 border-slate-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  ROOM_CHANGED: "bg-amber-50 text-amber-800 border-amber-200",
};

const STATUS_LABELS: Record<ClassSessionStatus, string> = {
  LIVE: "In session",
  UPCOMING: "Upcoming",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ROOM_CHANGED: "Room changed",
};

export function ClassStatusBadge({
  status,
  className,
}: {
  status: ClassSessionStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] font-semibold uppercase tracking-wide", STATUS_STYLES[status], className)}
    >
      {status === "LIVE" && (
        <span className="size-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
      )}
      {STATUS_LABELS[status]}
    </Badge>
  );
}

const TYPE_STYLES: Record<StudentSessionType, string> = {
  LECTURE: "bg-blue-50 text-blue-800 border-blue-200",
  LAB: "bg-violet-50 text-violet-800 border-violet-200",
  TUTORIAL: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

export function SessionTypeBadge({ type }: { type: StudentSessionType }) {
  return (
    <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", TYPE_STYLES[type])}>
      {type}
    </Badge>
  );
}
