"use client";

import type { ReactNode } from "react";
import { AlertCircle, Inbox, Loader2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common";

export function ClassroomSearchLoading() {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Loader2 className="size-4 animate-spin text-indigo-600" />
        Checking the facility catalog…
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-48 animate-pulse rounded-xl bg-slate-200/70" />
        <div className="h-48 animate-pulse rounded-xl bg-slate-200/60" />
        <div className="h-48 animate-pulse rounded-xl bg-slate-200/50 sm:col-span-2 lg:col-span-1" />
      </div>
    </div>
  );
}

export function ClassroomSearchError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Classroom search could not be loaded"
      description={message ?? "The classroom service did not respond. Availability was not confirmed."}
      action={
        onRetry ? (
          <Button type="button" size="sm" onClick={onRetry} className="bg-indigo-700 text-white hover:bg-indigo-800">
            Try again
          </Button>
        ) : undefined
      }
    />
  );
}

export function ClassroomSearchEmpty({
  action,
}: {
  action?: ReactNode;
}) {
  return (
    <EmptyState
      icon={SearchX}
      title="No rooms match these filters"
      description="Widen campus or building, lower minimum capacity, or remove a facility requirement. Catalog occupancy is provisional until the booking service confirms a slot."
      action={action}
    />
  );
}

export function ClassroomSearchIdle() {
  return (
    <EmptyState
      icon={Inbox}
      title="Set a date and window to search"
      description="Choose IET or Deeksha Bhawan, a time range, and optional facilities. Results stay advisory until server confirmation."
    />
  );
}
