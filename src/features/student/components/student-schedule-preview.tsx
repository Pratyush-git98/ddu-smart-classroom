import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CampusBadge } from "@/components/common/campus-badge";
import { Clock, MapPin, BookOpen } from "lucide-react";
import type { StudentScheduleLecture } from "../types";

const MOCK_STUDENT_SCHEDULE: StudentScheduleLecture[] = [
  {
    id: "lec-1",
    subjectCode: "KCS-501",
    subjectName: "Operating Systems",
    facultyName: "Dr. Arvind Tripathi",
    timeSlot: "10:00 AM - 11:00 AM",
    roomNumber: "CR-101",
    campusId: "IET",
    block: "Block A (CSE)",
    isCurrent: true,
    attendanceVerified: true,
  },
  {
    id: "lec-2",
    subjectCode: "KCS-502",
    subjectName: "Compiler Design",
    facultyName: "Er. Pratibha Singh",
    timeSlot: "11:00 AM - 12:00 PM",
    roomNumber: "CR-101",
    campusId: "IET",
    block: "Block A (CSE)",
    isCurrent: false,
    attendanceVerified: false,
  },
  {
    id: "lec-3",
    subjectCode: "MBA-102",
    subjectName: "Open Elective: Managerial Economics",
    facultyName: "Prof. Sudhir Srivastava",
    timeSlot: "02:00 PM - 03:00 PM",
    roomNumber: "DB-LT1",
    campusId: "DEEKSHA_BHAWAN",
    block: "Ground Floor East",
    isCurrent: false,
    attendanceVerified: false,
  },
];

export function StudentSchedulePreview() {
  return (
    <Card className="border-slate-200 shadow-xs bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="size-4 text-blue-600" />
            <span>Student Daily Schedule & Classroom Locator</span>
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            B.Tech Computer Science & Engineering • 5th Semester (Section A)
          </p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          Attendance: 91%
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        {MOCK_STUDENT_SCHEDULE.map((lecture) => (
          <div
            key={lecture.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border transition-all ${
              lecture.isCurrent
                ? "border-blue-300 bg-blue-50/50 ring-1 ring-blue-300/60"
                : "border-slate-200/90 bg-white hover:bg-slate-50/70"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700">
                  {lecture.subjectCode}
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  {lecture.subjectName}
                </span>
                {lecture.isCurrent && (
                  <Badge className="bg-blue-600 text-white text-[10px] h-4 px-1.5 animate-pulse">
                    LIVE NOW
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Faculty: {lecture.facultyName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {lecture.timeSlot}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center">
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <MapPin className="size-3.5 text-slate-400" />
                  <span className="font-bold text-xs text-slate-800">
                    {lecture.roomNumber}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">{lecture.block}</span>
              </div>
              <CampusBadge campusId={lecture.campusId} size="sm" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
