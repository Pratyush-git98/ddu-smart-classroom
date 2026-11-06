"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, LogIn, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/use-auth";

export function SessionExpiredPanel() {
  const router = useRouter();
  const { user, refreshSession, logout, isRefreshing } = useAuth();

  const handleRefresh = async () => {
    const ok = await refreshSession();
    if (!ok) {
      router.replace("/login?reason=expired");
    }
  };

  const handleSignIn = async () => {
    await logout();
    router.replace("/login?reason=expired");
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center gap-5 p-6 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
        <Clock className="size-7" />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Session expired</h1>
        <p className="text-sm text-slate-600">
          {user
            ? `The campus session for ${user.displayName} is no longer valid. Refresh if the identity provider still recognizes you, or sign in again.`
            : "Your campus session has expired. Sign in again to continue."}
        </p>
        <p className="text-[11px] text-slate-500">
          Frontend session expiry is a convenience signal only. Backend APIs must reject expired
          credentials independently.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={isRefreshing}
          className="bg-blue-700 text-white hover:bg-blue-800"
        >
          <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh session
        </Button>
        <Button type="button" variant="outline" onClick={() => void handleSignIn()}>
          <LogIn className="size-3.5" />
          Sign in again
        </Button>
      </div>
      <Link href="/" className="text-xs font-medium text-blue-700 hover:underline">
        Return to campus home
      </Link>
    </div>
  );
}
