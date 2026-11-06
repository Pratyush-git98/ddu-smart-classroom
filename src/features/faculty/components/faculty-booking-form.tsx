"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FacultyBookingFormSchema, type FacultyBookingFormInput } from "@/schemas/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { useClassroomCatalog, useConfirmClassroomAvailability } from "@/features/classrooms/hooks/use-classroom-search";
import { BOOKING_PURPOSE_OPTIONS } from "@/features/bookings/lib/booking-labels";
import type { AlternativeClassroomSuggestion, FacultyBooking, FacultyBookingDraft } from "../types";
import { toLocalIsoDate } from "../lib/faculty-time";
import { useFacultyBookingCommands } from "../hooks/use-faculty-dashboard";
import { AvailabilitySourceBadge } from "@/features/classrooms/components/availability-source-badge";
import type { RoomAvailability } from "@/types";
import { BookingAlternatives } from "./booking-alternatives";
import { BookingConfirmationDialog } from "./booking-confirmation-dialog";

const selectClassName =
  "h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800";

function tomorrowIso(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toLocalIsoDate(date);
}

function toDraft(values: FacultyBookingFormInput): FacultyBookingDraft {
  return {
    classroomId: values.classroomId,
    building: values.building,
    title: values.title.trim(),
    purpose: values.purpose,
    date: values.date,
    startTime: values.startTime,
    endTime: values.endTime,
    attendeesCount: values.attendeesCount,
    description: values.description?.trim() ? values.description.trim() : undefined,
  };
}

export function FacultyBookingForm({
  booking,
  presetClassroomId,
  onSuccess,
}: {
  booking?: FacultyBooking | null;
  presetClassroomId?: string;
  onSuccess?: (bookingId: string) => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const catalog = useClassroomCatalog();
  const confirmAvailability = useConfirmClassroomAvailability();
  const commands = useFacultyBookingCommands();
  const isEdit = Boolean(booking);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<FacultyBookingDraft | null>(null);
  const [alternatives, setAlternatives] = useState<AlternativeClassroomSuggestion[]>([]);
  const [conflictMessage, setConflictMessage] = useState<string | null>(booking?.conflictMessage ?? null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [availability, setAvailability] = useState<RoomAvailability | null>(null);

  const form = useForm<FacultyBookingFormInput>({
    resolver: zodResolver(FacultyBookingFormSchema),
    defaultValues: {
      classroomId: booking?.classroomId ?? presetClassroomId ?? "",
      building: booking?.venue.building ?? "",
      title: booking?.title ?? "",
      purpose: booking?.purpose ?? "EXTRA_LECTURE",
      date: booking?.date ?? tomorrowIso(),
      startTime: booking?.startTime ?? "14:00",
      endTime: booking?.endTime ?? "15:00",
      attendeesCount: booking?.attendeesCount ?? 40,
      description: booking?.description ?? "",
    },
  });

  const classrooms = catalog.data ?? [];
  const buildingValue = form.watch("building");
  const classroomId = form.watch("classroomId");
  const date = form.watch("date");
  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");

  const buildings = useMemo(
    () => Array.from(new Set(classrooms.map((room) => room.block))).sort((a, b) => a.localeCompare(b)),
    [classrooms]
  );

  const roomsForBuilding = useMemo(
    () =>
      classrooms.filter((room) => !buildingValue || room.block === buildingValue),
    [buildingValue, classrooms]
  );

  const selectedClassroom = classrooms.find((room) => room.id === classroomId);

  useEffect(() => {
    if (classrooms.length === 0) return;
    const selectedId = booking?.classroomId ?? presetClassroomId ?? form.getValues("classroomId");
    const match = classrooms.find((room) => room.id === selectedId);
    if (!match) return;
    form.setValue("classroomId", match.id);
    form.setValue("building", match.block);
  }, [booking?.classroomId, classrooms, form, presetClassroomId]);

  const submitting = commands.submit.isPending || commands.update.isPending;

  const refreshAvailability = async (draft: FacultyBookingDraft) => {
    if (!draft.classroomId || draft.startTime >= draft.endTime) return;
    try {
      const next = await confirmAvailability.mutateAsync({
        classroomId: draft.classroomId,
        date: draft.date,
        startTime: draft.startTime,
        endTime: draft.endTime,
      });
      setAvailability(next);
    } catch {
      setAvailability(null);
    }
  };

  const openConfirmation = form.handleSubmit((values) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setPendingDraft(toDraft(values));
    setConfirmOpen(true);
  });

  const submitToServer = async () => {
    if (!pendingDraft) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result =
        isEdit && booking
          ? await commands.update.mutateAsync({ id: booking.id, draft: pendingDraft })
          : await commands.submit.mutateAsync(pendingDraft);

      await refreshAvailability(pendingDraft);

      if (result.conflict) {
        setConflictMessage(result.message);
        setAlternatives(result.alternatives);
        setConfirmOpen(false);
        toast({
          title: "Scheduling conflict",
          description: result.message,
          variant: "warning",
        });
        return;
      }

      if (!result.success) {
        setErrorMessage(result.message);
        setConfirmOpen(false);
        toast({
          title: "Booking was not accepted",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      setConflictMessage(null);
      setAlternatives([]);
      setSuccessMessage(result.message);
      setConfirmOpen(false);
      toast({
        title: "Booking confirmed by server",
        description: result.message,
        variant: "info",
      });
      const nextId = result.booking?.id;
      if (onSuccess && nextId) {
        onSuccess(nextId);
        return;
      }
      if (nextId) router.push(`/faculty/bookings/${nextId}?status=success`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "The booking service could not be reached.";
      setErrorMessage(message);
      setConfirmOpen(false);
      toast({ title: "Request failed", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Frontend checks only catch invalid times and past dates. Room availability is confirmed when the
        academic booking service responds.
      </p>

      {catalog.isPending && (
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="size-4 animate-spin" /> Loading classroom catalog…
        </p>
      )}
      {catalog.isError && (
        <p className="text-sm text-rose-700">Classroom catalog could not be loaded. Try again in a moment.</p>
      )}

      {successMessage && (
        <div className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {errorMessage}
        </div>
      )}
      {conflictMessage && (
        <div className="space-y-3 rounded-xl border border-orange-200 bg-orange-50 p-3">
          <div className="flex gap-2 text-sm text-orange-900">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-semibold">Conflict detected by the booking service</p>
              <p className="mt-1">{conflictMessage}</p>
            </div>
          </div>
          {availability && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <AvailabilitySourceBadge source={availability.source} />
              <span>
                Availability was refreshed at {new Date(availability.checkedAt).toLocaleTimeString()}. Catalog occupancy
                is not a booking lock; the conflict above is the booking service decision.
              </span>
            </div>
          )}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-orange-800">
              Alternative classrooms
            </p>
            <BookingAlternatives
              alternatives={alternatives}
              onSelect={(suggestion) => {
                form.setValue("building", suggestion.building);
                form.setValue("classroomId", suggestion.classroomId, { shouldValidate: true });
                setConflictMessage(null);
                setSuccessMessage(null);
                toast({
                  title: "Classroom updated",
                  description: `${suggestion.roomNumber} selected. Review and submit again for a server check.`,
                  variant: "info",
                });
              }}
            />
          </div>
        </div>
      )}

      <form className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs" onSubmit={openConfirmation}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Building" error={form.formState.errors.building?.message}>
            <select
              className={selectClassName}
              {...form.register("building", {
                onChange: () => {
                  const nextBuilding = form.getValues("building");
                  const current = classrooms.find((room) => room.id === form.getValues("classroomId"));
                  if (current && current.block !== nextBuilding) {
                    form.setValue("classroomId", "");
                  }
                },
              })}
            >
              <option value="">Select building</option>
              {buildings.map((building) => (
                <option key={building} value={building}>
                  {building}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Classroom" error={form.formState.errors.classroomId?.message}>
            <select
              className={selectClassName}
              {...form.register("classroomId", {
                onChange: () => {
                  const match = classrooms.find((room) => room.id === form.getValues("classroomId"));
                  if (match) form.setValue("building", match.block, { shouldValidate: true });
                },
              })}
            >
              <option value="">Select classroom</option>
              {roomsForBuilding.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.roomNumber} · {room.name} ({room.capacity} seats)
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date" error={form.formState.errors.date?.message}>
            <Input type="date" min={toLocalIsoDate()} className="h-9 text-sm" {...form.register("date")} />
          </Field>
          <Field label="Activity type" error={form.formState.errors.purpose?.message}>
            <select className={selectClassName} {...form.register("purpose")}>
              {BOOKING_PURPOSE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Start time" error={form.formState.errors.startTime?.message}>
            <Input type="time" className="h-9 text-sm" {...form.register("startTime")} />
          </Field>
          <Field label="End time" error={form.formState.errors.endTime?.message}>
            <Input type="time" className="h-9 text-sm" {...form.register("endTime")} />
          </Field>
        </div>
        <Field label="Subject / activity title" error={form.formState.errors.title?.message}>
          <Input className="h-9 text-sm" placeholder="e.g. Operating Systems makeup lecture" {...form.register("title")} />
        </Field>
        <Field label="Expected student count" error={form.formState.errors.attendeesCount?.message}>
          <Input
            type="number"
            min={1}
            max={500}
            className="h-9 text-sm"
            {...form.register("attendeesCount", { valueAsNumber: true })}
          />
        </Field>
        <Field label="Description (optional)" error={form.formState.errors.description?.message}>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-800"
            placeholder="Notes for Dean Academics review"
            {...form.register("description")}
          />
        </Field>

        {selectedClassroom && (
          <p className="text-xs text-slate-500">
            {selectedClassroom.roomNumber} is in {selectedClassroom.block} with {selectedClassroom.capacity} seats.
            Catalog occupancy for {date} {startTime}–{endTime} is not a booking lock.
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="button" variant="outline" onClick={() => router.push("/faculty/bookings")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-indigo-700 text-white hover:bg-indigo-800" disabled={submitting}>
            Review booking
          </Button>
        </div>
      </form>

      <BookingConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        draft={pendingDraft}
        classroom={selectedClassroom}
        isEdit={isEdit}
        submitting={submitting}
        onConfirm={() => void submitToServer()}
      />
    </div>
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
    <div className="space-y-1">
      <Label className="text-xs font-semibold text-slate-700">{label}</Label>
      {children}
      {error && <p className="text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}
