"use client";

import type { ReactNode } from "react";
import { QueryEmptyState, QueryErrorState, QueryLoadingState } from "@/components/query/query-state";

export function FacultyLoadingState({ label = "Loading faculty workspace..." }: { label?: string }) {
  return <QueryLoadingState label={label} accentClassName="text-indigo-600" />;
}

export function FacultyErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <QueryErrorState
      title="Unable to load faculty data"
      message={message ?? "The faculty academic service could not be reached."}
      onRetry={onRetry}
      actionClassName="bg-indigo-700 text-white hover:bg-indigo-800"
    />
  );
}

export function FacultyEmptyState({
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
