"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Video, Send } from "lucide-react";

export function FacultyRequisitionCard() {
  const [campus, setCampus] = useState<"IET" | "DEEKSHA_BHAWAN">("IET");
  const [room, setRoom] = useState("CR-101");
  const [purpose, setPurpose] = useState("Remedial Lecture & Lab Demonstration");
  const [date, setDate] = useState("2026-11-07");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="border-slate-200 shadow-xs bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            Faculty Requisition Hub
          </Badge>
          <span className="text-[11px] text-slate-400">Automatic Clash Checking</span>
        </div>
        <CardTitle className="text-base font-bold text-slate-900">
          Request Smart Classroom Allocation
        </CardTitle>
        <CardDescription className="text-xs text-slate-500">
          Instant booking requisition for extra classes, seminars, or makeup lectures
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3.5">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setCampus("IET");
              setRoom("CR-101");
            }}
            className={`p-2 rounded-lg border text-xs font-medium text-left transition-all ${
              campus === "IET"
                ? "border-blue-500 bg-blue-50/60 text-blue-900 ring-1 ring-blue-500"
                : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-50"
            }`}
          >
            IET Engineering Block
          </button>
          <button
            type="button"
            onClick={() => {
              setCampus("DEEKSHA_BHAWAN");
              setRoom("DB-LT1");
            }}
            className={`p-2 rounded-lg border text-xs font-medium text-left transition-all ${
              campus === "DEEKSHA_BHAWAN"
                ? "border-indigo-500 bg-indigo-50/60 text-indigo-900 ring-1 ring-indigo-500"
                : "border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Deeksha Bhawan Complex
          </button>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-700">Lecture Title / Purpose</label>
          <Input
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="text-xs h-8"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-medium text-slate-700">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-xs h-8"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700">Target Classroom</label>
            <Input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="text-xs h-8 uppercase font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-200">
          <div className="flex items-center gap-2">
            <Video className="size-4 text-blue-600" />
            <span className="text-xs font-medium text-slate-800">
              Enable Auto-Lecture Recording
            </span>
          </div>
          <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">PTZ Camera Ready</Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        <span className="text-[11px] text-slate-400">No conflict detected for chosen slot</span>
        <Button
          onClick={() => setSubmitted(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
        >
          <Send className="size-3.5 mr-1.5" />
          {submitted ? "Requisition Sent ✓" : "Submit Request"}
        </Button>
      </CardFooter>
    </Card>
  );
}
