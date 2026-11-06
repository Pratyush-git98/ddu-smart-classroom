"use client";

import { PageHeader } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { AuditFeedPreview, CampusAnalyticsPreview } from "@/features/admin";
import { TimetableGridPreview } from "@/features/timetable";
import { MOCK_TIMETABLE_SLOTS } from "@/services/timetable-service";
import { useAuth } from "@/hooks/use-auth";
import { isAdminUser } from "@/types";
import { Shield } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const profile = user && isAdminUser(user) ? user.profile : null;

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        heading={`Academic administration — ${user?.displayName ?? "Administrator"}`}
        subheading="Campus utilization, clash-matrix overrides, and audit telemetry for IET and Deeksha Bhawan."
        badge={
          <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200">
            <Shield className="size-3.5" />
            Admin Workspace
          </Badge>
        }
      />

      {profile && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ProfileStat label="Employee ID" value={profile.employeeId} />
          <ProfileStat label="Office" value={profile.office} />
          <ProfileStat label="Designation" value={profile.designation} />
          <ProfileStat label="Clearance" value={profile.clearanceLevel} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CampusAnalyticsPreview />
        <AuditFeedPreview />
      </div>
      <TimetableGridPreview slots={MOCK_TIMETABLE_SLOTS} />
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
