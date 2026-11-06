"use client";

import { useAuth } from "@/hooks/use-auth";
import { isStudentUser } from "@/types";
import { useStudentAcademicContext } from "../hooks/use-student-dashboard";
import { DashboardErrorState, DashboardLoadingState } from "./query-state";

export function StudentProfilePage() {
  const { user } = useAuth();
  const academicQuery = useStudentAcademicContext();
  const profile = user && isStudentUser(user) ? user.profile : null;
  const academic = academicQuery.data;

  if (academicQuery.isPending && !profile) {
    return <DashboardLoadingState label="Loading student profile..." />;
  }

  if (academicQuery.isError && !profile) {
    return (
      <DashboardErrorState
        message="Student profile could not be loaded."
        onRetry={() => void academicQuery.refetch()}
      />
    );
  }

  const rows = [
    { label: "Name", value: user?.displayName ?? academic?.displayName },
    { label: "Institutional email", value: user?.email },
    { label: "Roll number", value: profile?.rollNumber ?? academic?.rollNumber },
    { label: "Enrollment number", value: profile?.enrollmentNumber ?? academic?.enrollmentNumber },
    { label: "Programme", value: profile?.program ?? academic?.program },
    { label: "Branch", value: profile?.branch ?? academic?.branchCode },
    { label: "Academic year", value: profile?.academicYear ?? academic?.academicYear },
    { label: "Semester", value: profile ? `Semester ${profile.semester}` : academic ? `Semester ${academic.semester}` : "—" },
    { label: "Batch", value: profile?.batch ?? academic?.batch },
    { label: "Section", value: profile?.section ?? academic?.section },
    { label: "Home campus", value: user?.primaryCampus === "IET" ? "IET Gorakhpur" : user?.primaryCampus },
  ];

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Profile</h2>
        <p className="mt-1 text-sm text-slate-600">
          Academic identity used to personalise the IET classroom locator. Updates must come from the
          university student information system.
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
