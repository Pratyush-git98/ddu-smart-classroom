"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Classroom, RoomStatus, RoomType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CampusBadge } from "@/components/common/campus-badge";
import { RoomStatusBadge } from "@/components/common/status-badge";
import { useToast } from "@/components/ui/toast";
import { facilityLabel, formatFloorLabel, roomTypeLabel } from "@/features/classrooms/lib/classroom-labels";
import { ROOM_TYPE_OPTIONS } from "@/features/classrooms/types";
import { useDebounce } from "@/hooks/use-debounce";
import { selectClassName } from "../lib/admin-labels";
import { ADMIN_PAGE_SIZE } from "../lib/paginate";
import { useAdminBuildings, useAdminClassrooms, useAdminCommands } from "../hooks/use-admin-dashboard";
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from "./query-state";
import { PaginationBar } from "./pagination-bar";
import { ConfirmDialog } from "./confirm-dialog";
import { ClassroomFormDialog } from "./classroom-form-dialog";

export function AdminClassroomsPage() {
  const { toast } = useToast();
  const commands = useAdminCommands();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const debounced = useDebounce(search, 250);
  const [campusId, setCampusId] = useState<"ALL" | "IET" | "DEEKSHA_BHAWAN">("ALL");
  const [status, setStatus] = useState<RoomStatus | "ALL">("ALL");
  const [roomType, setRoomType] = useState<RoomType | "ALL">("ALL");
  const [building, setBuilding] = useState<string | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Classroom | null>(null);
  const [deleting, setDeleting] = useState<Classroom | null>(null);

  const query = useMemo(
    () => ({
      search: debounced,
      campusId,
      status,
      roomType,
      building,
      page,
      pageSize: ADMIN_PAGE_SIZE,
    }),
    [building, campusId, debounced, page, roomType, status]
  );

  const list = useAdminClassrooms(query);
  const buildings = useAdminBuildings();

  const resetPage = () => setPage(1);

  if (list.isPending) return <AdminLoadingState label="Loading classroom catalog..." />;
  if (list.isError) {
    return (
      <AdminErrorState
        message="The classroom catalog could not be loaded."
        onRetry={() => void list.refetch()}
      />
    );
  }

  const data = list.data;

  return (
    <div className="space-y-4 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Manage classrooms</h2>
          <p className="mt-1 text-sm text-slate-600">
            Search, filter and maintain rooms across IET and Deeksha Bhawan buildings.
          </p>
        </div>
        <Button
          type="button"
          className="bg-violet-700 text-white hover:bg-violet-800"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Add classroom
        </Button>
      </div>

      <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          placeholder="Search room, name or building"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            resetPage();
          }}
        />
        <select
          className={selectClassName}
          value={campusId}
          onChange={(event) => {
            setCampusId(event.target.value as typeof campusId);
            resetPage();
          }}
        >
          <option value="ALL">All campuses</option>
          <option value="IET">IET</option>
          <option value="DEEKSHA_BHAWAN">Deeksha Bhawan</option>
        </select>
        <select
          className={selectClassName}
          value={building}
          onChange={(event) => {
            setBuilding(event.target.value);
            resetPage();
          }}
        >
          <option value="ALL">All buildings</option>
          {(buildings.data ?? []).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className={selectClassName}
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as typeof status);
            resetPage();
          }}
        >
          <option value="ALL">All statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="OCCUPIED">Occupied</option>
          <option value="RESERVED">Reserved</option>
          <option value="MAINTENANCE">Maintenance</option>
        </select>
        <select
          className={selectClassName}
          value={roomType}
          onChange={(event) => {
            setRoomType(event.target.value as typeof roomType);
            resetPage();
          }}
        >
          {ROOM_TYPE_OPTIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {!data || data.items.length === 0 ? (
        <AdminEmptyState
          title="No classrooms match these filters"
          description="Adjust campus, building or status, or add a room to the catalog."
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Facilities</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <div className="font-semibold text-slate-900">{room.roomNumber}</div>
                    <div className="text-[11px] text-slate-500">{room.name}</div>
                    <CampusBadge campusId={room.campusId} size="sm" className="mt-1" />
                  </TableCell>
                  <TableCell className="max-w-[12rem] whitespace-normal text-xs">{room.block}</TableCell>
                  <TableCell>{formatFloorLabel(room.floor)}</TableCell>
                  <TableCell className="text-xs">{roomTypeLabel(room.type)}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell className="max-w-[14rem] whitespace-normal text-[11px] text-slate-600">
                    {room.facilities.map(facilityLabel).join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    <RoomStatusBadge status={room.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(room);
                          setFormOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button type="button" size="sm" variant="destructive" onClick={() => setDeleting(room)}>
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationBar page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />
        </div>
      )}

      <ClassroomFormDialog
        open={formOpen}
        classroom={editing}
        pending={commands.createClassroom.isPending || commands.updateClassroom.isPending}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        onSubmit={async (draft) => {
          const result = editing
            ? await commands.updateClassroom.mutateAsync({ id: editing.id, draft })
            : await commands.createClassroom.mutateAsync(draft);
          toast({
            title: result.success ? "Catalog updated" : "Save failed",
            description: result.message,
            variant: result.success ? "success" : "destructive",
          });
          if (result.success) {
            setFormOpen(false);
            setEditing(null);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Remove this classroom?"
        description={
          deleting
            ? `${deleting.roomNumber} will be removed from the operations catalog. Live allocations still require the academic service.`
            : ""
        }
        confirmLabel="Remove classroom"
        pendingLabel="Removing…"
        destructive
        pending={commands.deleteClassroom.isPending}
        onConfirm={async () => {
          if (!deleting) return;
          const result = await commands.deleteClassroom.mutateAsync(deleting.id);
          toast({
            title: result.success ? "Classroom removed" : "Remove failed",
            description: result.message,
            variant: result.success ? "warning" : "destructive",
          });
          if (result.success) setDeleting(null);
        }}
      />
    </div>
  );
}
