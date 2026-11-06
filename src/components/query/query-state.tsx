"use client";

import type { ReactNode } from "react";
import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common";

export function QueryLoadingState({
  label,
  accentClassName,
}: {
  label: string;
  accentClassName: string;
}) {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Loader2 className={`size-4 animate-spin ${accentClassName}`} />
        {label}
      </div>
      <div className="grid gap-3">
        <div className="h-24 animate-pulse rounded-xl bg-slate-200/70" />
        <div className="h-36 animate-pulse rounded-xl bg-slate-200/60" />
        <div className="h-28 animate-pulse rounded-xl bg-slate-200/50" />
      </div>
    </div>
  );
}

export function QueryErrorState({
  title,
  message,
  onRetry,
  actionClassName,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
  actionClassName: string;
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={message}
      action={
        onRetry ? (
          <Button type="button" size="sm" onClick={onRetry} className={actionClassName}>
            Try again
          </Button>
        ) : undefined
      }
    />
  );
}

export function QueryEmptyState({
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
