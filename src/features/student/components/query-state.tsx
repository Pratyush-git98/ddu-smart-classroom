"use client";

import type { ReactNode } from "react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common";

export function DashboardLoadingState({ label = "Loading your academic workspace..." }: { label?: string }) {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Loader2 className="size-4 animate-spin text-blue-600" />
        {label}
      </div>
      <div className="grid gap-3">
        <div className="h-28 animate-pulse rounded-xl bg-slate-200/70" />
        <div className="h-40 animate-pulse rounded-xl bg-slate-200/60" />
        <div className="h-32 animate-pulse rounded-xl bg-slate-200/50" />
      </div>
    </div>
  );
}

export function DashboardErrorState({
  message = "Could not load this student workspace from the academic service.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Unable to load student data"
      description={message}
      action={
        onRetry ? (
          <Button type="button" size="sm" onClick={onRetry} className="bg-blue-700 text-white hover:bg-blue-800">
            Try again
          </Button>
        ) : undefined
      }
    />
  );
}

export function DashboardEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return <EmptyState icon={Inbox} title={title} description={description} action={action} />;
}
