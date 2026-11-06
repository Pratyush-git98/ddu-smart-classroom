"use client";

import type { ReactNode } from "react";
import { QueryEmptyState, QueryErrorState, QueryLoadingState } from "@/components/query/query-state";

export function AdminLoadingState({ label = "Loading admin workspace..." }: { label?: string }) {
  return <QueryLoadingState label={label} accentClassName="text-violet-600" />;
}

export function AdminErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <QueryErrorState
      title="Unable to load admin data"
      message={message ?? "The campus administration service could not be reached."}
      onRetry={onRetry}
      actionClassName="bg-violet-700 text-white hover:bg-violet-800"
    />
  );
}

export function AdminEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return <QueryEmptyState title={title} description={description} action={action} />;
}
