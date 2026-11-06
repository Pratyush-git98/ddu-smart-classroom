"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, Building2, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminRegistrationNotice() {
  return (
    <div className="rounded-xl border border-amber-200/90 bg-amber-50/60 p-4 text-xs space-y-3">
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="size-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-950">
            Administrative Access Restricted by Policy
          </h4>
          <p className="text-amber-800 leading-relaxed">
            University Administrator, Dean of Academics, and Central Timetable Controller accounts
            cannot be registered through public self-service. These credentials are provisioned
            directly by the <strong>DDUGU Central Computer Center (CCC)</strong> upon written authorization
            from the <strong>Office of the Registrar</strong>.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white/80 p-3 border border-amber-200/80 space-y-1.5 text-slate-700">
        <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-500 block">
          Institutional Contact for Administrative Provisioning:
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-slate-600">
          <span className="flex items-center gap-1.5">
            <Building2 className="size-3.5 text-slate-500" />
            Central Computer Center, Administrative Block
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Mail className="size-3.5 text-slate-500" />
            ccc@ddugu.ac.in
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-amber-900 font-medium">
          Already have approved administrative credentials?
        </span>
        <Link href="/login">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-amber-900 hover:text-amber-950 hover:bg-amber-100/70 h-7 px-2 font-semibold"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="size-3 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

