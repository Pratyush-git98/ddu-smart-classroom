import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  heading: string;
  subheading?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  heading,
  subheading,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {heading}
          </h1>
          {badge}
        </div>
        {subheading && (
          <p className="text-sm text-slate-500 max-w-2xl">{subheading}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}

