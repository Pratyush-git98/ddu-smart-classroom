"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import { DDUGU_BRAND, CAMPUS_FACILITIES } from "@/lib/design-tokens";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Building2,
  Landmark,
  ShieldCheck,
  Radio,
  Clock,
  Sparkles,
  ArrowLeft,
  Tv,
} from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  subtitle?: string;
  badgeText?: string;
}

export function AuthLayout({
  children,
  subtitle = "Central Smart Classroom & Campus Management Portal",
  badgeText = "Institutional Single Sign-On",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900">
      {/* ========================================================= */}
      {/* LEFT PANEL: University Branding & Academic Illustration */}
      {/* ========================================================= */}
      <div className="relative hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col justify-between bg-[#0b1329] text-white p-10 xl:p-14 overflow-hidden border-r border-slate-800">
        {/* Subtle Background Glow & Geometric Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.22),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(67,56,202,0.2),transparent_60%)] pointer-events-none" />
        <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />

        {/* Top: University Brand Header */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Campus Portal</span>
            </Link>
            <Badge
              variant="outline"
              className="bg-blue-950/60 text-blue-300 border-blue-800/80 text-[11px] px-2.5 py-0.5"
            >
              {badgeText}
            </Badge>
          </div>

          <div className="flex items-start gap-4 pt-2">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-2xl shadow-lg shadow-blue-900/40 ring-1 ring-blue-400/30 shrink-0">
              D
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-semibold tracking-wide text-blue-300 block">
                {DDUGU_BRAND.hindiName}
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
                {DDUGU_BRAND.name}
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Gorakhpur, Uttar Pradesh • {DDUGU_BRAND.accreditation} (Estd. {DDUGU_BRAND.established})
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Subtle Academic & Smart Campus SVG Illustration */}
        <div className="relative z-10 my-8 py-4">
          <div className="relative mx-auto max-w-md rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6 backdrop-blur-md shadow-2xl space-y-5">
            {/* Vector Classroom Nodes Art */}
            <div className="relative h-44 w-full flex items-center justify-center">
              <svg
                viewBox="0 0 400 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-blue-500/40"
              >
                {/* Connecting Grid Lines */}
                <line x1="60" y1="90" x2="200" y2="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="340" y1="90" x2="200" y2="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="60" y1="90" x2="140" y2="150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="340" y1="90" x2="260" y2="150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="140" y1="150" x2="260" y2="150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* Central Server / DDUGU CCC Hub */}
                <circle cx="200" cy="40" r="28" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="200" cy="40" r="18" fill="#172554" />
                <text x="200" y="44" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold">
                  DDU CCC
                </text>

                {/* Left Node: IET Campus */}
                <circle cx="60" cy="90" r="24" fill="#0f172a" stroke="#2563eb" strokeWidth="2" />
                <text x="60" y="94" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="bold">
                  IET
                </text>

                {/* Right Node: Deeksha Bhawan */}
                <circle cx="340" cy="90" r="24" fill="#0f172a" stroke="#4f46e5" strokeWidth="2" />
                <text x="340" y="94" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontWeight="bold">
                  DEEKSHA
                </text>

                {/* Bottom Left: Smart Lecture Theatres */}
                <circle cx="140" cy="150" r="20" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
                <text x="140" y="153" textAnchor="middle" fill="#a5f3fc" fontSize="8">
                  LT-1..6
                </text>

                {/* Bottom Right: Smart Labs */}
                <circle cx="260" cy="150" r="20" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <text x="260" y="153" textAnchor="middle" fill="#a7f3d0" fontSize="8">
                  CSE Labs
                </text>
              </svg>
            </div>

            {/* Sub-headline */}
            <div className="space-y-1 text-center">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Unified Academic Infrastructure
              </h3>
              <p className="text-xs text-slate-400">
                Connected IoT displays, auto-scheduling, and clash-free lecture allocations.
              </p>
            </div>

            {/* Campus Highlights Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <div className="flex items-center gap-1.5 font-bold text-blue-400 mb-1">
                  <Building2 className="size-3.5" />
                  <span>{CAMPUS_FACILITIES.IET.name}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  42 Smart Classrooms • Blocks A, B, C & CCF
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <div className="flex items-center gap-1.5 font-bold text-indigo-400 mb-1">
                  <Landmark className="size-3.5" />
                  <span>{CAMPUS_FACILITIES.DEEKSHA_BHAWAN.name}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  28 Lecture Theatres • Central Auditorium
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Institutional Security & Trust Assurance */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              <span>DDU Central Computer Center Identity Gateway</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">v2.4 LTS</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT PANEL: Form Container & Mobile Header               */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto">
        {/* Mobile Header (Only visible on small devices) */}
        <div className="lg:hidden flex items-center justify-between pb-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-700 text-white font-bold text-sm shadow-xs">
              D
            </div>
            <div>
              <span className="font-bold text-xs tracking-tight text-slate-900 block">
                {DDUGU_BRAND.shortName}
              </span>
              <span className="text-[10px] text-slate-500">Smart Classroom System</span>
            </div>
          </Link>
          <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
            {DDUGU_BRAND.accreditation}
          </Badge>
        </div>

        {/* Centered Form Wrapper */}
        <div className="my-auto mx-auto w-full max-w-md py-6 sm:py-8">
          {children}
        </div>

        {/* Bottom Navigation & Helpdesk Footer */}
        <div className="pt-6 border-t border-slate-200/90 text-center text-xs text-slate-500 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600">
            <Link href="/" className="hover:text-blue-700 transition-colors">
              Campus Overview
            </Link>
            <span>•</span>
            <Link href="/unauthorized" className="hover:text-blue-700 transition-colors">
              Access Clearance Policy
            </Link>
            <span>•</span>
            <a
              href="https://ddugu.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition-colors"
            >
              DDUGU Official Portal
            </a>
          </div>
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} {DDUGU_BRAND.name}, Gorakhpur. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

