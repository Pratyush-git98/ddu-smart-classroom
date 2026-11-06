import React from "react";
import { Badge } from "@/components/ui/badge";
import { CAMPUS_FACILITIES, type CampusId } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { Building2, Landmark } from "lucide-react";

interface CampusBadgeProps {
  campusId: CampusId;
  showIcon?: boolean;
  className?: string;
  size?: "sm" | "default";
}

export function CampusBadge({
  campusId,
  showIcon = true,
  className,
  size = "default",
}: CampusBadgeProps) {
  const facility = CAMPUS_FACILITIES[campusId];
  if (!facility) return null;

  const isIet = campusId === "IET";

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold tracking-wide border transition-colors",
        facility.badgeClass,
        size === "sm" ? "text-[11px] px-1.5 py-0" : "text-xs px-2.5 py-0.5",
        className
      )}
    >
      {showIcon &&
        (isIet ? (
          <Building2 className="size-3 mr-1 shrink-0 text-blue-600 dark:text-blue-400" />
        ) : (
          <Landmark className="size-3 mr-1 shrink-0 text-indigo-600 dark:text-indigo-400" />
        ))}
      <span>{facility.shortCode}</span>
      <span className="hidden sm:inline font-normal opacity-75 ml-1">
        • {isIet ? "IET Campus" : "Deeksha Bhawan"}
      </span>
    </Badge>
  );
}

