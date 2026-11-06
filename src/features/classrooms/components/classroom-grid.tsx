"use client";

import React, { useState, useMemo } from "react";
import { ClassroomCard } from "./classroom-card";
import { ClassroomFilterBar } from "./classroom-filter-bar";
import { EmptyState } from "@/components/common/empty-state";
import { useActiveCampus } from "@/providers/app-provider";
import { SearchX } from "lucide-react";
import type { Classroom, RoomStatus } from "@/types";

interface ClassroomGridProps {
  initialClassrooms: Classroom[];
  className?: string;
}

export function ClassroomGrid({ initialClassrooms, className }: ClassroomGridProps) {
  const { activeCampus, setActiveCampus } = useActiveCampus();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | "ALL">("ALL");

  const filteredClassrooms = useMemo(() => {
    return initialClassrooms.filter((room) => {
      // Campus filter
      if (activeCampus !== "ALL" && room.campusId !== activeCampus) {
        return false;
      }
      // Status filter
      if (selectedStatus !== "ALL" && room.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNumber = room.roomNumber.toLowerCase().includes(q);
        const matchesName = room.name.toLowerCase().includes(q);
        const matchesBlock = room.block.toLowerCase().includes(q);
        const matchesFaculty = room.currentLecture?.facultyName.toLowerCase().includes(q);
        if (!matchesNumber && !matchesName && !matchesBlock && !matchesFaculty) {
          return false;
        }
      }
      return true;
    });
  }, [initialClassrooms, activeCampus, selectedStatus, searchQuery]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedStatus("ALL");
    setActiveCampus("ALL");
  };

  return (
    <div className={`space-y-4 ${className ?? ""}`}>
      <ClassroomFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCampus={activeCampus}
        onCampusChange={setActiveCampus}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onReset={handleReset}
      />

      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filteredClassrooms.length}</strong> smart classrooms
          {activeCampus !== "ALL" && ` in ${activeCampus === "IET" ? "IET Engineering" : "Deeksha Bhawan"}`}
        </span>
        <span className="text-[11px] font-medium text-blue-700">Live IoT status synchronized</span>
      </div>

      {filteredClassrooms.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No classrooms match your query"
          description="Try clearing your filters or searching for another room number or facility."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClassrooms.map((room) => (
            <ClassroomCard key={room.id} classroom={room} />
          ))}
        </div>
      )}
    </div>
  );
}
