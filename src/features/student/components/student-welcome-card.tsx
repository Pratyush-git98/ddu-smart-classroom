"use client";

import { useAuth } from "@/hooks/use-auth";
import { isStudentUser } from "@/types";
import type { StudentAcademicContext } from "../types";
import { MOCK_DATA_DISCLAIMER } from "../services/mock/mock-student-dashboard";

export function StudentWelcomeCard({ academic }: { academic: StudentAcademicContext }) {
  const { user } = useAuth();
  const profile = user && isStudentUser(user) ? user.profile : null;
  const name = user?.displayName ?? academic.displayName;
  const branch = profile?.branch ?? academic.branchCode;
  const year = profile?.academicYear ?? academic.academicYear;
  const semester = profile?.semester ?? academic.semester;
  const batch = profile?.batch ?? academic.batch;
  const section = profile?.section ?? academic.section;

  const facts = [
    { label: "Branch", value: branch === "CSE" ? "CSE · Computer Science & Engineering" : branch },
    { label: "Academic year", value: year },
    { label: "Semester", value: `Semester ${semester}` },
    { label: "Batch", value: batch },
    { label: "Section", value: section },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">IET student overview</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Welcome, {name}</h2>
      <p className="mt-1 text-sm text-slate-600">
        {academic.program} · DDUGU Institute of Engineering & Technology, Gorakhpur
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {facts.map((fact) => (
          <div key={fact.label} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{fact.label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-slate-900">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[11px] text-slate-400">{MOCK_DATA_DISCLAIMER}</p>
    </section>
  );
}
