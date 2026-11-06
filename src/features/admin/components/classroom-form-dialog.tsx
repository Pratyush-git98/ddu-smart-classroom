"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Classroom, ClassroomFacility } from "@/types";
import { AdminClassroomFormSchema, type AdminClassroomFormInput } from "@/schemas/classroom";
import { CLASSROOM_FACILITY_OPTIONS, ROOM_TYPE_OPTIONS } from "@/features/classrooms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { selectClassName } from "../lib/admin-labels";
import type { AdminClassroomDraft } from "../types";

const BUILDING_PRESETS = [
  "Block A (CSE & IT)",
  "Block B (ECE & EE)",
  "Block C (ME & Civil)",
  "Central Computing Facility",
  "Ground Floor (LT-1, LT-2)",
  "First Floor (LT-3, LT-4)",
  "Second Floor (LT-5, LT-6)",
  "Central Auditorium Wing",
];

export function ClassroomFormDialog({
  open,
  onOpenChange,
  classroom,
  pending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classroom?: Classroom | null;
  pending?: boolean;
  onSubmit: (draft: AdminClassroomDraft) => Promise<void> | void;
}) {
  const isEdit = Boolean(classroom);
  const form = useForm<AdminClassroomFormInput>({
    resolver: zodResolver(AdminClassroomFormSchema),
    defaultValues: {
      roomNumber: "",
      name: "",
      campusId: "IET",
      block: "Block A (CSE & IT)",
      floor: 1,
      capacity: 60,
      type: "SMART_LECTURE_HALL",
      facilities: ["PROJECTOR", "AIR_CONDITIONING"],
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      classroom
        ? {
            roomNumber: classroom.roomNumber,
            name: classroom.name,
            campusId: classroom.campusId,
            block: classroom.block,
            floor: classroom.floor,
            capacity: classroom.capacity,
            type: classroom.type,
            facilities: classroom.facilities,
          }
        : {
            roomNumber: "",
            name: "",
            campusId: "IET",
            block: "Block A (CSE & IT)",
            floor: 1,
            capacity: 60,
            type: "SMART_LECTURE_HALL",
            facilities: ["PROJECTOR", "AIR_CONDITIONING"],
          }
    );
  }, [classroom, form, open]);

  const selected = useWatch({ control: form.control, name: "facilities" }) ?? [];

  const toggleFacility = (id: ClassroomFacility) => {
    const next = selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
    form.setValue("facilities", next, { shouldDirty: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit classroom" : "Add classroom"}</DialogTitle>
          <DialogDescription>
            Building, floor and facilities are stored in the campus catalog. Clash locks still belong to the booking API.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-3"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit({
              roomNumber: values.roomNumber.trim(),
              name: values.name.trim(),
              campusId: values.campusId,
              block: values.block.trim(),
              floor: values.floor,
              capacity: values.capacity,
              type: values.type,
              facilities: values.facilities,
            });
          })}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Room number" error={form.formState.errors.roomNumber?.message}>
              <Input {...form.register("roomNumber")} placeholder="CR-204" />
            </Field>
            <Field label="Capacity" error={form.formState.errors.capacity?.message}>
              <Input type="number" min={1} {...form.register("capacity", { valueAsNumber: true })} />
            </Field>
          </div>
          <Field label="Room name" error={form.formState.errors.name?.message}>
            <Input {...form.register("name")} placeholder="CSE Smart Lecture Hall" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Campus" error={form.formState.errors.campusId?.message}>
              <select className={selectClassName} {...form.register("campusId")}>
                <option value="IET">IET</option>
                <option value="DEEKSHA_BHAWAN">Deeksha Bhawan</option>
              </select>
            </Field>
            <Field label="Floor" error={form.formState.errors.floor?.message}>
              <Input type="number" min={0} {...form.register("floor", { valueAsNumber: true })} />
            </Field>
          </div>
          <Field label="Building / block" error={form.formState.errors.block?.message}>
            <Input list="admin-buildings" {...form.register("block")} placeholder="Block A (CSE & IT)" />
            <datalist id="admin-buildings">
              {BUILDING_PRESETS.map((building) => (
                <option key={building} value={building} />
              ))}
            </datalist>
          </Field>
          <Field label="Room type" error={form.formState.errors.type?.message}>
            <select className={selectClassName} {...form.register("type")}>
              {ROOM_TYPE_OPTIONS.filter((item) => item.id !== "ALL").map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-700">Facilities</p>
            <div className="flex flex-wrap gap-2">
              {CLASSROOM_FACILITY_OPTIONS.map((item) => {
                const on = selected.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleFacility(item.id)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                      on
                        ? "border-violet-300 bg-violet-50 text-violet-800"
                        : "border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-violet-700 text-white hover:bg-violet-800" disabled={pending}>
              {pending ? "Saving…" : isEdit ? "Save changes" : "Add classroom"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      {children}
      {error && <span className="block text-[11px] text-rose-600">{error}</span>}
    </label>
  );
}
