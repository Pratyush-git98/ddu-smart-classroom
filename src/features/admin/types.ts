import type { CampusLocationId } from "@/types";

export interface CampusAuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  campusId: CampusLocationId;
  targetRoom: string;
  timestamp: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

export interface CampusUtilizationMetric {
  campusId: CampusLocationId;
  campusName: string;
  totalRooms: number;
  inUse: number;
  available: number;
  utilizationRate: number;
}

