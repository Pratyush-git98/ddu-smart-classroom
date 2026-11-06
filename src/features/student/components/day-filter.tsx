"use client";

import type { DayOfWeek } from "@/types";
import { cn } from "@/lib/utils";
import { ACADEMIC_DAYS } from "../lib/class-time";

interface DayFilterProps {
  value: DayOfWeek | "ALL";
  onChange: (day: DayOfWeek | "ALL") => void;
  counts?: Partial<Record<DayOfWeek | "ALL", number>>;
}

export function DayFilter({ value, onChange, counts }: DayFilterProps) {
  const options: Array<DayOfWeek | "ALL"> = ["ALL", ...ACADEMIC_DAYS];

  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Filter timetable by day">
      {options.map((day) => {
        const selected = value === day;
        const count = counts?.[day];
        return (
          <button
            key={day}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(day)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              selected
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-800"
            )}
          >
            {day === "ALL" ? "Full week" : day.slice(0, 3)}
            {typeof count === "number" && (
              <span className={cn("ml-1.5 font-mono", selected ? "text-blue-100" : "text-slate-400")}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
