"use client";

import { CalendarDays, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CampusBadge } from "@/components/common/campus-badge";
import { cn } from "@/lib/utils";
import type { FacultyLecture } from "../types";
import { formatFloor, formatTimeRange, toLocalIsoDate } from "../lib/faculty-time";

const TYPE_CLASS = {
  LECTURE: "bg-indigo-50 text-indigo-800 border-indigo-200",
  LAB: "bg-violet-50 text-violet-800 border-violet-200",
  TUTORIAL: "bg-emerald-50 text-emerald-800 border-emerald-200",
} as const;

export function LectureCard({ lecture, className }: { lecture: FacultyLecture; className?: string }) {
  const isToday = lecture.date === toLocalIsoDate();

  return (
    <article
      className={cn(
        "rounded-xl border bg-white p-4 shadow-xs",
        isToday ? "border-indigo-200 ring-1 ring-indigo-100" : "border-slate-200",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 font-mono text-xs font-bold text-indigo-800">
            <CalendarDays className="size-3.5" />
            {format(parseISO(lecture.date), "EEE d MMM")} · {formatTimeRange(lecture.startTime, lecture.endTime)}
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">
            <span className="font-mono text-indigo-700">{lecture.subjectCode}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            {lecture.subjectName}
          </h3>
        </div>
        <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", TYPE_CLASS[lecture.sessionType])}>
          {lecture.sessionType}
        </Badge>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        B.Tech CSE · Sem {lecture.semester} · Section {lecture.section}
      </p>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
        <p className="flex items-start gap-1.5 text-xs text-slate-600">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
          <span>
            <span className="block font-mono text-sm font-bold text-slate-900">{lecture.venue.roomCode}</span>
            <span>
              {lecture.venue.building} · Floor {formatFloor(lecture.venue.floor)}
            </span>
          </span>
        </p>
        <CampusBadge campusId={lecture.venue.campusId} size="sm" />
      </div>
    </article>
  );
}
