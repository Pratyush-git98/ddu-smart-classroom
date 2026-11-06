"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CampusBadge } from "@/components/common/campus-badge";
import { RoomStatusBadge } from "@/components/common/status-badge";
import { useDebounce } from "@/hooks/use-debounce";
import { useStudentClassroomSearch } from "../hooks/use-student-dashboard";
import { DashboardEmptyState, DashboardErrorState, DashboardLoadingState } from "./query-state";

export function FindClassroomPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const debounced = useDebounce(query, 250);
  const search = useStudentClassroomSearch(debounced);

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Find a classroom</h2>
        <p className="mt-1 text-sm text-slate-600">
          Search the IET and Deeksha Bhawan facility catalog by room code, block or floor. This locator is
          not an official allotment list.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try CR-101, Block A, Floor 2, LT..."
          className="h-10 bg-white pl-10 text-sm"
          aria-label="Search classrooms"
        />
      </div>

      {search.isPending && <DashboardLoadingState label="Searching facility catalog..." />}

      {search.isError && (
        <DashboardErrorState
          message="Classroom catalog could not be loaded."
          onRetry={() => void search.refetch()}
        />
      )}

      {search.data && search.data.length === 0 && (
        <DashboardEmptyState
          title="No matching rooms"
          description="No sample facility matches that search. Try a block name (Block A) or a catalog code such as CR-101."
        />
      )}

      {search.data && search.data.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {search.data.map((room) => (
            <li key={room.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-lg font-extrabold text-slate-900">{room.roomCode}</p>
                  <p className="text-sm font-medium text-slate-800">{room.name}</p>
                </div>
                <RoomStatusBadge status={room.status} />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {room.building}
                <span className="mt-0.5 block text-xs text-slate-500">
                  Floor {room.floor === 0 ? "G" : room.floor} · {room.capacity} seats
                </span>
              </p>
              <div className="mt-3">
                <CampusBadge campusId={room.campusId} size="sm" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
