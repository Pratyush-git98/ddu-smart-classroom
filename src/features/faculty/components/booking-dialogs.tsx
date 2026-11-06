"use client";

import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingStatusBadge } from "@/components/common/status-badge";
import { useToast } from "@/components/ui/toast";
import type { FacultyBooking, FacultyBookingDraft, FacultyClassroomHint } from "../types";
import { formatFloor, formatTimeRange } from "../lib/faculty-time";
import { useFacultyBookingCommands } from "../hooks/use-faculty-dashboard";

export function BookingDetailDialog({
  booking,
  open,
  onOpenChange,
}: {
  booking: FacultyBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{booking.title}</DialogTitle>
          <DialogDescription>Sample requisition record. Allocation is confirmed by the booking API.</DialogDescription>
        </DialogHeader>
        <dl className="space-y-2 text-sm">
          <Row label="Status" value={<BookingStatusBadge status={booking.status} />} />
          <Row
            label="When"
            value={`${format(parseISO(booking.date), "EEE d MMM yyyy")} · ${formatTimeRange(booking.startTime, booking.endTime)}`}
          />
          <Row label="Room" value={`${booking.venue.roomCode} · ${booking.venue.building}`} />
          <Row label="Floor" value={formatFloor(booking.venue.floor)} />
          <Row label="Attendees" value={String(booking.attendeesCount)} />
          {booking.description && <Row label="Notes" value={booking.description} />}
          {booking.adminRemark && <Row label="Admin remark" value={booking.adminRemark} />}
        </dl>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="col-span-2 text-slate-800">{value}</dd>
    </div>
  );
}

export function BookingFormDialog({
  open,
  onOpenChange,
  booking,
  presetRoom,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: FacultyBooking | null;
  presetRoom?: FacultyClassroomHint | null;
}) {
  const { toast } = useToast();
  const commands = useFacultyBookingCommands();
  const isEdit = Boolean(booking);

  const form = useForm<FacultyBookingDraft>({
    defaultValues: {
      classroomId: "iet-cs-101",
      roomNumber: "CR-101",
      campusId: "IET",
      title: "",
      purpose: "EXTRA_LECTURE",
      date: "2026-11-12",
      startTime: "14:00",
      endTime: "15:00",
      attendeesCount: 40,
      description: "",
      requiresRecording: false,
    },
  });

  useEffect(() => {
    if (booking) {
      form.reset({
        classroomId: booking.classroomId,
        roomNumber: booking.venue.roomCode,
        campusId: booking.venue.campusId,
        title: booking.title,
        purpose: booking.purpose,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        attendeesCount: booking.attendeesCount,
        description: booking.description ?? "",
        requiresRecording: false,
      });
      return;
    }
    if (presetRoom) {
      form.reset({
        ...form.getValues(),
        classroomId: presetRoom.id,
        roomNumber: presetRoom.roomCode,
        campusId: presetRoom.campusId,
        title: form.getValues("title") || `Requisition · ${presetRoom.roomCode}`,
      });
    }
  }, [booking, form, presetRoom, open]);

  const onSubmit = async (data: FacultyBookingDraft) => {
    if (!data.title.trim() || data.startTime >= data.endTime) {
      toast({
        title: "Check the requisition",
        description: "Add a title and ensure the end time is after the start time.",
        variant: "warning",
      });
      return;
    }

    const draft: FacultyBookingDraft = {
      ...data,
      roomNumber: presetRoom?.roomCode ?? booking?.venue.roomCode ?? data.roomNumber,
    };

    const result = isEdit && booking
      ? await commands.update.mutateAsync({ id: booking.id, draft })
      : await commands.submit.mutateAsync(draft);

    toast({
      title: result.success ? "Queued for booking service" : "Request failed",
      description: result.message,
      variant: result.success ? "info" : "destructive",
    });
    if (result.success) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Amend requisition" : "New classroom requisition"}</DialogTitle>
          <DialogDescription>
            This form does not check timetable clashes. The academic booking API validates availability and
            commits the slot in a single transaction.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <Field label="Title">
            <Input className="h-9 text-sm" {...form.register("title")} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Date">
              <Input type="date" className="h-9 text-sm" {...form.register("date")} />
            </Field>
            <Field label="Purpose">
              <select
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm"
                {...form.register("purpose")}
              >
                <option value="EXTRA_LECTURE">Extra lecture</option>
                <option value="REGULAR_CLASS">Regular class</option>
                <option value="SEMINAR">Seminar</option>
                <option value="EXAM">Exam</option>
                <option value="WORKSHOP">Workshop</option>
              </select>
            </Field>
            <Field label="Start">
              <Input type="time" className="h-9 text-sm" {...form.register("startTime")} />
            </Field>
            <Field label="End">
              <Input type="time" className="h-9 text-sm" {...form.register("endTime")} />
            </Field>
            <Field label="Campus">
              <select
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm"
                {...form.register("campusId")}
              >
                <option value="IET">IET Gorakhpur</option>
                <option value="DEEKSHA_BHAWAN">Deeksha Bhawan</option>
              </select>
            </Field>
            <Field label="Attendees">
              <Input
                type="number"
                min={1}
                className="h-9 text-sm"
                {...form.register("attendeesCount", { valueAsNumber: true })}
              />
            </Field>
          </div>
          <Field label="Classroom ID">
            <Input className="h-9 font-mono text-sm" {...form.register("classroomId")} />
          </Field>
          <p className="text-[11px] text-slate-500">
            Timeline occupancy in Classroom Finder is provisional until the booking service confirms the slot.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              type="submit"
              className="bg-indigo-700 text-white hover:bg-indigo-800"
              disabled={commands.submit.isPending || commands.update.isPending}
            >
              {isEdit ? "Queue amendment" : "Submit requisition"}
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
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold text-slate-700">{label}</Label>
      {children}
      {error && <p className="text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}

export function CancelBookingDialog({
  booking,
  open,
  onOpenChange,
}: {
  booking: FacultyBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { cancel } = useFacultyBookingCommands();

  const confirm = async () => {
    if (!booking) return;
    const result = await cancel.mutateAsync(booking.id);
    toast({
      title: result.success ? "Cancellation queued" : "Cancel failed",
      description: result.message,
      variant: result.success ? "warning" : "destructive",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel this requisition?</DialogTitle>
          <DialogDescription>
            {booking
              ? `${booking.title} on ${booking.date} will be sent to the booking service for release. This portal does not free the slot by itself.`
              : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Keep booking
          </Button>
          <Button type="button" variant="destructive" onClick={() => void confirm()} disabled={cancel.isPending}>
            Request cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
