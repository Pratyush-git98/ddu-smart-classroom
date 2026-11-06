"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthSessionStatus, User, UserRole } from "@/types";
import type { LoginInput } from "@/schemas/auth";
import { getAuthService } from "../services/auth-client";
import type { AuthResult, AuthSessionSnapshot } from "../services/auth-service.interface";

const SESSION_POLL_MS = 15_000;

export interface AuthContextValue {
  user: User | null;
  status: AuthSessionStatus;
  issuedAt: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  isSessionExpired: boolean;
  login: (credentials: LoginInput) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function snapshotToStatus(snapshot: AuthSessionSnapshot): AuthSessionStatus {
  if (snapshot.isExpired && snapshot.user) return "expired";
  if (snapshot.user) return "authenticated";
  return "unauthenticated";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthSessionStatus>("loading");
  const [issuedAt, setIssuedAt] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const refreshLock = useRef(false);

  const applySnapshot = useCallback((snapshot: AuthSessionSnapshot, nextStatus?: AuthSessionStatus) => {
    setUser(snapshot.user);
    setIssuedAt(snapshot.issuedAt);
    setExpiresAt(snapshot.expiresAt);
    setStatus(nextStatus ?? snapshotToStatus(snapshot));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      try {
        const snapshot = await getAuthService().getSession();
        if (cancelled) return;
        applySnapshot(snapshot);
      } catch {
        if (cancelled) return;
        applySnapshot({ user: null, issuedAt: null, expiresAt: null, isExpired: false });
      }
    };

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [applySnapshot]);

  useEffect(() => {
    if (status !== "authenticated" || !expiresAt) return;

    const id = window.setInterval(() => {
      if (Date.parse(expiresAt) <= Date.now()) {
        setStatus("expired");
      }
    }, SESSION_POLL_MS);

    return () => window.clearInterval(id);
  }, [status, expiresAt]);

  const login = useCallback(
    async (credentials: LoginInput): Promise<AuthResult> => {
      const result = await getAuthService().login(credentials);
      if (result.success && result.session) {
        applySnapshot(result.session, "authenticated");
      } else if (result.success && result.user) {
        applySnapshot(
          {
            user: result.user,
            issuedAt: new Date().toISOString(),
            expiresAt: null,
            isExpired: false,
          },
          "authenticated"
        );
      }
      return result;
    },
    [applySnapshot]
  );

  const logout = useCallback(async () => {
    await getAuthService().logout();
    queryClient.clear();
    applySnapshot({ user: null, issuedAt: null, expiresAt: null, isExpired: false }, "unauthenticated");
  }, [applySnapshot, queryClient]);

  const refreshSession = useCallback(async () => {
    if (refreshLock.current) return status === "authenticated";
    refreshLock.current = true;
    setStatus((prev) => (prev === "authenticated" ? "refreshing" : prev));

    try {
      const snapshot = await getAuthService().refreshSession();
      applySnapshot(snapshot);
      return Boolean(snapshot.user) && !snapshot.isExpired;
    } catch {
      setStatus("expired");
      return false;
    } finally {
      refreshLock.current = false;
    }
  }, [applySnapshot, status]);

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) return false;
      if (user.role === "SUPER_ADMIN" && roles.includes("ADMIN")) return true;
      return roles.includes(user.role);
    },
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      issuedAt,
      expiresAt,
      isAuthenticated: status === "authenticated" || status === "refreshing",
      isLoading: status === "loading",
      isRefreshing: status === "refreshing",
      isSessionExpired: status === "expired",
      login,
      logout,
      refreshSession,
      hasRole,
    }),
    [user, status, issuedAt, expiresAt, login, logout, refreshSession, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
