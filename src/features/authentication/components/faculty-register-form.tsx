"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FacultyRegistrationSchema,
  type FacultyRegistrationInput,
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
  BadgeCheck,
  Building,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  AlertCircle,
} from "lucide-react";

export function FacultyRegisterForm() {
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
  } = useForm<FacultyRegistrationInput>({
    resolver: zodResolver(FacultyRegistrationSchema),
    defaultValues: {
      role: "FACULTY",
      fullName: "",
      email: "",
      employeeId: "",
      department: "Computer Science & Engineering",
      designation: "Assistant Professor",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: FacultyRegistrationInput) => {
    setGeneralError(null);
    try {
      const result = await authService.registerFaculty(data);

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
        title: "Faculty Registration Submitted",
        description: result.message,
        variant: "success",
      });

      // Redirect to verification
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}&role=FACULTY`);
    } catch {
      setGeneralError("An error occurred during faculty registration. Please try again.");
      toast({
        title: "Network Error",
        description: "Failed to connect to the institutional faculty service.",
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
          <Label htmlFor="facultyName" className="text-xs font-semibold text-slate-700">
            Full Name & Title <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="facultyName"
              placeholder="e.g. Dr. Arvind Tripathi"
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
          <Label htmlFor="facultyEmail" className="text-xs font-semibold text-slate-700">
            Official Faculty Email <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="facultyEmail"
              type="email"
              placeholder="faculty.name@ddugu.ac.in"
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

      {/* Row 2: Employee ID */}
      <div className="space-y-1">
        <Label htmlFor="employeeId" className="text-xs font-semibold text-slate-700">
          Faculty Employee ID <span className="text-rose-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="employeeId"
            placeholder="e.g. DDU-FAC-101"
            className="pl-8 text-xs h-9 bg-white uppercase font-mono"
            aria-invalid={!!errors.employeeId}
            {...register("employeeId")}
          />
          <BadgeCheck className="size-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
        </div>
        {errors.employeeId && (
          <p className="text-[11px] text-rose-600 font-medium">{errors.employeeId.message}</p>
        )}
      </div>

      {/* Row 3: Department & Designation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="facultyDept" className="text-xs font-semibold text-slate-700">
            Academic Department <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <select
              id="facultyDept"
              className="w-full rounded-lg border border-input bg-white pl-8 pr-3 text-xs h-9 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("department")}
            >
              <option value="Computer Science & Engineering">Dept. of Computer Science & Engineering (IET)</option>
              <option value="Electronics & Communication Engineering">Dept. of Electronics & Communication (IET)</option>
              <option value="Mechanical Engineering">Dept. of Mechanical Engineering (IET)</option>
              <option value="Civil Engineering">Dept. of Civil Engineering (IET)</option>
              <option value="Information Technology">Dept. of Information Technology (IET)</option>
              <option value="Applied Sciences">Applied Sciences & Humanities (IET)</option>
              <option value="Commerce & Management">Commerce & MBA (Deeksha Bhawan)</option>
              <option value="Faculty of Arts">Faculty of Arts (Deeksha Bhawan)</option>
            </select>
            <Building className="size-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="designation" className="text-xs font-semibold text-slate-700">
            Designation / Academic Rank <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <select
              id="designation"
              className="w-full rounded-lg border border-input bg-white pl-8 pr-3 text-xs h-9 text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("designation")}
            >
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Head of Department">Head of Department (HOD)</option>
              <option value="Guest Lecturer / Teaching Fellow">Guest Lecturer / Teaching Fellow</option>
            </select>
            <Briefcase className="size-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Password & Confirm Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <Label htmlFor="facPassword" className="text-xs font-semibold text-slate-700">
            Create Password <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="facPassword"
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
          <Label htmlFor="facConfirmPassword" className="text-xs font-semibold text-slate-700">
            Confirm Password <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="facConfirmPassword"
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

      {/* Terms and Faculty Guidelines Checkbox */}
      <div className="space-y-1 pt-2">
        <div className="flex items-start space-x-2">
          <Checkbox id="acceptFacultyTerms" {...register("acceptTerms")} />
          <Label
            htmlFor="acceptFacultyTerms"
            className="text-xs font-normal text-slate-600 cursor-pointer leading-tight"
          >
            I certify that I am a recognized faculty member of DDUGU. I agree to comply with the{" "}
            <span className="text-blue-700 font-semibold underline">Faculty IT Usage Policy</span>,
            smart room reservation ethics, and equipment security protocols.
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
            <span>Validating Faculty Credentials with Academic Office...</span>
          </>
        ) : (
          <>
            <UserPlus className="size-3.5 mr-2" />
            <span>Register Faculty Account</span>
          </>
        )}
      </Button>
    </form>
  );
}

