import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout";
import { StatCard, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClassroomGrid } from "@/features/classrooms";
import { BookingListPreview } from "@/features/bookings";
import { TimetableGridPreview } from "@/features/timetable";
import { StudentSchedulePreview } from "@/features/student";
import { FacultyRequisitionCard, FacultyQuickActions } from "@/features/faculty";
import { CampusAnalyticsPreview, AuditFeedPreview } from "@/features/admin";
import { NotificationListPreview } from "@/features/notifications";
import { AuthCard } from "@/features/authentication";
import { MOCK_CLASSROOMS } from "@/services/classroom-service";
import { MOCK_BOOKINGS } from "@/services/booking-service";
import { MOCK_TIMETABLE_SLOTS } from "@/services/timetable-service";
import { MOCK_NOTIFICATIONS } from "@/services/notification-service";
import { DDUGU_BRAND, CAMPUS_FACILITIES } from "@/lib/design-tokens";
import {
  Building2,
  Landmark,
  CalendarCheck,
  Radio,
  Layers,
  CheckCircle2,
  ArrowRight,
  LogIn,
} from "lucide-react";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-8 pb-12">
        {/* Top University Hero Banner */}
        <section className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-6 sm:p-8 shadow-xs">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 font-semibold text-xs py-0.5 px-2.5"
                >
                  {DDUGU_BRAND.accreditation}
                </Badge>
                <span className="text-xs text-slate-500 font-medium">
                  {DDUGU_BRAND.name} • Estd. {DDUGU_BRAND.established}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                Smart Classroom & Facility Infrastructure
              </h1>

              <p className="text-sm text-slate-600 sm:text-base leading-relaxed">
                Centralized academic operations, real-time IoT room telemetry, master timetable scheduling,
                and conflict-free requisitions across{" "}
                <strong className="text-blue-900 font-semibold">Institute of Engineering & Technology (IET)</strong>{" "}
                and the{" "}
                <strong className="text-indigo-900 font-semibold">Deeksha Bhawan Academic Complex</strong>.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link href="/login">
                  <Button className="bg-blue-700 hover:bg-blue-800 text-white text-xs h-9 px-4 gap-2 shadow-xs">
                    <LogIn className="size-3.5" />
                    <span>Portal Sign In</span>
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 text-xs h-9 px-4 gap-2"
                  >
                    <span>Register Profile</span>
                    <ArrowRight className="size-3.5 text-slate-400" />
                  </Button>
                </Link>
                <a href="#classrooms">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900 text-xs h-9 px-3 gap-1.5">
                    <Building2 className="size-3.5" />
                    <span>Explore 70 Classrooms</span>
                  </Button>
                </a>
              </div>
            </div>

            {/* Quick Campus Telemetry Pill */}
            <div className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur-xs lg:w-72 shrink-0">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>CAMPUS TELEMETRY</span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between rounded-lg bg-blue-50/70 p-2 text-xs border border-blue-100">
                  <div className="flex items-center gap-1.5 font-medium text-blue-900">
                    <Building2 className="size-3.5 text-blue-600" />
                    <span>IET Engineering</span>
                  </div>
                  <span className="font-bold text-blue-800">42 / 42 Online</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-indigo-50/70 p-2 text-xs border border-indigo-100">
                  <div className="flex items-center gap-1.5 font-medium text-indigo-900">
                    <Landmark className="size-3.5 text-indigo-600" />
                    <span>Deeksha Bhawan</span>
                  </div>
                  <span className="font-bold text-indigo-800">28 / 28 Online</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Metric Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Smart Rooms"
            value="70"
            subtitle="IET Blocks A-C & Deeksha Bhawan"
            icon={Building2}
            trend={{ value: "100% mapped", isPositive: true }}
          />
          <StatCard
            title="Classroom Utilization"
            value="68%"
            subtitle="48 rooms currently in active session"
            icon={Layers}
            trend={{ value: "+4.2% peak", isPositive: true }}
          />
          <StatCard
            title="Active Requisitions"
            value={MOCK_BOOKINGS.filter((b) => b.status === "PENDING").length.toString()}
            subtitle="Pending Dean / HOD approval"
            icon={CalendarCheck}
          />
          <StatCard
            title="IoT Nodes & Screens"
            value="280"
            subtitle="Smart displays, mics, ACs & cameras"
            icon={Radio}
            trend={{ value: "98.5% uptime", isPositive: true }}
          />
        </section>

        {/* Dual Campus Profile Cards: IET & Deeksha Bhawan */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* IET Campus Showcase */}
          <div className="rounded-xl border border-blue-200/80 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {CAMPUS_FACILITIES.IET.name}
                  </h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                    IET Campus
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {CAMPUS_FACILITIES.IET.description}
                </p>
              </div>
              <Building2 className="size-6 text-blue-600 shrink-0" />
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Key Academic Wings & Laboratories
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700">
                {CAMPUS_FACILITIES.IET.wings.map((w) => (
                  <div key={w} className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-md border border-slate-100">
                    <CheckCircle2 className="size-3 text-blue-600 shrink-0" />
                    <span className="truncate">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deeksha Bhawan Showcase */}
          <div className="rounded-xl border border-indigo-200/80 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {CAMPUS_FACILITIES.DEEKSHA_BHAWAN.name}
                  </h3>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                    Deeksha Bhawan
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {CAMPUS_FACILITIES.DEEKSHA_BHAWAN.description}
                </p>
              </div>
              <Landmark className="size-6 text-indigo-600 shrink-0" />
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Theatres & Auditorium Wings
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-700">
                {CAMPUS_FACILITIES.DEEKSHA_BHAWAN.wings.map((w) => (
                  <div key={w} className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-md border border-slate-100">
                    <CheckCircle2 className="size-3 text-indigo-600 shrink-0" />
                    <span className="truncate">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature 1: Real-time Smart Classrooms Explorer */}
        <section id="classrooms" className="space-y-4">
          <PageHeader
            heading="Smart Classrooms & IoT Laboratory Network"
            subheading="Live status, capacity parameters, and IoT amenities across IET and Deeksha Bhawan."
            badge={
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Live Sensor Feed
              </Badge>
            }
          />
          <ClassroomGrid initialClassrooms={MOCK_CLASSROOMS} />
        </section>

        {/* Feature 2: Master Timetable & Slot Matrix */}
        <section id="timetable" className="space-y-4">
          <PageHeader
            heading="Academic Master Timetable"
            subheading="Weekly lecture distribution, lab batches, and smart room allocations."
          />
          <TimetableGridPreview slots={MOCK_TIMETABLE_SLOTS} />
        </section>

        {/* Feature 3: Booking Requisitions & Requisition Workflow */}
        <section id="bookings" className="space-y-4">
          <PageHeader
            heading="Room Requisitions & Clash Management"
            subheading="Review pending allocations, extra-lecture requests, and university events."
          />
          <BookingListPreview bookings={MOCK_BOOKINGS} />
        </section>

        {/* Feature 4 & 5: Student & Faculty Experience Previews */}
        <section id="requisition" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <PageHeader
              heading="Faculty Quick Requisition"
              subheading="Request room booking with automated clash detection."
            />
            <FacultyRequisitionCard />
            <FacultyQuickActions />
          </div>

          <div className="space-y-4">
            <PageHeader
              heading="Student Schedule & Directions"
              subheading="Today's live lecture path and room locations."
            />
            <StudentSchedulePreview />
            <AuthCard />
          </div>
        </section>

        {/* Feature 6 & 7: Admin Analytics & System Notifications */}
        <section id="admin" className="space-y-6">
          <PageHeader
            heading="Institutional Telemetry & Governance"
            subheading="Cross-campus analytics, sensor health, and automated safety audit logs."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CampusAnalyticsPreview />
            <AuditFeedPreview />
          </div>

          <div id="notifications">
            <NotificationListPreview notifications={MOCK_NOTIFICATIONS} />
          </div>
        </section>

        {/* Academic SaaS Footer */}
        <footer className="border-t border-slate-200/90 pt-8 mt-12 text-slate-500 text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded bg-blue-700 text-white font-bold text-xs">
                D
              </div>
              <span className="font-semibold text-slate-800">
                {DDUGU_BRAND.name}
              </span>
              <span className="text-slate-400">|</span>
              <span>Gorakhpur, Uttar Pradesh, India</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-500">
              <span>{DDUGU_BRAND.accreditation}</span>
              <span>•</span>
              <span>IET & Deeksha Bhawan Management</span>
              <span>•</span>
              <span className="font-mono text-slate-400">Next.js 16 + Tailwind CSS v4</span>
            </div>
          </div>
        </footer>
      </div>
    </AppShell>
  );
}
