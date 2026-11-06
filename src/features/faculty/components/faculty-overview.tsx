"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock, ClipboardList, Hourglass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { isFacultyUser } from "@/types";
import { useFacultyOverview } from "../hooks/use-faculty-dashboard";
import { MOCK_FACULTY_DISCLAIMER } from "../services/mock/mock-faculty-dashboard";
import type { FacultyBooking } from "../types";
import { LectureCard } from "./lecture-card";
import { BookingCard } from "./booking-card";
import { BookingDetailDialog, BookingFormDialog, CancelBookingDialog } from "./booking-dialogs";
import { FacultyEmptyState, FacultyErrorState, FacultyLoadingState } from "./query-state";

export function FacultyOverview() {
  const { user } = useAuth();
  const overview = useFacultyOverview();
  const [viewBooking, setViewBooking] = useState<FacultyBooking | null>(null);
  const [editBooking, setEditBooking] = useState<FacultyBooking | null>(null);
  const [cancelBooking, setCancelBooking] = useState<FacultyBooking | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  if (overview.isPending) return <FacultyLoadingState label="Loading today's teaching load..." />;
  if (overview.isError || !overview.data) {
    return (
      <FacultyErrorState
        message="The faculty timetable and booking service could not be reached."
        onRetry={() => void overview.refetch()}
      />
    );
  }

  const profile = user && isFacultyUser(user) ? user.profile : null;
  const data = overview.data;
  const pending = data.bookings.filter((item) => item.status === "PENDING");

  return (
    <div className="space-y-6 pb-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">IET faculty overview</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">
          Welcome, {user?.displayName ?? data.profile.displayName}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {(profile?.designation ?? data.profile.designation)} · {data.profile.departmentName}
        </p>
        <p className="mt-3 text-[11px] text-slate-400">{MOCK_FACULTY_DISCLAIMER}</p>
      </section>

      <Link
        href="/faculty/classrooms"
        className="flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-700 to-slate-900 p-5 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-100">
            Room locator
          </p>
          <h3 className="mt-1 text-xl font-bold">Find an available classroom</h3>
          <p className="mt-1 text-sm text-indigo-100">
            Search IET and Deeksha Bhawan catalog spaces, then queue a requisition for backend clash checks.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 self-start rounded-lg bg-white px-3 py-2 text-sm font-semibold text-indigo-800">
          <Search className="size-4" />
          Open locator
        </span>
      </Link>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Today's classes" value={String(data.todayLectures.length)} icon={CalendarClock} />
        <Stat label="Total bookings" value={String(data.totalBookings)} icon={ClipboardList} />
        <Stat label="Pending requests" value={String(data.pendingBookingCount)} icon={Hourglass} />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Today&apos;s teaching schedule</h3>
          <Link href="/faculty/schedule" className="text-xs font-semibold text-indigo-700 hover:underline">
            Weekly view
          </Link>
        </div>
        {data.todayLectures.length === 0 ? (
          <FacultyEmptyState
            title="No lectures listed today"
            description="The sample IET teaching grid has no remaining periods for this faculty persona today."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {data.todayLectures.map((lecture) => (
              <LectureCard key={lecture.id} lecture={lecture} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Upcoming lectures</h3>
        {data.upcomingLectures.length === 0 ? (
          <FacultyEmptyState
            title="No upcoming lectures"
            description="Nothing else is listed on this sample week after the current period."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {data.upcomingLectures.map((lecture) => (
              <LectureCard key={lecture.id} lecture={lecture} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900">Pending booking requests</h3>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
              New requisition
            </Button>
            <Link href="/faculty/bookings" className="text-xs font-semibold text-indigo-700 hover:underline self-center">
              All bookings
            </Link>
          </div>
        </div>
        {pending.length === 0 ? (
          <FacultyEmptyState
            title="No pending requisitions"
            description="New extra-lecture and seminar requests will appear here until the Dean Academics service responds."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {pending.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onView={setViewBooking}
                onEdit={setEditBooking}
                onCancel={setCancelBooking}
              />
            ))}
          </div>
        )}
      </section>

      <BookingDetailDialog
        booking={viewBooking}
        open={Boolean(viewBooking)}
        onOpenChange={(open) => !open && setViewBooking(null)}
      />
      <BookingFormDialog
        open={createOpen || Boolean(editBooking)}
        booking={editBooking}
        onOpenChange={(open) => {
          if (!open) {
            setCreateOpen(false);
            setEditBooking(null);
          }
        }}
      />
      <CancelBookingDialog
        booking={cancelBooking}
        open={Boolean(cancelBooking)}
        onOpenChange={(open) => !open && setCancelBooking(null)}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof CalendarClock;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="size-4 text-indigo-600" />
        <p className="text-[11px] font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
