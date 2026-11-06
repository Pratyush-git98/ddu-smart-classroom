"use client";

import { useAuth } from "@/hooks/use-auth";
import { isFacultyUser } from "@/types";
import { useFacultyProfile } from "../hooks/use-faculty-dashboard";
import { FacultyErrorState, FacultyLoadingState } from "./query-state";

export function FacultyProfilePage() {
  const { user } = useAuth();
  const profileQuery = useFacultyProfile();
  const authProfile = user && isFacultyUser(user) ? user.profile : null;
  const data = profileQuery.data;

  if (profileQuery.isPending && !authProfile) {
    return <FacultyLoadingState label="Loading faculty profile..." />;
  }
  if (profileQuery.isError && !authProfile) {
    return (
      <FacultyErrorState
        message="Faculty profile could not be loaded."
        onRetry={() => void profileQuery.refetch()}
      />
    );
  }

  const rows = [
    { label: "Name", value: user?.displayName ?? data?.displayName },
    { label: "Institutional email", value: user?.email ?? data?.email },
    { label: "Employee ID", value: authProfile?.employeeId ?? data?.employeeId },
    { label: "Designation", value: authProfile?.designation ?? data?.designation },
    { label: "Department", value: user?.departmentName ?? data?.departmentName },
    { label: "Head of Department", value: (authProfile?.isHod ?? data?.isHod) ? "Yes" : "No" },
    {
      label: "Assigned courses",
      value: (authProfile?.coursesAssigned ?? data?.coursesAssigned ?? []).join(", ") || "None listed",
    },
    { label: "Home campus", value: user?.primaryCampus === "IET" ? "IET Gorakhpur" : user?.primaryCampus },
  ];

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Profile</h2>
        <p className="mt-1 text-sm text-slate-600">
          Faculty identity used for classroom requisitions. Official updates must come from the university
          HR / academic information system.
        </p>
      </div>
      <dl className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 gap-1 border-b border-slate-100 px-4 py-3 last:border-b-0 sm:grid-cols-3"
          >
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{row.label}</dt>
            <dd className="text-sm font-medium text-slate-900 sm:col-span-2">{row.value ?? "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
