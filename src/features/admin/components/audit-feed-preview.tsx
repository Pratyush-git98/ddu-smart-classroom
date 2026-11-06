import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CampusBadge } from "@/components/common/campus-badge";
import { FileText } from "lucide-react";
import type { CampusAuditLog } from "../types";

const MOCK_AUDIT_LOGS: CampusAuditLog[] = [
  {
    id: "log-1",
    actorName: "Dean Academics Office",
    actorRole: "Central Admin",
    action: "Approved allocation for Inter-University Symposium in Deeksha Bhawan Auditorium",
    campusId: "DEEKSHA_BHAWAN",
    targetRoom: "DB-AUD",
    timestamp: "12 minutes ago",
    severity: "INFO",
  },
  {
    id: "log-2",
    actorName: "Automated Clash Engine",
    actorRole: "System Bot",
    action: "Prevented duplicate slot allocation for KCS-502 in IET Block A (CR-101)",
    campusId: "IET",
    targetRoom: "CR-101",
    timestamp: "45 minutes ago",
    severity: "WARNING",
  },
  {
    id: "log-3",
    actorName: "Dr. Arvind Tripathi (HOD CSE)",
    actorRole: "Faculty Admin",
    action: "Configured Smart IoT Projector preset for Machine Learning Lab",
    campusId: "IET",
    targetRoom: "CR-102",
    timestamp: "1 hour ago",
    severity: "INFO",
  },
];

export function AuditFeedPreview() {
  return (
    <Card className="border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="size-4 text-blue-600" />
          <span>System Audit Log & Safety Records</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {MOCK_AUDIT_LOGS.map((log) => (
          <div
            key={log.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{log.actorName}</span>
                <span className="text-[10px] text-slate-400">({log.actorRole})</span>
              </div>
              <p className="text-slate-600">{log.action}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <CampusBadge campusId={log.campusId} size="sm" />
              <span className="text-[10px] text-slate-400">{log.timestamp}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
