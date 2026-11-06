import type { Metadata } from "next";
import { AuthLayout, ForgotPasswordForm } from "@/features/authentication";

export const metadata: Metadata = {
  title: "Password Recovery | DDUGU Smart Classroom Portal",
  description:
    "Reset your institutional password for Deen Dayal Upadhyaya Gorakhpur University Smart Classroom Management System.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      subtitle="Institutional password recovery and credential renewal"
      badgeText="Security Gateway"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

