"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyEmailSchema, type VerifyEmailInput } from "@/schemas/auth";
import { authService } from "../services/auth-service";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MailCheck,
  CheckCircle2,
  RotateCcw,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const queryEmail = searchParams.get("email") ?? "student@ddugu.ac.in";
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: {
      email: queryEmail,
      otp: "123456",
    },
  });

  useEffect(() => {
    if (queryEmail) {
      setValue("email", queryEmail);
    }
  }, [queryEmail, setValue]);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setGeneralError(null);

    try {
      const result = await authService.resendVerificationOtp(queryEmail);
      toast({
        title: "Code Dispatched",
        description: result.message,
        variant: "info",
      });
      setResendCooldown(30);
    } catch {
      toast({
        title: "Resend Failed",
        description: "Failed to dispatch a fresh verification code.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: VerifyEmailInput) => {
    setGeneralError(null);
    try {
      const result = await authService.verifyEmailOtp(data);

      if (!result.success) {
        setGeneralError(result.message);
        toast({
          title: "Verification Failed",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      setIsVerified(true);
      toast({
        title: "Identity Verified",
        description: result.message,
        variant: "success",
      });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setGeneralError("Could not complete verification process.");
      toast({
        title: "Error",
        description: "Verification service unresponsive.",
        variant: "destructive",
      });
    }
  };

  if (isVerified) {
    return (
      <div className="space-y-6 text-center sm:text-left">
        <div className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mx-auto sm:mx-0">
          <ShieldCheck className="size-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Institutional Email Verified
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your university identity has been confirmed and activated in the DDUGU central user registry.
          </p>
        </div>

        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <span>Profile Clearance Active</span>
          </div>
          <p className="text-[11px] text-emerald-800">
            You may now sign in using your institutional email and access smart classroom schedules.
          </p>
        </div>

        <Link href="/login" className="block pt-2">
          <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs h-9">
            <span>Proceed to Sign In</span>
            <ArrowRight className="size-3.5 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 mx-auto sm:mx-0 mb-2">
          <MailCheck className="size-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Verify Institutional Email
        </h2>
        <p className="text-xs text-slate-500">
          We sent a 6-digit verification code to your official DDUGU webmail:
        </p>
        <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
          {queryEmail}
        </span>
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

      {/* Verification Code Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="otp" className="text-xs font-semibold text-slate-700">
            6-Digit Verification Code <span className="text-rose-500">*</span>
          </Label>
          <Input
            id="otp"
            type="text"
            maxLength={6}
            placeholder="123456"
            className="text-center font-mono text-lg tracking-[0.4em] font-bold h-11 bg-white uppercase"
            aria-invalid={!!errors.otp}
            {...register("otp")}
          />
          {errors.otp && (
            <p className="text-[11px] text-rose-600 font-medium">{errors.otp.message}</p>
          )}
          <p className="text-[11px] text-slate-500">
            Demo Tip: Enter <strong>123456</strong> or any 6-digit numeric sequence.
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
              <span>Validating with Central LDAP Directory...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="size-3.5 mr-2" />
              <span>Verify & Activate Account</span>
            </>
          )}
        </Button>
      </form>

      {/* Resend Code Section */}
      <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>Didn&apos;t receive the code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isResending}
          className="font-semibold text-blue-700 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1"
        >
          <RotateCcw className="size-3" />
          <span>
            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code to Webmail"}
          </span>
        </button>
      </div>

      <div className="text-center">
        <Link href="/login" className="text-xs text-slate-500 hover:text-slate-800 underline">
          Cancel and return to Sign In
        </Link>
      </div>
    </div>
  );
}

