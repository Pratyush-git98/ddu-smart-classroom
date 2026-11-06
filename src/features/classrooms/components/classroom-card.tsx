import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CampusBadge } from "@/components/common/campus-badge";
import { RoomStatusBadge } from "@/components/common/status-badge";
import { Users, Tv, Projector, Mic, Video, Wind, Radio, ExternalLink } from "lucide-react";
import type { Classroom } from "@/types";

interface ClassroomCardProps {
  classroom: Classroom;
  onViewDetails?: (classroom: Classroom) => void;
  className?: string;
}

export function ClassroomCard({ classroom, onViewDetails, className }: ClassroomCardProps) {
  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case "SMART_BOARD":
        return <Tv className="size-3 text-blue-600" />;
      case "LASER_PROJECTOR":
        return <Projector className="size-3 text-indigo-600" />;
      case "MIC_AUDIO":
        return <Mic className="size-3 text-emerald-600" />;
      case "LECTURE_CAPTURE":
        return <Video className="size-3 text-purple-600" />;
      case "IOT_HVAC":
        return <Wind className="size-3 text-cyan-600" />;
      default:
        return <Radio className="size-3 text-slate-500" />;
    }
  };

  return (
    <Card
      className={`border-slate-200/90 bg-white shadow-xs transition-all hover:shadow-md hover:border-blue-200 ${
        className ?? ""
      }`}
    >
      <CardHeader className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold tracking-tight text-slate-900">
                {classroom.roomNumber}
              </span>
              <CampusBadge campusId={classroom.campusId} size="sm" />
            </div>
            <CardTitle className="text-sm font-semibold text-slate-800 line-clamp-1">
              {classroom.name}
            </CardTitle>
            <p className="text-xs text-slate-500">{classroom.block} • Floor {classroom.floor}</p>
          </div>
          <RoomStatusBadge status={classroom.status} />
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3">
        {/* Capacity & Occupancy stat */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5 text-slate-500" />
            <span>Capacity: <strong className="text-slate-900">{classroom.capacity}</strong> seats</span>
          </div>
          {classroom.status === "OCCUPIED" && classroom.currentOccupancy && (
            <span className="text-[11px] font-medium text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
              {classroom.currentOccupancy} Present ({Math.round((classroom.currentOccupancy / classroom.capacity) * 100)}%)
            </span>
          )}
        </div>

        {/* Current Lecture Banner if in use */}
        {classroom.currentLecture && (
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-2.5 text-xs space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-blue-900 line-clamp-1">
                {classroom.currentLecture.subject}
              </span>
              <span className="text-[10px] text-blue-600 font-mono">
                Until {classroom.currentLecture.endTime}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 line-clamp-1">
              {classroom.currentLecture.facultyName} • {classroom.currentLecture.courseCode}
            </p>
          </div>
        )}

        {/* Smart Equipment Nodes */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
            Smart IoT Equipment ({classroom.equipment.length})
          </span>
          <div className="flex flex-wrap gap-1.5">
            {classroom.equipment.map((eq) => (
              <span
                key={eq.id}
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border ${
                  eq.isOnline
                    ? "bg-slate-50 border-slate-200 text-slate-700"
                    : "bg-rose-50 border-rose-200 text-rose-700"
                }`}
                title={eq.name}
              >
                {getEquipmentIcon(eq.type)}
                <span className="truncate max-w-[120px]">{eq.name.split(" ")[0]}</span>
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-slate-100">
        <span className="text-[11px] text-slate-400">
          {classroom.hasRecordingSetup ? "HD Recording Ready" : "Standard Setup"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails?.(classroom)}
          className="text-xs text-blue-700 hover:text-blue-800 hover:bg-blue-50 gap-1 h-7 px-2"
        >
          <span>View Telemetry</span>
          <ExternalLink className="size-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
