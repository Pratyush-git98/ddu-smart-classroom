"use client";

import { Loader2 } from "lucide-react";

export function StaleDataHint({
  isFetching,
  isStale,
  dataUpdatedAt,
  hasData,
}: {
  isFetching: boolean;
  isStale: boolean;
  dataUpdatedAt: number;
  hasData: boolean;
}) {
  if (!hasData) return null;

  const updated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  if (isFetching) {
    return (
      <p className="flex items-center gap-1.5 text-[11px] text-slate-500" role="status">
        <Loader2 className="size-3 animate-spin" />
        Showing cached campus data while a fresh copy loads
        {updated ? ` · last updated ${updated}` : ""}
      </p>
    );
  }

  if (isStale) {
    return (
      <p className="text-[11px] text-amber-800" role="status">
        Cached as of {updated ?? "recently"}. Newer timetable or occupancy data may exist.
      </p>
    );
  }

  return null;
}
