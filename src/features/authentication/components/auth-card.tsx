"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { USER_ROLES } from "@/lib/design-tokens";
import type { UserRole } from "@/types";
import { Lock, Mail, Shield, CheckCircle2, ArrowRight } from "lucide-react";

interface AuthCardProps {
  onRoleSelect?: (role: UserRole) => void;
  className?: string;
}

export function AuthCard({ onRoleSelect, className }: AuthCardProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("FACULTY");
  const [email, setEmail] = useState("faculty@ddugu.ac.in");

  const handleRoleClick = (role: UserRole) => {
    setSelectedRole(role);
    onRoleSelect?.(role);
    if (role === "STUDENT") setEmail("student.roll@ddugu.ac.in");
    else if (role === "FACULTY") setEmail("faculty.hod@ddugu.ac.in");
    else if (role === "ADMIN") setEmail("admin.iet@ddugu.ac.in");
    else setEmail("superadmin@ddugu.ac.in");
  };

  return (
    <Card className={`border-slate-200 shadow-sm bg-white ${className ?? ""}`}>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            DDUGU SSO Portal
          </Badge>
          <span className="text-[11px] text-slate-400">Institutional Access</span>
        </div>
        <CardTitle className="text-lg font-bold text-slate-900">
          Smart Campus Sign In
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Select your institutional role to preview classroom management modules
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Role Selection Tabs */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">
            Select Academic Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(USER_ROLES) as UserRole[]).map((role) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleClick(role)}
                  className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-1 ring-blue-500"
                      : "border-slate-200 bg-slate-50/50 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold">{USER_ROLES[role].label}</span>
                    {isSelected && <CheckCircle2 className="size-3.5 text-blue-600" />}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                    {USER_ROLES[role].description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Credentials Form Preview */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Institutional Email / ID
            </label>
            <div className="relative">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@ddugu.ac.in"
                className="pl-8 text-xs"
              />
              <Mail className="size-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">
              Password / SAML Token
            </label>
            <div className="relative">
              <Input
                type="password"
                defaultValue="••••••••••••"
                className="pl-8 text-xs"
              />
              <Lock className="size-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-0">
        <Link href={`/login?role=${selectedRole}`} className="w-full">
          <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium text-xs h-9 gap-1.5 shadow-xs">
            <Shield className="size-3.5" />
            <span>Launch Complete SSO Login</span>
            <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </Link>
        <div className="flex items-center justify-between w-full text-[11px] text-slate-500 pt-1">
          <span>Need an account?</span>
          <Link href="/register" className="font-semibold text-blue-700 hover:underline">
            Register profile →
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

