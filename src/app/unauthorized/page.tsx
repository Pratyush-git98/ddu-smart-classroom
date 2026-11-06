import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { AuthLayout } from "@/features/authentication";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  LogIn,
  Building2,
  Mail,
  HelpCircle,
  FileWarning,
} from "lucide-react";

export const metadata: Metadata = {
  title: "403 Clearance Required | DDUGU Smart Classroom Portal",
  description:
    "Institutional access clearance required for protected university facilities and administrative controls.",
};

export default function UnauthorizedPage() {
  return (
    <AuthLayout
      subtitle="Institutional privilege level and access governance"
      badgeText="Access Governance"
    >
      <div className="space-y-6 text-center sm:text-left">
        {/* Error Code & Icon */}
        <div className="flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 shadow-xs ring-1 ring-rose-200 shrink-0">
            <ShieldAlert className="size-8 text-rose-600" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-rose-600 tracking-wider">
                HTTP 403 FORBIDDEN
              </span>
              <Badge variant="outline" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200">
                Clearance Required
              </Badge>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Institutional Privilege Required
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The smart campus module you attempted to access requires higher administrative or faculty
          clearance. Your current profile does not possess the requisite security elevation.
        </p>

        {/* Access Matrix Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3 text-left">
          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Lock className="size-3.5 text-slate-500" />
            <span>Protected Academic Operations:</span>
          </h4>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-mono font-bold text-blue-700 text-[11px] shrink-0">
                [ADMIN/DEAN]
              </span>
              <span className="text-[11px]">
                Master Timetable clash resolution, semester room allocations, and campus-wide override authorizations.
              </span>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-mono font-bold text-indigo-700 text-[11px] shrink-0">
                [FACULTY/HOD]
              </span>
              <span className="text-[11px]">
                Ad-hoc smart room booking requisitions, IoT equipment preset overrides, and lecture capture triggers.
              </span>
            </div>
          </div>
        </div>

        {/* Resolution Options */}
        <div className="rounded-xl border border-blue-200/80 bg-blue-50/50 p-4 text-xs text-slate-700 space-y-2 text-left">
          <div className="flex items-center gap-1.5 font-bold text-blue-950">
            <HelpCircle className="size-3.5 text-blue-600" />
            <span>Need Elevation or Assigned Permissions?</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            If you are a Department Head, Dean, or designated faculty member requiring administrative access:
          </p>
          <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
            <li>Submit an elevation requisition through the Registrar Academic Portal.</li>
            <li>Contact the Central Computer Center (CCC) at <code>ccc@ddugu.ac.in</code>.</li>
            <li>Sign in using your issued administrative credentials.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <Link href="/login" className="flex-1">
            <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs h-9 gap-1.5 shadow-xs">
              <LogIn className="size-3.5" />
              <span>Sign In with Different ID</span>
            </Button>
          </Link>

          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full text-xs h-9 gap-1.5 border-slate-300">
              <ArrowLeft className="size-3.5" />
              <span>Return to Campus Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

