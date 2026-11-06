"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import type { CampusLocationId, RoomStatus } from "@/types";

interface ClassroomFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCampus: CampusLocationId | "ALL";
  onCampusChange: (campus: CampusLocationId | "ALL") => void;
  selectedStatus: RoomStatus | "ALL";
  onStatusChange: (status: RoomStatus | "ALL") => void;
  onReset: () => void;
}

export function ClassroomFilterBar({
  searchQuery,
  onSearchChange,
  selectedCampus,
  onCampusChange,
  selectedStatus,
  onStatusChange,
  onReset,
}: ClassroomFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="size-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by room (e.g., CR-101, DB-LT1, CSE, Lab)..."
          className="pl-8 text-xs h-8 border-slate-200 bg-slate-50/50"
        />
      </div>

      {/* Filter Badges / Campus Toggles */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">Campus:</span>
        <button
          type="button"
          onClick={() => onCampusChange("ALL")}
          className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-all ${
            selectedCampus === "ALL"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => onCampusChange("IET")}
          className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-all ${
            selectedCampus === "IET"
              ? "bg-blue-700 text-white border-blue-700"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          IET Campus
        </button>
        <button
          type="button"
          onClick={() => onCampusChange("DEEKSHA_BHAWAN")}
          className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-all ${
            selectedCampus === "DEEKSHA_BHAWAN"
              ? "bg-indigo-700 text-white border-indigo-700"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          Deeksha Bhawan
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-1.5 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-3">
        <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">Status:</span>
        {(["ALL", "AVAILABLE", "OCCUPIED"] as const).map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => onStatusChange(st)}
            className={`rounded-md px-2 py-0.5 text-xs font-medium transition-all ${
              selectedStatus === st
                ? "bg-slate-200 text-slate-900 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {st === "ALL" ? "Any" : st === "AVAILABLE" ? "Available" : "In Session"}
          </button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-slate-400 hover:text-slate-700 size-7 p-0 ml-1"
          title="Reset filters"
        >
          <RotateCcw className="size-3" />
        </Button>
      </div>
    </div>
  );
}
