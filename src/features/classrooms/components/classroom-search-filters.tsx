"use client";

import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ClassroomFacility, ClassroomSearchFilters } from "@/types";
import { CLASSROOM_FACILITY_OPTIONS, CLASSROOM_SORT_OPTIONS, ROOM_TYPE_OPTIONS } from "../types";
import { createDefaultClassroomSearchFilters } from "../lib/default-filters";

const selectClassName =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800";

export function ClassroomSearchFiltersForm({
  filters,
  buildings,
  onChange,
  mobileOpen,
  onMobileOpenChange,
}: {
  filters: ClassroomSearchFilters;
  buildings: string[];
  onChange: (next: ClassroomSearchFilters) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}) {
  const patch = (partial: Partial<ClassroomSearchFilters>) => onChange({ ...filters, ...partial });

  const toggleFacility = (facility: ClassroomFacility, checked: boolean) => {
    const next = checked
      ? [...filters.facilities, facility]
      : filters.facilities.filter((item) => item !== facility);
    patch({ facilities: next });
  };

  const fields = (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Field label="Campus / building">
        <select
          className={selectClassName}
          value={filters.campusId}
          onChange={(event) =>
            patch({
              campusId: event.target.value as ClassroomSearchFilters["campusId"],
              building: "ALL",
            })
          }
        >
          <option value="ALL">IET and Deeksha Bhawan</option>
          <option value="IET">IET Campus</option>
          <option value="DEEKSHA_BHAWAN">Deeksha Bhawan</option>
        </select>
      </Field>

      <Field label="Building">
        <select
          className={selectClassName}
          value={filters.building}
          onChange={(event) => patch({ building: event.target.value })}
        >
          <option value="ALL">Any building</option>
          {buildings.map((building) => (
            <option key={building} value={building}>
              {building}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Date">
        <Input
          type="date"
          className="h-9 bg-white text-sm"
          value={filters.date}
          onChange={(event) => patch({ date: event.target.value })}
        />
      </Field>

      <Field label="Room type">
        <select
          className={selectClassName}
          value={filters.roomType}
          onChange={(event) =>
            patch({ roomType: event.target.value as ClassroomSearchFilters["roomType"] })
          }
        >
          {ROOM_TYPE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Start time">
        <Input
          type="time"
          className="h-9 bg-white text-sm"
          value={filters.startTime}
          onChange={(event) => patch({ startTime: event.target.value })}
        />
      </Field>

      <Field label="End time">
        <Input
          type="time"
          className="h-9 bg-white text-sm"
          value={filters.endTime}
          onChange={(event) => patch({ endTime: event.target.value })}
        />
      </Field>

      <Field label="Minimum capacity">
        <Input
          type="number"
          min={0}
          placeholder="Any size"
          className="h-9 bg-white text-sm"
          value={filters.minCapacity ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            patch({ minCapacity: value === "" ? undefined : Number(value) });
          }}
        />
      </Field>

      <Field label="Sort">
        <select
          className={selectClassName}
          value={filters.sort}
          onChange={(event) =>
            patch({ sort: event.target.value as ClassroomSearchFilters["sort"] })
          }
        >
          {CLASSROOM_SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      <fieldset className="space-y-2 sm:col-span-2 lg:col-span-4">
        <legend className="text-xs font-semibold text-slate-700">Facilities</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CLASSROOM_FACILITY_OPTIONS.map((facility) => {
            const checked = filters.facilities.includes(facility.id);
            return (
              <label
                key={facility.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-2 text-xs text-slate-700"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(value) => toggleFacility(facility.id, value === true)}
                />
                {facility.label}
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Search classrooms</h2>
          <p className="text-[11px] text-slate-500">
            Occupancy in results is a catalog hint until the booking service confirms it.
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 md:hidden"
            onClick={() => onMobileOpenChange(!mobileOpen)}
          >
            <SlidersHorizontal className="size-3.5" />
            {mobileOpen ? "Hide filters" : "Filters"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-slate-500"
            onClick={() => onChange(createDefaultClassroomSearchFilters())}
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        </div>
      </div>

      <div className={cn(mobileOpen ? "block" : "hidden md:block")}>{fields}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  const id = useId();
  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, { id })
    : children;

  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs font-semibold text-slate-700">
        {label}
      </Label>
      {control}
    </div>
  );
}
