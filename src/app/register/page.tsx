"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AuthLayout,
  StudentRegisterForm,
  FacultyRegisterForm,
  AdminRegistrationNotice,
} from "@/features/authentication";
import { GraduationCap, BookOpen, ShieldAlert } from "lucide-react";

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"STUDENT" | "FACULTY">("STUDENT");
  const [showAdminNotice, setShowAdminNotice] = useState(false);

  return (
    <AuthLayout
      subtitle="Register an institutional profile for students or faculty"
      badgeText="Academic Registration"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1.5 text-center sm:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Create University Profile
          </h2>
          <p className="text-xs text-slate-500">
            Select your academic role to register for smart classroom access at IET and Deeksha Bhawan.
          </p>
        </div>

        {/* Role Selection Tabs (Student vs Faculty ONLY - NOT Admin) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Select Your Academic Role
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab("STUDENT")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === "STUDENT"
                  ? "bg-white text-blue-900 shadow-xs ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="size-4 text-blue-600" />
              <span>Enrolled Student</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("FACULTY")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === "FACULTY"
                  ? "bg-white text-indigo-900 shadow-xs ring-1 ring-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="size-4 text-indigo-600" />
              <span>Academic Faculty</span>
            </button>
          </div>
        </div>

        {/* Admin Policy Banner / Toggle */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-0.5">
          <span>Are you a Department Admin or Dean?</span>
          <button
            type="button"
            onClick={() => setShowAdminNotice(!showAdminNotice)}
            className="font-semibold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1"
          >
            <ShieldAlert className="size-3" />
            <span>{showAdminNotice ? "Hide Admin Policy" : "Admin Account Policy"}</span>
          </button>
        </div>

        {showAdminNotice && <AdminRegistrationNotice />}

        {/* Form Container */}
        <div className="pt-1">
          {activeTab === "STUDENT" ? <StudentRegisterForm /> : <FacultyRegisterForm />}
        </div>

        {/* Link back to login */}
        <div className="text-center pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-600">
            Already have a registered university account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
            >
              Sign In with Institutional ID
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

