"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { getDashboardPathForUser } from "../config/role-routes";
import { AuthLoadingScreen } from "./auth-loading-screen";
import { SessionExpiredPanel } from "./session-expired-panel";

function subscribeNoop() {
  return () => {};
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const { isLoading, isAuthenticated, isSessionExpired, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(getDashboardPathForUser(user));
    }
  }, [isAuthenticated, router, user]);

  if (!mounted || isLoading) {
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
