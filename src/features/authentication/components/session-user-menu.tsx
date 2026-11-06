"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, LogIn, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { USER_ROLES } from "@/lib/design-tokens";
import { useAuth } from "../hooks/use-auth";
import { getDashboardPathForUser } from "../config/role-routes";

export function SessionUserMenu() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    isRefreshing,
    isSessionExpired,
    logout,
    refreshSession,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
        <Loader2 className="size-4 animate-spin text-slate-400" aria-label="Loading session" />
      </div>
    );
  }

  if (isSessionExpired) {
    return (
      <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
        <Badge variant="outline" className="border-amber-200 bg-amber-50 text-[10px] text-amber-800">
          Session expired
        </Badge>
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3 text-xs"
          onClick={() => void refreshSession()}
          disabled={isRefreshing}
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
        <Link href="/login">
          <Button
            size="sm"
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs h-8 px-3 gap-1.5 shadow-xs"
          >
            <LogIn className="size-3.5" />
            <span>Portal Sign In</span>
          </Button>
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
      {isRefreshing && (
        <span className="hidden sm:inline text-[10px] font-medium text-blue-700">Refreshing…</span>
      )}
      <Link href={getDashboardPathForUser(user)} className="hidden sm:flex flex-col items-end leading-tight">
        <span className="text-xs font-semibold text-slate-900">{user.displayName}</span>
        <span className="text-[10px] text-slate-500">{USER_ROLES[user.role].label}</span>
      </Link>
      <Button
        size="sm"
        variant="outline"
        className="h-8 px-3 text-xs gap-1.5"
        onClick={() => void handleLogout()}
      >
        <LogOut className="size-3.5" />
        <span>Sign out</span>
      </Button>
    </div>
  );
}
