"use client";

import { useMemo, useState } from "react";
import type { BookingStatus } from "@/types";
import type { FacultyBooking } from "@/features/faculty/types";
import { purposeLabel } from "@/features/bookings/lib/booking-labels";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CampusBadge } from "@/components/common/campus-badge";
import { BookingStatusBadge } from "@/components/common/status-badge";
import { useToast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/use-debounce";
import { selectClassName } from "../lib/admin-labels";
import { ADMIN_PAGE_SIZE } from "../lib/paginate";
import { useAdminApprovals, useAdminCommands } from "../hooks/use-admin-dashboard";
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from "./query-state";
import { PaginationBar } from "./pagination-bar";
import { ConfirmDialog } from "./confirm-dialog";

export function AdminApprovalsPage() {
  const { toast } = useToast();
  const commands = useAdminCommands();
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 250);
  const [status, setStatus] = useState<BookingStatus | "ALL">("PENDING");
  const [campusId, setCampusId] = useState<"ALL" | "IET" | "DEEKSHA_BHAWAN">("ALL");
  const [page, setPage] = useState(1);
  const [approveTarget, setApproveTarget] = useState<FacultyBooking | null>(null);
  const [rejectTarget, setRejectTarget] = useState<FacultyBooking | null>(null);
  const [reason, setReason] = useState("");

  const query = useMemo(
    () => ({ search: debounced, status, campusId, page, pageSize: ADMIN_PAGE_SIZE }),
    [campusId, debounced, page, status]
  );
  const list = useAdminApprovals(query);

  if (list.isPending) return <AdminLoadingState label="Loading booking queue..." />;
  if (list.isError) {
    return <AdminErrorState message="Booking approvals could not be loaded." onRetry={() => void list.refetch()} />;
  }

  const data = list.data;

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Booking approvals</h2>
        <p className="mt-1 text-sm text-slate-600">
          Approve or reject faculty requisitions. Schedule conflicts are re-checked before an approval is committed.
        </p>
      </div>

      <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-3">
        <Input
          placeholder="Search title, faculty or room"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <select
          className={selectClassName}
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as typeof status);
            setPage(1);
          }}
        >
          <option value="ALL">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CONFLICT_DETECTED">Conflict detected</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select
          className={selectClassName}
          value={campusId}
          onChange={(event) => {
            setCampusId(event.target.value as typeof campusId);
            setPage(1);
          }}
        >
          <option value="ALL">All campuses</option>
          <option value="IET">IET</option>
          <option value="DEEKSHA_BHAWAN">Deeksha Bhawan</option>
        </select>
      </div>

      {!data || data.items.length === 0 ? (
        <AdminEmptyState title="No requisitions in this view" description="Change status or campus to inspect the rest of the queue." />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Slot</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item) => {
                const actionable = item.status === "PENDING" || item.status === "CONFLICT_DETECTED";
                return (
                  <TableRow key={item.id} className={item.status === "CONFLICT_DETECTED" || item.conflictMessage ? "bg-orange-50/50" : undefined}>
                    <TableCell>
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500">{purposeLabel(item.purpose)} · {item.attendeesCount} attendees</div>
                      {item.conflictMessage && (
                        <p className="mt-1 max-w-[16rem] whitespace-normal text-[11px] font-medium text-orange-800">
                          {item.conflictMessage}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{item.facultyName}</TableCell>
                    <TableCell className="text-xs">
                      {item.date}
                      <div className="text-slate-500">
                        {item.startTime}–{item.endTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold">{item.venue.roomCode}</div>
                      <CampusBadge campusId={item.venue.campusId} size="sm" />
                    </TableCell>
                    <TableCell>
                      <BookingStatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {actionable ? (
                        <div className="flex justify-end gap-1">
                          <Button type="button" size="sm" className="bg-violet-700 text-white hover:bg-violet-800" onClick={() => setApproveTarget(item)}>
                            Approve
                          </Button>
                          <Button type="button" size="sm" variant="destructive" onClick={() => { setRejectTarget(item); setReason(""); }}>
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">No action</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <PaginationBar page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(approveTarget)}
        onOpenChange={(open) => !open && setApproveTarget(null)}
        title="Approve this booking?"
        description={
          approveTarget
            ? `${approveTarget.title} for ${approveTarget.venue.roomCode} on ${approveTarget.date} will be sent to the academic booking service.`
            : ""
        }
        confirmLabel="Approve"
        pendingLabel="Approving…"
        pending={commands.approveBooking.isPending}
        onConfirm={async () => {
          if (!approveTarget) return;
          const result = await commands.approveBooking.mutateAsync(approveTarget.id);
          toast({
            title: result.success ? "Booking approved" : "Approval blocked",
            description: result.message,
            variant: result.success ? "success" : "warning",
          });
          setApproveTarget(null);
        }}
      />

      <ConfirmDialog
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        title="Reject this booking?"
        description="Faculty will see the reason on the requisition. This cannot be undone from the console."
        confirmLabel="Reject booking"
        pendingLabel="Rejecting…"
        destructive
        pending={commands.rejectBooking.isPending}
        onConfirm={async () => {
          if (!rejectTarget) return;
          const result = await commands.rejectBooking.mutateAsync({ id: rejectTarget.id, reason });
          toast({
            title: result.success ? "Booking rejected" : "Rejection failed",
            description: result.message,
            variant: result.success ? "warning" : "destructive",
          });
          if (result.success) {
            setRejectTarget(null);
            setReason("");
          }
        }}
      >
        <label className="block space-y-1">
          <span className="text-xs font-semibold text-slate-700">Reason</span>
          <textarea
            className="min-h-24 w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Explain why this allocation cannot be approved."
          />
        </label>
      </ConfirmDialog>
    </div>
  );
}
