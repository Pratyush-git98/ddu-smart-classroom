"use client";

import { Loader2 } from "lucide-react";

export function AuthLoadingScreen({
  message = "Restoring institutional session...",
}: {
  message?: string;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-8">
      <Loader2 className="size-8 animate-spin text-blue-600" aria-hidden="true" />
      <p className="text-xs text-slate-500">{message}</p>
    </div>
  );
}
