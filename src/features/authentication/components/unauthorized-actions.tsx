"use client";

import Link from "next/link";
import { ArrowLeft, LayoutDashboard, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/use-auth";
import { getDashboardPathForUser } from "../config/role-routes";

export function UnauthorizedActions() {
  const { user, isAuthenticated } = useAuth();
  const dashboardHref = user ? getDashboardPathForUser(user) : "/";

  return (
    <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
      {isAuthenticated && user ? (
        <Link href={dashboardHref} className="flex-1">
          <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs h-9 gap-1.5 shadow-xs">
            <LayoutDashboard className="size-3.5" />
            <span>Return to {user.role.toLowerCase()} dashboard</span>
          </Button>
        </Link>
      ) : (
        <Link href="/login" className="flex-1">
          <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs h-9 gap-1.5 shadow-xs">
            <LogIn className="size-3.5" />
            <span>Sign In with Different ID</span>
          </Button>
        </Link>
      )}

      <Link href="/" className="flex-1">
        <Button variant="outline" className="w-full text-xs h-9 gap-1.5 border-slate-300">
          <ArrowLeft className="size-3.5" />
          <span>Return to Campus Home</span>
        </Button>
      </Link>
    </div>
  );
}
