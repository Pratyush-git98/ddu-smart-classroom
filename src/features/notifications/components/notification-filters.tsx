"use client";

import { Button } from "@/components/ui/button";
import type { NotificationCategory, NotificationSeverity } from "@/types";
import { FILTERABLE_CATEGORIES, FILTERABLE_SEVERITIES, NOTIFICATION_CATEGORY_LABELS, NOTIFICATION_SEVERITY_LABELS } from "../lib/category-meta";

export interface NotificationFilterState {
  unreadOnly: boolean;
  category: NotificationCategory | "ALL";
  severity: NotificationSeverity | "ALL";
}

interface NotificationFiltersProps {
  value: NotificationFilterState;
  onChange: (next: NotificationFilterState) => void;
}

export function NotificationFilters({ value, onChange }: NotificationFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <FilterChip
          active={!value.unreadOnly}
          onClick={() => onChange({ ...value, unreadOnly: false })}
          label="All"
        />
        <FilterChip
          active={value.unreadOnly}
          onClick={() => onChange({ ...value, unreadOnly: true })}
          label="Unread"
        />
        {FILTERABLE_SEVERITIES.map((severity) => (
          <FilterChip
            key={severity}
            active={value.severity === severity}
            onClick={() =>
              onChange({
                ...value,
                severity: value.severity === severity ? "ALL" : severity,
              })
            }
            label={NOTIFICATION_SEVERITY_LABELS[severity]}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        <FilterChip
          active={value.category === "ALL"}
          onClick={() => onChange({ ...value, category: "ALL" })}
          label="All categories"
        />
        {FILTERABLE_CATEGORIES.map((category) => (
          <FilterChip
            key={category}
            active={value.category === category}
            onClick={() =>
              onChange({
                ...value,
                category: value.category === category ? "ALL" : category,
              })
            }
            label={NOTIFICATION_CATEGORY_LABELS[category]}
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "outline"}
      className={`h-7 px-2.5 text-[11px] ${active ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-white text-slate-600"}`}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
