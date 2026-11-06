import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout, VerifyEmailForm } from "@/features/authentication";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify University Email | DDUGU Smart Classroom Portal",
  description:
    "Verify your @ddugu.ac.in institutional email address to activate your smart classroom management access.",
};

function VerifyEmailFallback() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <Loader2 className="size-8 animate-spin text-blue-600" />
      <p className="text-xs text-slate-500">Loading university verification portal...</p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      subtitle="Institutional email ownership verification"
      badgeText="Identity Gateway"
    >
      <Suspense fallback={<VerifyEmailFallback />}>
        <VerifyEmailForm />
      </Suspense>
    </AuthLayout>
  );
}

