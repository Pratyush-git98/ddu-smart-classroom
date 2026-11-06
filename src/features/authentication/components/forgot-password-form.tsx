"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth";
import { authService } from "../services/auth-service";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Building2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setGeneralError(null);
    try {
      const result = await authService.requestPasswordReset(data);

      if (!result.success) {
        setGeneralError(result.message);
        toast({
          title: "Request Failed",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      setSubmittedEmail(data.email);
      setIsSuccess(true);
      toast({
        title: "Reset Dispatch Sent",
        description: `Instructions transmitted to ${data.email}.`,
        variant: "success",
      });
    } catch {
      setGeneralError("Failed to communicate with password reset gateway.");
      toast({
        title: "Gateway Error",
        description: "Could not dispatch password reset token.",
        variant: "destructive",
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center sm:text-left">
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mx-auto sm:mx-0">
          <CheckCircle2 className="size-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Check Your University Inbox
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            We have dispatched an automated password recovery link and security code to:
          </p>
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-2.5 font-mono text-xs font-bold text-blue-900 text-center">
            {submittedEmail}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-left text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Building2 className="size-3.5 text-blue-600" />
            <span>DDUGU Institutional Webmail Access:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            1. Access your student/faculty inbox at <code>webmail.ddugu.ac.in</code>.
            <br />
            2. The recovery token expires in 15 minutes.
            <br />
            3. If not received, verify your spam folder or contact the CCC Helpdesk.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <Link href={`/verify-email?email=${encodeURIComponent(submittedEmail)}&flow=reset`} className="flex-1">
            <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs h-9">
              Enter Recovery Code
            </Button>
          </Link>

          <Link href="/login" className="flex-1">
            <Button variant="outline" className="w-full text-xs h-9">
              <ArrowLeft className="size-3 mr-1.5" />
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center sm:text-left">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline mb-2"
        >
          <ArrowLeft className="size-3" />
          <span>Back to Sign In</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Reset University Password
        </h2>
        <p className="text-xs text-slate-500">
          Enter your official DDUGU institutional email to receive recovery instructions.
        </p>
      </div>

      {generalError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-800"
        >
          <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="resetEmail" className="text-xs font-semibold text-slate-700">
            Registered Institutional Email <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="resetEmail"
              type="email"
              autoComplete="email"
              placeholder="e.g. name@ddugu.ac.in"
              className="pl-9 text-xs h-9 bg-white"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <Mail className="size-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="size-3 shrink-0" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        <div className="rounded-lg bg-blue-50/70 border border-blue-100 p-3 text-xs text-blue-900 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold">
            <HelpCircle className="size-3.5 text-blue-600" />
            <span>Need Help with Account Access?</span>
          </div>
          <p className="text-[11px] text-slate-600">
            If you have forgotten your university email address or your account has been locked due to failed attempts, please visit the <strong>Central Computer Center (CCC)</strong> with your University ID card.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs h-9 shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin mr-2" />
              <span>Generating University Security Token...</span>
            </>
          ) : (
            <>
              <Send className="size-3.5 mr-2" />
              <span>Send Recovery Instructions</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

