"use client";

import React from "react";
import { DEMO_CREDENTIALS } from "../services/mock/mock-users";
import type { DemoCredential } from "../types";
import { Sparkles, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DemoCredentialsBannerProps {
  onSelectCredential: (cred: DemoCredential) => void;
  activeEmail?: string;
}

export function DemoCredentialsBanner({
  onSelectCredential,
  activeEmail,
}: DemoCredentialsBannerProps) {
  return (
    <div className="rounded-xl border border-blue-200/90 bg-blue-50/50 p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-blue-600" />
          <span className="text-xs font-bold text-blue-950">
            Frontend Demonstration Accounts
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] bg-white text-blue-700 border-blue-200">
          Click to Auto-fill
        </Badge>
      </div>

      <p className="text-[11px] text-slate-600 leading-relaxed">
        Select a verified university persona below to test role-specific clearance and portal features:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {DEMO_CREDENTIALS.map((cred) => {
          const isSelected = activeEmail === cred.email;
          return (
            <button
              key={cred.role}
              type="button"
              onClick={() => onSelectCredential(cred)}
              className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all ${
                isSelected
                  ? "border-blue-600 bg-white shadow-xs ring-1 ring-blue-500"
                  : "border-blue-200/80 bg-white/70 hover:bg-white hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-0.5">
                <span className="text-xs font-bold text-slate-900">{cred.label.split(" ")[0]}</span>
                {isSelected && <UserCheck className="size-3 text-blue-600" />}
              </div>
              <span className="text-[10px] font-mono text-blue-700 truncate w-full">
                {cred.email}
              </span>
              <span className="text-[9px] text-slate-500 truncate w-full mt-0.5">
                Pass: {cred.passwordHint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

