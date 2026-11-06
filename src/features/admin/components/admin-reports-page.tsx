"use client";

import { format, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CampusBadge } from "@/components/common/campus-badge";
import { MOCK_ADMIN_DISCLAIMER } from "../services/mock/mock-admin-data";
import { useAdminReports } from "../hooks/use-admin-dashboard";
import { BookingTrendsChart, UtilizationChart } from "./admin-charts";
import { AdminErrorState, AdminLoadingState } from "./query-state";

export function AdminReportsPage() {
  const reports = useAdminReports();

  if (reports.isPending) return <AdminLoadingState label="Compiling campus reports..." />;
  if (reports.isError || !reports.data) {
    return <AdminErrorState message="Operational reports could not be generated." onRetry={() => void reports.refetch()} />;
  }

  const data = reports.data;

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Reports</h2>
        <p className="mt-1 text-sm text-slate-600">
          Utilization, demand and conflict snapshots for IET and Deeksha Bhawan. Generated{" "}
          {format(parseISO(data.generatedAt), "d MMM yyyy, h:mm a")}.
        </p>
        <p className="mt-2 text-[11px] text-slate-400">{MOCK_ADMIN_DISCLAIMER}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ReportStat label="Catalog rooms" value={data.stats.totalClassrooms} />
        <ReportStat label="Pending approvals" value={data.stats.pendingApprovals} />
        <ReportStat label="Timetable conflicts" value={data.conflictCount} />
        <ReportStat label="Open issues" value={data.unresolvedIssues} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <UtilizationChart points={data.campusUtilization} />
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">Peak occupancy windows</h3>
          <ul className="mt-4 space-y-3">
            {data.peakHours.map((row) => (
              <li key={row.window}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{row.window}</span>
                  <span className="text-slate-500">{row.occupancyPercent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-violet-600" style={{ width: `${row.occupancyPercent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <h3 className="mb-3 px-1 text-sm font-bold text-slate-900">Department booking demand</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Total bookings</TableHead>
              <TableHead>Pending</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.departmentDemand.map((row) => (
              <TableRow key={row.department}>
                <TableCell className="font-medium">{row.department}</TableCell>
                <TableCell>{row.bookings}</TableCell>
                <TableCell>{row.pending}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <h3 className="mb-3 px-1 text-sm font-bold text-slate-900">Building utilization</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Building</TableHead>
              <TableHead>Campus</TableHead>
              <TableHead>Occupied</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.campusUtilization.map((row) => (
              <TableRow key={`${row.campusId}-${row.label}`}>
                <TableCell className="max-w-[16rem] whitespace-normal text-xs">{row.label}</TableCell>
                <TableCell>
                  <CampusBadge campusId={row.campusId} size="sm" />
                </TableCell>
                <TableCell>{row.occupied}</TableCell>
                <TableCell>{row.available}</TableCell>
                <TableCell>{row.utilizationPercent}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <BookingTrendsChart points={data.bookingTrends} />
    </div>
  );
}

function ReportStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
