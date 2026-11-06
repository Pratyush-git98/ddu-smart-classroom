"use client";

import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import type { UserRole } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CampusBadge } from "@/components/common/campus-badge";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/use-debounce";
import { ROLE_LABEL, selectClassName } from "../lib/admin-labels";
import { ADMIN_PAGE_SIZE } from "../lib/paginate";
import type { AdminManagedUser } from "../types";
import { useAdminCommands, useAdminUsers } from "../hooks/use-admin-dashboard";
import { AdminEmptyState, AdminErrorState, AdminLoadingState } from "./query-state";
import { PaginationBar } from "./pagination-bar";
import { ConfirmDialog } from "./confirm-dialog";

export function AdminUsersPage() {
  const { toast } = useToast();
  const commands = useAdminCommands();
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 250);
  const [role, setRole] = useState<UserRole | "ALL">("ALL");
  const [campusId, setCampusId] = useState<"ALL" | "IET" | "DEEKSHA_BHAWAN">("ALL");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<AdminManagedUser | null>(null);

  const query = useMemo(
    () => ({ search: debounced, role, campusId, status, page, pageSize: ADMIN_PAGE_SIZE }),
    [campusId, debounced, page, role, status]
  );
  const list = useAdminUsers(query);

  if (list.isPending) return <AdminLoadingState label="Loading campus directory..." />;
  if (list.isError) {
    return <AdminErrorState message="The user directory could not be loaded." onRetry={() => void list.refetch()} />;
  }

  const data = list.data;

  return (
    <div className="space-y-4 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Manage users</h2>
        <p className="mt-1 text-sm text-slate-600">
          Directory of students, faculty and administrators across departments and campuses.
        </p>
      </div>

      <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Search name, email or department"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <select
          className={selectClassName}
          value={role}
          onChange={(event) => {
            setRole(event.target.value as typeof role);
            setPage(1);
          }}
        >
          <option value="ALL">All roles</option>
          <option value="STUDENT">Student</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super admin</option>
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
        <select
          className={selectClassName}
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as typeof status);
            setPage(1);
          }}
        >
          <option value="ALL">All accounts</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {!data || data.items.length === 0 ? (
        <AdminEmptyState title="No directory matches" description="Try another role, campus or search term." />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Campus</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-semibold text-slate-900">{user.displayName}</div>
                    <div className="text-[11px] text-slate-500">{user.email}</div>
                  </TableCell>
                  <TableCell className="text-xs">{ROLE_LABEL[user.role]}</TableCell>
                  <TableCell className="max-w-[12rem] whitespace-normal text-xs">{user.departmentName}</TableCell>
                  <TableCell>
                    <CampusBadge campusId={user.campusId} size="sm" />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={user.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-600"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {format(parseISO(user.lastActiveAt), "d MMM, h:mm a")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button type="button" size="sm" variant={user.isActive ? "destructive" : "outline"} onClick={() => setTarget(user)}>
                      {user.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationBar page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        open={Boolean(target)}
        onOpenChange={(open) => !open && setTarget(null)}
        title={target?.isActive ? "Deactivate this account?" : "Activate this account?"}
        description={
          target
            ? `${target.displayName} (${target.email}) will be ${target.isActive ? "prevented from signing in" : "restored"} in this operations directory.`
            : ""
        }
        confirmLabel={target?.isActive ? "Deactivate" : "Activate"}
        pendingLabel="Updating…"
        destructive={Boolean(target?.isActive)}
        pending={commands.setUserActive.isPending}
        onConfirm={async () => {
          if (!target) return;
          const result = await commands.setUserActive.mutateAsync({ id: target.id, isActive: !target.isActive });
          toast({
            title: result.success ? "Directory updated" : "Update failed",
            description: result.message,
            variant: result.success ? "success" : "destructive",
          });
          if (result.success) setTarget(null);
        }}
      />
    </div>
  );
}
