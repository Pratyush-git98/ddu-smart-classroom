"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import type { Classroom, ClassroomSearchFilters, ClassroomSearchMatch, RoomAvailability } from "@/types";
import { useClassroomBuildings, useClassroomSearch, useConfirmClassroomAvailability } from "../hooks/use-classroom-search";
import { createDefaultClassroomSearchFilters } from "../lib/default-filters";
import { ClassroomDetailsDrawer } from "./classroom-details-drawer";
import { StaleDataHint } from "@/components/query/stale-data-hint";
import { ClassroomSearchEmpty, ClassroomSearchError, ClassroomSearchLoading } from "./classroom-finder-states";
import { ClassroomResultCard } from "./classroom-result-card";
import { ClassroomSearchFiltersForm } from "./classroom-search-filters";

export function ClassroomFinder({
  renderRequestAction,
}: {
  renderRequestAction?: (classroom: Classroom) => ReactNode;
}) {
  const [filters, setFilters] = useState<ClassroomSearchFilters>(createDefaultClassroomSearchFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Record<string, RoomAvailability>>({});
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const buildingsQuery = useClassroomBuildings(filters.campusId);
  const search = useClassroomSearch(filters);
  const confirm = useConfirmClassroomAvailability();

  const results = useMemo(() => {
    return (search.data?.results ?? []).map((match) => {
      const overlay = confirmed[match.classroom.id];
      if (!overlay) return match;
      if (overlay.date !== filters.date) return match;
      return { ...match, availability: overlay };
    });
  }, [confirmed, filters.date, search.data?.results]);

  const selected: ClassroomSearchMatch | undefined = results.find(
    (item) => item.classroom.id === selectedId
  );

  const onConfirm = async (classroom: Classroom) => {
    setConfirmingId(classroom.id);
    try {
      const availability = await confirm.mutateAsync({
        classroomId: classroom.id,
        date: filters.date,
        startTime: filters.startTime,
        endTime: filters.endTime,
      });
      setConfirmed((current) => ({ ...current, [classroom.id]: availability }));
    } finally {
      setConfirmingId(null);
    }
  };

  return (
    <div className="space-y-5 pb-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Classroom finder</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          Search IET and Deeksha Bhawan teaching spaces by time, capacity, type and facilities.
          Timeline occupancy from this portal is <strong>provisional</strong>. Only a
          server-confirmed check from the academic booking service can lock a slot.
        </p>
      </div>

      <ClassroomSearchFiltersForm
        filters={filters}
        buildings={buildingsQuery.data ?? search.data?.buildings ?? []}
        onChange={(next) => {
          setFilters(next);
          setConfirmed({});
        }}
        mobileOpen={mobileFiltersOpen}
        onMobileOpenChange={setMobileFiltersOpen}
      />

      {search.isFetching && !search.data && <ClassroomSearchLoading />}

      {search.isError && (
        <ClassroomSearchError
          message="The classroom service could not complete this search."
          onRetry={() => void search.refetch()}
        />
      )}

      {search.data && results.length === 0 && (
        <ClassroomSearchEmpty
          action={
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setFilters(createDefaultClassroomSearchFilters())}
            >
              Clear filters
            </Button>
          }
        />
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <p>
              <strong className="text-slate-800">{results.length}</strong> rooms in catalog
            </p>
            <p>
              Availability mode:{" "}
              <span className="font-medium text-amber-800">
                {search.data?.availabilityMode === "SERVER_CONFIRMED"
                  ? "server-confirmed"
                  : "provisional frontend"}
              </span>
            </p>
          </div>
          <StaleDataHint
            hasData={Boolean(search.data)}
            isFetching={search.isFetching}
            isStale={search.isStale}
            dataUpdatedAt={search.dataUpdatedAt}
          />
          <ul className="grid gap-4 lg:grid-cols-2">
            {results.map((match) => (
              <li key={match.classroom.id}>
                <ClassroomResultCard
                  match={match}
                  onViewDetails={() => setSelectedId(match.classroom.id)}
                  onSelectSlot={(startTime, endTime) =>
                    setFilters((current) => ({ ...current, startTime, endTime }))
                  }
                  onConfirmAvailability={() => void onConfirm(match.classroom)}
                  confirming={confirmingId === match.classroom.id}
                  requestAction={renderRequestAction?.(match.classroom)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <ClassroomDetailsDrawer
        classroom={selected?.classroom ?? null}
        availability={selected?.availability ?? null}
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
        onSelectSlot={(startTime, endTime) =>
          setFilters((current) => ({ ...current, startTime, endTime }))
        }
        footer={
          selected ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void onConfirm(selected.classroom)}
                disabled={confirmingId === selected.classroom.id}
              >
                Confirm live availability
              </Button>
              {renderRequestAction?.(selected.classroom)}
            </div>
          ) : null
        }
      />
    </div>
  );
}
