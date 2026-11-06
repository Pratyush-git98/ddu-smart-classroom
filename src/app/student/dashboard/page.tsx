"use client";

import { PageHeader } from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { StudentSchedulePreview } from "@/features/student";
import { NotificationListPreview } from "@/features/notifications";
import { MOCK_NOTIFICATIONS } from "@/services/notification-service";
import { useAuth } from "@/hooks/use-auth";
import { isStudentUser } from "@/types";
import { GraduationCap } from "lucide-react";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const profile = user && isStudentUser(user) ? user.profile : null;

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        heading={`Welcome, ${user?.displayName ?? "Student"}`}
        subheading="Today's lectures, room directions, and attendance checkpoints for IET & Deeksha Bhawan."
        badge={
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <GraduationCap className="size-3.5" />
            Student Workspace
          </Badge>
        }
      />

      {profile && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ProfileStat label="Roll Number" value={profile.rollNumber} />
          <ProfileStat label="Programme" value={profile.program} />
          <ProfileStat label="Semester" value={`Sem ${profile.semester} • Sec ${profile.section}`} />
          <ProfileStat label="Batch" value={profile.batch} />
        </div>
      )}

      <StudentSchedulePreview />
      <NotificationListPreview notifications={MOCK_NOTIFICATIONS} />
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
