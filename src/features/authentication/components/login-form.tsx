"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginInput } from "@/schemas/auth";
import { authService } from "../services/auth-service";
import { DemoCredentialsBanner } from "./demo-credentials-banner";
import type { DemoCredential } from "../types";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [authSuccessUser, setAuthSuccessUser] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "faculty@ddugu.ac.in",
      password: "Faculty@1234",
      role: "FACULTY",
      rememberMe: true,
    },
  });

  const currentEmail = watch("email");

  const handleSelectDemoCredential = (cred: DemoCredential) => {
    setValue("email", cred.email, { shouldValidate: true });
    setValue("password", cred.passwordHint, { shouldValidate: true });
    setValue("role", cred.role, { shouldValidate: true });
    setGeneralError(null);

    toast({
      title: `${cred.label} Demo Selected`,
      description: `Loaded ${cred.email}. Click "Sign In with University ID" to authenticate.`,
      variant: "info",
    });
  };

  const onSubmit = async (data: LoginInput) => {
    setGeneralError(null);
    try {
      const result = await authService.login(data);

      if (!result.success) {
        setGeneralError(result.message);
        toast({
          title: "Authentication Failed",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      setAuthSuccessUser(result.user?.name ?? data.email);

      toast({
        title: "Authentication Successful",
        description: `Welcome to DDUGU Smart Campus Portal, ${result.user?.name ?? "User"}. Clearance: [${result.user?.role}]`,
        variant: "success",
      });

      // Simulated redirection notice for frontend demonstration
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch {
      setGeneralError("An unexpected error occurred while communicating with the university gateway.");
      toast({
        title: "Connection Error",
        description: "Could not reach the institutional authentication service.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="space-y-1.5 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign In to Smart Campus
        </h2>
        <p className="text-xs text-slate-500">
          Enter your official university credentials or select a demonstration account below.
        </p>
      </div>

      {/* Demo Credentials Quick-Picker */}
      <DemoCredentialsBanner
        onSelectCredential={handleSelectDemoCredential}
        activeEmail={currentEmail}
      />

      {/* General Error Banner */}
      {generalError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-800 animate-in fade-in"
        >
          <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold block">Access Denied</span>
            <span>{generalError}</span>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {authSuccessUser && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 animate-in fade-in"
        >
          <ShieldCheck className="size-4 shrink-0 text-emerald-600 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold block">Authenticated Successfully</span>
            <span>Identity verified for {authSuccessUser}. Redirecting to campus overview...</span>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
            Institutional Email Address <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="e.g. faculty@ddugu.ac.in"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="pl-9 text-xs h-9 bg-white"
              {...register("email")}
            />
            <Mail className="size-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
          {errors.email && (
            <p id="email-error" className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="size-3 shrink-0" />
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
              Account Password <span className="text-rose-500">*</span>
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-blue-700 hover:text-blue-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••••"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className="pl-9 pr-10 text-xs h-9 bg-white"
              {...register("password")}
            />
            <Lock className="size-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="size-3 shrink-0" />
              <span>{errors.password.message}</span>
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center space-x-2 pt-0.5">
          <Checkbox id="rememberMe" {...register("rememberMe")} />
          <Label
            htmlFor="rememberMe"
            className="text-xs font-normal text-slate-600 cursor-pointer"
          >
            Remember my institutional device for 14 days
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs h-9 shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-3.5 animate-spin mr-2" />
              <span>Verifying with DDUGU Central Computer Center...</span>
            </>
          ) : (
            <>
              <LogIn className="size-3.5 mr-2" />
              <span>Sign In with University ID</span>
            </>
          )}
        </Button>
      </form>

      {/* Registration Redirect Link */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-600">
          New student or faculty member?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-700 hover:text-blue-800 hover:underline"
          >
            Register your university profile
          </Link>
        </p>
      </div>
    </div>
  );
}

