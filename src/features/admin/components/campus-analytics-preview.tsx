import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Building2, Landmark } from "lucide-react";

export function CampusAnalyticsPreview() {
  return (
    <Card className="border-slate-200 shadow-xs bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="size-4 text-blue-600" />
            <span>Campus Classroom Utilization (Live Telemetry)</span>
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time space occupancy ratio across university academic zones
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
          Overall Campus Load: 68%
        </Badge>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* IET Campus Metrics */}
        <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-blue-100 text-blue-800">
                <Building2 className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">IET Engineering Complex</h4>
                <p className="text-[10px] text-slate-500">Blocks A, B, C & CCF Labs</p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-blue-700">74%</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: "74%" }} />
          </div>

          <div className="flex justify-between text-[11px] text-slate-600">
            <span>31 of 42 In Session</span>
            <span>9 Available</span>
            <span>2 Maintenance</span>
          </div>
        </div>

        {/* Deeksha Bhawan Metrics */}
        <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-indigo-100 text-indigo-800">
                <Landmark className="size-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Deeksha Bhawan Complex</h4>
                <p className="text-[10px] text-slate-500">Lecture Theatres LT-1 to LT-6 & Auditorium</p>
              </div>
            </div>
            <span className="text-sm font-extrabold text-indigo-700">61%</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "61%" }} />
          </div>

          <div className="flex justify-between text-[11px] text-slate-600">
            <span>17 of 28 In Session</span>
            <span>10 Available</span>
            <span>1 Maintenance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
