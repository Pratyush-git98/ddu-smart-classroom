"use client";

import type { ReactNode } from "react";
import { QueryEmptyState, QueryErrorState, QueryLoadingState } from "@/components/query/query-state";

export function DashboardLoadingState({ label = "Loading your academic workspace..." }: { label?: string }) {
  return <QueryLoadingState label={label} accentClassName="text-blue-600" />;
}

export function DashboardErrorState({
  message = "Could not load this student workspace from the academic service.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <QueryErrorState
      title="Unable to load student data"
      message={message}
      onRetry={onRetry}
      actionClassName="bg-blue-700 text-white hover:bg-blue-800"
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
  return <QueryEmptyState title={title} description={description} action={action} />;
}
