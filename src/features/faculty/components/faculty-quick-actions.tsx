"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tv, Mic, Wind, Power } from "lucide-react";

export function FacultyQuickActions() {
  const [projectorOn, setProjectorOn] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [acTemp, setAcTemp] = useState(23);

  return (
    <Card className="border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Power className="size-4 text-emerald-600" />
            <span>Smart Classroom IoT Console (CR-101)</span>
          </CardTitle>
          <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
            Node Online
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setProjectorOn(!projectorOn)}
          className={`flex flex-col h-auto py-2.5 px-2 text-center border ${
            projectorOn ? "border-blue-300 bg-blue-50/70 text-blue-800" : "text-slate-600"
          }`}
        >
          <Tv className="size-4 mb-1 text-blue-600" />
          <span className="text-[11px] font-semibold">Laser Screen</span>
          <span className="text-[10px] text-slate-500">{projectorOn ? "Active (HDMI 1)" : "Standby"}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setMicActive(!micActive)}
          className={`flex flex-col h-auto py-2.5 px-2 text-center border ${
            micActive ? "border-emerald-300 bg-emerald-50/70 text-emerald-800" : "text-slate-600"
          }`}
        >
          <Mic className="size-4 mb-1 text-emerald-600" />
          <span className="text-[11px] font-semibold">Stage Audio</span>
          <span className="text-[10px] text-slate-500">{micActive ? "Mic Unmuted" : "Muted"}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setAcTemp(acTemp === 23 ? 21 : 23)}
          className="flex flex-col h-auto py-2.5 px-2 text-center border border-cyan-200 bg-cyan-50/40 text-cyan-900"
        >
          <Wind className="size-4 mb-1 text-cyan-600" />
          <span className="text-[11px] font-semibold">Climate AC</span>
          <span className="text-[10px] text-cyan-700 font-medium">{acTemp}°C Set</span>
        </Button>
      </CardContent>
    </Card>
  );
}
