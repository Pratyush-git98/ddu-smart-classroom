import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AuthLayout, LoginForm } from "@/features/authentication";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Institutional Sign In | DDUGU Smart Classroom Portal",
  description:
    "Single Sign-On portal for Deen Dayal Upadhyaya Gorakhpur University students and faculty accessing IET & Deeksha Bhawan smart classroom systems.",
};

function LoginLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-3">
      <Loader2 className="size-8 animate-spin text-blue-600" />
      <p className="text-xs text-slate-500">Loading university SSO gateway...</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout
      subtitle="Sign in with your @ddugu.ac.in institutional account"
      badgeText="Institutional SSO"
    >
      <Suspense fallback={<LoginLoading />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
