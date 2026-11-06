import type { IssueCategory, IssueSeverity, IssueStatus } from "../types";
import type { UserRole } from "@/types";

export const ISSUE_STATUS_LABEL: Record<IssueStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const ISSUE_SEVERITY_LABEL: Record<IssueSeverity, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

export const ISSUE_CATEGORY_LABEL: Record<IssueCategory, string> = {
  EQUIPMENT: "Equipment",
  HVAC: "HVAC",
  FURNITURE: "Furniture",
  NETWORK: "Network",
  SAFETY: "Safety",
  OTHER: "Other",
};

export const ROLE_LABEL: Record<UserRole, string> = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super admin",
};

export const selectClassName =
  "h-8 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800";
