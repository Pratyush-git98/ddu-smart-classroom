"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { getDashboardPathForUser } from "../config/role-routes";
import { AuthLoadingScreen } from "./auth-loading-screen";
import { SessionExpiredPanel } from "./session-expired-panel";

export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isSessionExpired, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getDashboardPathForUser(user));
    }
  }, [isAuthenticated, router, user]);

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isSessionExpired) {
    return <SessionExpiredPanel />;
  }

  if (isAuthenticated && user) {
    return <AuthLoadingScreen message="Opening your academic workspace..." />;
  }

  return <>{children}</>;
}
