"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CampusBadge } from "@/components/common/campus-badge";
import { Badge } from "@/components/ui/badge";
import { selectClassName } from "../lib/admin-labels";
import { useAdminTimetable } from "../hooks/use-admin-dashboard";
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from "./query-state";

export function AdminTimetablePage() {
  const timetable = useAdminTimetable();
  const [campusId, setCampusId] = useState<"ALL" | "IET" | "DEEKSHA_BHAWAN">("ALL");
  const [day, setDay] = useState<"ALL" | string>("ALL");

  const slots = useMemo(() => {
    return (timetable.data ?? []).filter((slot) => {
      if (campusId !== "ALL" && slot.campusId !== campusId) return false;
      if (day !== "ALL" && slot.dayOfWeek !== day) return false;
      return true;
    });
  }, [campusId, day, timetable.data]);

  if (timetable.isPending) return <AdminLoadingState label="Loading master timetable..." />;
  if (timetable.isError) {
    return (
      <AdminErrorState
        message="Timetable slots could not be loaded from the academic service."
        onRetry={() => void timetable.refetch()}
      />
    );
  }

  const conflictCount = slots.filter((slot) => slot.hasConflict).length;

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Timetable management</h2>
        <p className="mt-1 text-sm text-slate-600">
          Master grid for IET and Deeksha Bhawan. Overlapping room allocations are flagged before commit.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select className={`${selectClassName} w-44`} value={campusId} onChange={(event) => setCampusId(event.target.value as typeof campusId)}>
          <option value="ALL">All campuses</option>
          <option value="IET">IET</option>
          <option value="DEEKSHA_BHAWAN">Deeksha Bhawan</option>
        </select>
        <select className={`${selectClassName} w-40`} value={day} onChange={(event) => setDay(event.target.value)}>
          <option value="ALL">All days</option>
          <option>Monday</option>
          <option>Tuesday</option>
          <option>Wednesday</option>
          <option>Thursday</option>
          <option>Friday</option>
          <option>Saturday</option>
        </select>
        {conflictCount > 0 && (
          <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-800">
            <AlertTriangle className="mr-1 size-3" />
            {conflictCount} conflict{conflictCount === 1 ? "" : "s"}
          </Badge>
        )}
      </div>

      {slots.length === 0 ? (
        <AdminEmptyState title="No timetable rows" description="No periods match this campus and day filter." />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Conflict</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots.map((slot) => (
                <TableRow key={slot.id} className={slot.hasConflict ? "bg-orange-50/70" : undefined}>
                  <TableCell>{slot.dayOfWeek}</TableCell>
                  <TableCell className="text-xs">
                    P{slot.periodNumber} · {slot.startTime}–{slot.endTime}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900">{slot.subjectCode}</div>
                    <div className="text-[11px] text-slate-500">{slot.subjectName}</div>
                  </TableCell>
                  <TableCell className="text-xs">{slot.facultyName}</TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold">{slot.roomNumber}</div>
                    <CampusBadge campusId={slot.campusId} size="sm" />
                  </TableCell>
                  <TableCell className="text-xs">
                    {slot.branch} · Sem {slot.semester} · {slot.section}
                  </TableCell>
                  <TableCell>
                    {slot.hasConflict ? (
                      <p className="max-w-[14rem] whitespace-normal text-[11px] font-medium text-orange-800">
                        {slot.conflictReason}
                      </p>
                    ) : (
                      <span className="text-[11px] text-emerald-700">Clear</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
