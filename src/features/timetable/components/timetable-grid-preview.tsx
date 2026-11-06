"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TimetableSlotCard } from "./timetable-slot-card";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { Clock } from "lucide-react";
import type { TimetableSlot, DayOfWeek } from "@/types";

interface TimetableGridPreviewProps {
  slots: TimetableSlot[];
  className?: string;
}

export function TimetableGridPreview({ slots, className }: TimetableGridPreviewProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Monday");
  const [selectedBranch, setSelectedBranch] = useState<string>("CSE");

  const filteredSlots = slots.filter(
    (s) => s.dayOfWeek === selectedDay && (selectedBranch === "ALL" || s.branch === selectedBranch)
  );

  return (
    <Card className={`border-slate-200 shadow-xs bg-white ${className ?? ""}`}>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="size-4 text-blue-600" />
            <span>Smart Master Timetable & Slot Matrix</span>
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            DDUGU Semester Lecture & Lab Scheduling Matrix
          </p>
        </div>

        {/* Branch Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(["CSE", "MBA", "ALL"] as const).map((branch) => (
            <button
              key={branch}
              type="button"
              onClick={() => setSelectedBranch(branch)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-all ${
                selectedBranch === branch
                  ? "bg-blue-700 text-white border-blue-700 shadow-2xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {branch === "ALL" ? "All Branches" : branch}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Day of Week Selector */}
        <div className="flex overflow-x-auto gap-1 border-b border-slate-100 pb-2">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDay === day
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Periods Display */}
        {filteredSlots.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            No regular lectures scheduled for {selectedDay} in {selectedBranch} branch.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredSlots.map((slot) => (
              <div key={slot.id} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
                  <span>Period {slot.periodNumber}</span>
                  <span>{slot.startTime} - {slot.endTime}</span>
                </div>
                <TimetableSlotCard slot={slot} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
