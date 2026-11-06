"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StudentRegistrationSchema,
  type StudentRegistrationInput,
} from "@/schemas/auth";
import { authService } from "../services/auth-service";
import { PasswordStrengthIndicator } from "./password-strength-indicator";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Hash,
  Building,
  GraduationCap,
  Layers,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  AlertCircle,
  FileCheck2,
} from "lucide-react";

export function StudentRegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StudentRegistrationInput>({
    resolver: zodResolver(StudentRegistrationSchema),
    defaultValues: {
      role: "STUDENT",
      fullName: "",
      email: "",
      enrollmentNumber: "",
      department: "Computer Science & Engineering",
      branch: "CSE",
      academicYear: "3rd Year",
      semester: 5,
      batch: "2023-2027",
      section: "A",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: StudentRegistrationInput) => {
    setGeneralError(null);
    try {
      const result = await authService.registerStudent(data);

      if (!result.success) {
        setGeneralError(result.message);
        toast({
          title: "Registration Failed",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Registration Submitted",
        description: result.message,
        variant: "success",
      });

      // Redirect to email verification page with pre-filled email
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}&role=STUDENT`);
    } catch {
      setGeneralError("An error occurred during submission. Please try again.");
      toast({
        title: "Network Error",
        description: "Failed to connect to the student registration service.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {generalError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-800"
        >
          <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Row 1: Full Name & Institutional Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700">
            Full Name <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="fullName"
              placeholder="e.g. Aditya Verma"
              className="pl-8 text-xs h-9 bg-white"
              aria-invalid={!!errors.fullName}
              {...register("fullName")}
            />
            <User className="size-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
          {errors.fullName && (
            <p className="text-[11px] text-rose-600 font-medium">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
            Institutional Email <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="roll.cse@ddugu.ac.in"
              className="pl-8 text-xs h-9 bg-white"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <Mail className="size-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-600 font-medium">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Student Enrollment No & Department */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="enrollmentNumber" className="text-xs font-semibold text-slate-700">
            Enrollment / Roll Number <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="enrollmentNumber"
              placeholder="e.g. 2024CS042"
              className="pl-8 text-xs h-9 bg-white uppercase font-mono"
              aria-invalid={!!errors.enrollmentNumber}
              {...register("enrollmentNumber")}
            />
            <Hash className="size-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
          {errors.enrollmentNumber && (
            <p className="text-[11px] text-rose-600 font-medium">{errors.enrollmentNumber.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="department" className="text-xs font-semibold text-slate-700">
            Department <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <select
              id="department"
              className="w-full rounded-lg border border-input bg-white pl-8 pr-3 text-xs h-9 text-slate-800 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              {...register("department")}
            >
              <option value="Computer Science & Engineering">Dept. of Computer Science & Engineering</option>
              <option value="Electronics & Communication Engineering">Dept. of Electronics & Communication</option>
              <option value="Mechanical Engineering">Dept. of Mechanical Engineering</option>
              <option value="Civil Engineering">Dept. of Civil Engineering</option>
              <option value="Information Technology">Dept. of Information Technology</option>
              <option value="Commerce & Management">Faculty of Commerce & Management</option>
            </select>
            <Building className="size-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Row 3: Branch, Academic Year & Semester */}
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <Label htmlFor="branch" className="text-xs font-semibold text-slate-700">
            Branch <span className="text-rose-500">*</span>
          </Label>
          <select
            id="branch"
            className="w-full rounded-lg border border-input bg-white px-2.5 text-xs h-9 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("branch")}
          >
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            <option value="Civil">Civil</option>
            <option value="MBA">MBA</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="academicYear" className="text-xs font-semibold text-slate-700">
            Year <span className="text-rose-500">*</span>
          </Label>
          <select
            id="academicYear"
            className="w-full rounded-lg border border-input bg-white px-2.5 text-xs h-9 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("academicYear")}
          >
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="semester" className="text-xs font-semibold text-slate-700">
            Semester <span className="text-rose-500">*</span>
          </Label>
          <select
            id="semester"
            className="w-full rounded-lg border border-input bg-white px-2.5 text-xs h-9 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register("semester", { valueAsNumber: true })}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <option key={s} value={s}>
                Sem {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4: Batch & Section */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="batch" className="text-xs font-semibold text-slate-700">
            Batch (YYYY-YYYY) <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="batch"
              placeholder="e.g. 2023-2027"
              className="pl-8 text-xs h-9 bg-white"
              aria-invalid={!!errors.batch}
              {...register("batch")}
            />
            <Calendar className="size-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
          {errors.batch && (
            <p className="text-[11px] text-rose-600 font-medium">{errors.batch.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="section" className="text-xs font-semibold text-slate-700">
            Section <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="section"
              placeholder="e.g. A"
              className="pl-8 text-xs h-9 bg-white uppercase font-mono"
              aria-invalid={!!errors.section}
              {...register("section")}
            />
            <Layers className="size-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
          {errors.section && (
            <p className="text-[11px] text-rose-600 font-medium">{errors.section.message}</p>
          )}
        </div>
      </div>

      {/* Password & Confirm Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
            Create Password <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="pl-8 pr-8 text-xs h-9 bg-white"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <Lock className="size-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-600 font-medium">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700">
            Confirm Password <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="pl-8 pr-8 text-xs h-9 bg-white"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            <Lock className="size-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-rose-600 font-medium">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Password Strength Indicator */}
      <PasswordStrengthIndicator password={passwordValue} />

      {/* Terms and Code of Conduct Checkbox */}
      <div className="space-y-1 pt-2">
        <div className="flex items-start space-x-2">
          <Checkbox id="acceptTerms" {...register("acceptTerms")} />
          <Label
            htmlFor="acceptTerms"
            className="text-xs font-normal text-slate-600 cursor-pointer leading-tight"
          >
            I confirm that I am a currently enrolled DDUGU student. I agree to abide by the{" "}
            <span className="text-blue-700 font-semibold underline">University Academic Code of Conduct</span>{" "}
            and IT usage policies.
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="text-[11px] text-rose-600 font-medium">{errors.acceptTerms.message}</p>
        )}
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
            <span>Validating with DDUGU Registrar Database...</span>
          </>
        ) : (
          <>
            <UserPlus className="size-3.5 mr-2" />
            <span>Register Student Profile</span>
          </>
        )}
      </Button>
    </form>
  );
}
