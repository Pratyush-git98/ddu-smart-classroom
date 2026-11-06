"use client";

import { PageHeader } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { FacultyQuickActions, FacultyRequisitionCard } from "@/features/faculty";
import { BookingListPreview } from "@/features/bookings";
import { MOCK_BOOKINGS } from "@/services/booking-service";
import { useAuth } from "@/hooks/use-auth";
import { isFacultyUser } from "@/types";
import { BookOpenCheck } from "lucide-react";

export default function FacultyDashboardPage() {
  const { user } = useAuth();
  const profile = user && isFacultyUser(user) ? user.profile : null;

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        heading={`Faculty hub — ${user?.displayName ?? "Faculty"}`}
        subheading="Raise room requisitions, review pending allocations, and operate IoT classroom presets."
        badge={
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            <BookOpenCheck className="size-3.5" />
            Faculty Workspace
          </Badge>
        }
      />

      {profile && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ProfileStat label="Employee ID" value={profile.employeeId} />
          <ProfileStat label="Designation" value={profile.designation} />
          <ProfileStat label="HOD" value={profile.isHod ? "Yes" : "No"} />
          <ProfileStat
            label="Assigned courses"
            value={profile.coursesAssigned.length ? profile.coursesAssigned.join(", ") : "None"}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FacultyRequisitionCard />
        <FacultyQuickActions />
      </div>
      <BookingListPreview bookings={MOCK_BOOKINGS} />
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
