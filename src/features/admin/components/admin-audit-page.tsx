"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";
import { selectClassName } from "../lib/admin-labels";
import { ADMIN_PAGE_SIZE } from "../lib/paginate";
import type { AuditEntityType } from "../types";
import { useAdminAuditLogs } from "../hooks/use-admin-dashboard";
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from "./query-state";
import { PaginationBar } from "./pagination-bar";

export function AdminAuditPage() {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 250);
  const [entityType, setEntityType] = useState<AuditEntityType | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const query = useMemo(
    () => ({ search: debounced, entityType, page, pageSize: ADMIN_PAGE_SIZE }),
    [debounced, entityType, page]
  );
  const list = useAdminAuditLogs(query);

  if (list.isPending) return <AdminLoadingState label="Loading audit trail..." />;
  if (list.isError) {
    return <AdminErrorState message="Audit logs could not be loaded." onRetry={() => void list.refetch()} />;
  }

  const data = list.data;

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Audit logs</h2>
        <p className="mt-1 text-sm text-slate-600">
          Immutable operations history: user, action, entity, timestamp and change summary.
        </p>
      </div>

      <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-2">
        <Input
          placeholder="Search actor, action or summary"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <select
          className={selectClassName}
          value={entityType}
          onChange={(event) => {
            setEntityType(event.target.value as typeof entityType);
            setPage(1);
          }}
        >
          <option value="ALL">All entities</option>
          <option value="CLASSROOM">Classroom</option>
          <option value="USER">User</option>
          <option value="BOOKING">Booking</option>
          <option value="TIMETABLE">Timetable</option>
          <option value="ISSUE">Issue</option>
          <option value="NOTIFICATION">Notification</option>
        </select>
      </div>

      {!data || data.items.length === 0 ? (
        <AdminEmptyState title="No audit entries" description="Actions from this console will appear here after they are recorded." />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Change summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-semibold text-slate-900">{item.actorName}</div>
                    <div className="text-[11px] text-slate-500">{item.actorRole}</div>
                  </TableCell>
                  <TableCell className="text-xs">{item.action}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-200 text-slate-700">
                      {item.entityType}
                    </Badge>
                    <div className="mt-1 text-[10px] text-slate-400">{item.entityId}</div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {format(parseISO(item.timestamp), "d MMM yyyy, h:mm a")}
                  </TableCell>
                  <TableCell className="max-w-[20rem] whitespace-normal text-xs text-slate-600">
                    {item.changeSummary}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationBar page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
