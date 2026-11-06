"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { UserRole } from "@/types";
import { useAuth } from "../hooks/use-auth";
import { AuthLoadingScreen } from "./auth-loading-screen";
import { SessionExpiredPanel } from "./session-expired-panel";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

/**
 * Client route gate for role-specific layouts.
 *
 * This is not a security boundary. A determined client can still request
 * these routes. Every privileged operation must be authorized by the campus
 * backend or identity provider.
 */
export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, user, isLoading, isSessionExpired, hasRole } = useAuth();

  const allowed = Boolean(user && hasRole(...allowedRoles));

  useEffect(() => {
    if (isLoading || status === "refreshing") return;
    if (isSessionExpired) return;
    if (status === "unauthenticated" || !user) {
      const next = pathname ? `?from=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
      return;
    }
    if (!allowed) {
      router.replace("/unauthorized");
    }
  }, [allowed, isLoading, isSessionExpired, pathname, router, status, user]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isSessionExpired) {
    return <SessionExpiredPanel />;
  }

  if (status === "unauthenticated" || !user) {
    return <AuthLoadingScreen message="Redirecting to institutional sign in..." />;
  }

  if (!allowed) {
    return <AuthLoadingScreen message="Checking academic clearance..." />;
  }

  return <>{children}</>;
}
