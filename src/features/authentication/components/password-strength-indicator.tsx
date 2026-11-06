"use client";

import React, { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PasswordStrengthResult, PasswordRuleStatus } from "../types";

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const rules: PasswordRuleStatus = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  const passedCount = Object.values(rules).filter(Boolean).length;

  let score: PasswordStrengthResult["score"] = 0;
  let label: PasswordStrengthResult["label"] = "Very Weak";
  let colorClass = "bg-rose-500 text-rose-600";
  let progressPercent = 10;

  if (passedCount <= 1) {
    score = 0;
    label = "Very Weak";
    colorClass = "bg-rose-500 text-rose-600";
    progressPercent = 20;
  } else if (passedCount === 2) {
    score = 1;
    label = "Weak";
    colorClass = "bg-amber-500 text-amber-600";
    progressPercent = 40;
  } else if (passedCount === 3) {
    score = 2;
    label = "Fair";
    colorClass = "bg-yellow-500 text-yellow-600";
    progressPercent = 60;
  } else if (passedCount === 4) {
    score = 3;
    label = "Good";
    colorClass = "bg-blue-600 text-blue-600";
    progressPercent = 80;
  } else if (passedCount === 5) {
    score = 4;
    label = "Strong";
    colorClass = "bg-emerald-600 text-emerald-600";
    progressPercent = 100;
  }

  return {
    score,
    label,
    colorClass,
    progressPercent,
    rules,
  };
}

interface PasswordStrengthIndicatorProps {
  password?: string;
  showRules?: boolean;
  className?: string;
}

export function PasswordStrengthIndicator({
  password = "",
  showRules = true,
  className,
}: PasswordStrengthIndicatorProps) {
  const result = useMemo(() => evaluatePasswordStrength(password), [password]);

  if (!password) {
    return null;
  }

  return (
    <div className={cn("space-y-2 pt-1", className)}>
      {/* Meter Bar & Score Label */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Password Strength:</span>
          <span
            className={cn(
              "font-semibold",
              result.score === 0 && "text-rose-600",
              result.score === 1 && "text-amber-600",
              result.score === 2 && "text-yellow-600",
              result.score === 3 && "text-blue-600",
              result.score === 4 && "text-emerald-600"
            )}
          >
            {result.label}
          </span>
        </div>

        {/* 4-Segmented Progress Bar */}
        <div className="grid grid-cols-4 gap-1.5 h-1.5">
          <div
            className={cn(
              "rounded-full transition-colors h-full",
              result.score >= 1 ? result.colorClass.split(" ")[0] : "bg-slate-200"
            )}
          />
          <div
            className={cn(
              "rounded-full transition-colors h-full",
              result.score >= 2 ? result.colorClass.split(" ")[0] : "bg-slate-200"
            )}
          />
          <div
            className={cn(
              "rounded-full transition-colors h-full",
              result.score >= 3 ? result.colorClass.split(" ")[0] : "bg-slate-200"
            )}
          />
          <div
            className={cn(
              "rounded-full transition-colors h-full",
              result.score === 4 ? result.colorClass.split(" ")[0] : "bg-slate-200"
            )}
          />
        </div>
      </div>

      {/* Rules Checklist */}
      {showRules && (
        <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-[11px] space-y-1 text-slate-600">
          <div className="flex items-center gap-1.5">
            {result.rules.hasMinLength ? (
              <Check className="size-3 text-emerald-600 shrink-0" />
            ) : (
              <X className="size-3 text-slate-400 shrink-0" />
            )}
            <span className={result.rules.hasMinLength ? "text-slate-900 font-medium" : ""}>
              At least 8 characters
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {result.rules.hasUppercase ? (
              <Check className="size-3 text-emerald-600 shrink-0" />
            ) : (
              <X className="size-3 text-slate-400 shrink-0" />
            )}
            <span className={result.rules.hasUppercase ? "text-slate-900 font-medium" : ""}>
              One uppercase letter (A-Z)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {result.rules.hasLowercase ? (
              <Check className="size-3 text-emerald-600 shrink-0" />
            ) : (
              <X className="size-3 text-slate-400 shrink-0" />
            )}
            <span className={result.rules.hasLowercase ? "text-slate-900 font-medium" : ""}>
              One lowercase letter (a-z)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {result.rules.hasNumber ? (
              <Check className="size-3 text-emerald-600 shrink-0" />
            ) : (
              <X className="size-3 text-slate-400 shrink-0" />
            )}
            <span className={result.rules.hasNumber ? "text-slate-900 font-medium" : ""}>
              At least one number (0-9)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {result.rules.hasSpecialChar ? (
              <Check className="size-3 text-emerald-600 shrink-0" />
            ) : (
              <X className="size-3 text-slate-400 shrink-0" />
            )}
            <span className={result.rules.hasSpecialChar ? "text-slate-900 font-medium" : ""}>
              At least one special character (@$!%*?&#)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

