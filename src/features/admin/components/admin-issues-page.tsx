"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CampusBadge } from "@/components/common/campus-badge";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/use-debounce";
import {
  ISSUE_CATEGORY_LABEL,
  ISSUE_SEVERITY_LABEL,
  ISSUE_STATUS_LABEL,
  selectClassName,
} from "../lib/admin-labels";
import { ADMIN_PAGE_SIZE } from "../lib/paginate";
import type { IssueSeverity, IssueStatus } from "../types";
import { useAdminCommands, useAdminIssues } from "../hooks/use-admin-dashboard";
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from "./query-state";
import { PaginationBar } from "./pagination-bar";

const SEVERITY_CLASS: Record<IssueSeverity, string> = {
  LOW: "border-slate-200 bg-slate-50 text-slate-700",
  MEDIUM: "border-amber-200 bg-amber-50 text-amber-800",
  HIGH: "border-orange-200 bg-orange-50 text-orange-800",
  CRITICAL: "border-rose-200 bg-rose-50 text-rose-800",
};

export function AdminIssuesPage() {
  const { toast } = useToast();
  const commands = useAdminCommands();
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 250);
  const [status, setStatus] = useState<IssueStatus | "ALL">("ALL");
  const [severity, setSeverity] = useState<IssueSeverity | "ALL">("ALL");
  const [campusId, setCampusId] = useState<"ALL" | "IET" | "DEEKSHA_BHAWAN">("ALL");
  const [page, setPage] = useState(1);

  const query = useMemo(
    () => ({ search: debounced, status, severity, campusId, page, pageSize: ADMIN_PAGE_SIZE }),
    [campusId, debounced, page, severity, status]
  );
  const list = useAdminIssues(query);

  if (list.isPending) return <AdminLoadingState label="Loading facility issues..." />;
  if (list.isError) {
    return <AdminErrorState message="Classroom issues could not be loaded." onRetry={() => void list.refetch()} />;
  }

  const data = list.data;

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Classroom issues</h2>
        <p className="mt-1 text-sm text-slate-600">
          Track equipment, HVAC, network and safety tickets with status updates that write to the audit trail.
        </p>
      </div>

      <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Search title or room"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <select className={selectClassName} value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(1); }}>
          <option value="ALL">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select className={selectClassName} value={severity} onChange={(event) => { setSeverity(event.target.value as typeof severity); setPage(1); }}>
          <option value="ALL">All severities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
        <select className={selectClassName} value={campusId} onChange={(event) => { setCampusId(event.target.value as typeof campusId); setPage(1); }}>
          <option value="ALL">All campuses</option>
          <option value="IET">IET</option>
          <option value="DEEKSHA_BHAWAN">Deeksha Bhawan</option>
        </select>
      </div>

      {!data || data.items.length === 0 ? (
        <AdminEmptyState title="No issues match" description="Clear filters to see the full facilities queue." />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    <div className="max-w-[18rem] whitespace-normal text-[11px] text-slate-500">{item.description}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-semibold">{item.roomNumber}</div>
                    <CampusBadge campusId={item.campusId} size="sm" />
                  </TableCell>
                  <TableCell className="text-xs">{ISSUE_CATEGORY_LABEL[item.category]}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={SEVERITY_CLASS[item.severity]}>
                      {ISSUE_SEVERITY_LABEL[item.severity]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {item.reportedBy}
                    <div>{format(parseISO(item.reportedAt), "d MMM, h:mm a")}</div>
                  </TableCell>
                  <TableCell>
                    <select
                      className={selectClassName}
                      value={item.status}
                      disabled={commands.updateIssueStatus.isPending}
                      onChange={async (event) => {
                        const next = event.target.value as IssueStatus;
                        const result = await commands.updateIssueStatus.mutateAsync({ id: item.id, status: next });
                        toast({
                          title: result.success ? "Issue updated" : "Update failed",
                          description: result.message,
                          variant: result.success ? "success" : "destructive",
                        });
                      }}
                    >
                      {(Object.keys(ISSUE_STATUS_LABEL) as IssueStatus[]).map((value) => (
                        <option key={value} value={value}>
                          {ISSUE_STATUS_LABEL[value]}
                        </option>
                      ))}
                    </select>
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
