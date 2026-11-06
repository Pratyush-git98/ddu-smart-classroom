"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CampusBadge } from "@/components/common/campus-badge";
import { RoomStatusBadge } from "@/components/common/status-badge";
import { useDebounce } from "@/hooks/use-debounce";
import { useFacultyClassroomSearch } from "../hooks/use-faculty-dashboard";
import { formatFloor } from "../lib/faculty-time";
import { FacultyEmptyState, FacultyErrorState, FacultyLoadingState } from "./query-state";

export function FacultyFindClassroomPage() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);
  const search = useFacultyClassroomSearch(debounced);

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Find a classroom</h2>
        <p className="mt-1 text-sm text-slate-600">
          Catalog occupancy is shown for orientation only. Requesting a room queues a requisition; clash
          prevention stays on the academic booking service.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search CR-101, Block A, Floor 2, seminar..."
          className="h-10 bg-white pl-10 text-sm"
          aria-label="Search classrooms"
        />
      </div>

      {search.isPending && <FacultyLoadingState label="Searching facility catalog..." />}
      {search.isError && (
        <FacultyErrorState message="Classroom catalog could not be loaded." onRetry={() => void search.refetch()} />
      )}
      {search.data && search.data.length === 0 && (
        <FacultyEmptyState
          title="No matching rooms"
          description="Try a catalog code such as CR-101 or a block name such as Block A."
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
                  Floor {formatFloor(room.floor)} · {room.capacity} seats
                </span>
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <CampusBadge campusId={room.campusId} size="sm" />
                <Button
                  type="button"
                  size="sm"
                  className="bg-indigo-700 text-white hover:bg-indigo-800"
                  render={<Link href={`/faculty/bookings/new?classroomId=${room.id}`} />}
                >
                  Request this room
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
