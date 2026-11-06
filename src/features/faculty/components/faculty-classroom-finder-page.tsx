"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClassroomFinder } from "@/features/classrooms";
import type { Classroom } from "@/types";
import type { FacultyClassroomHint } from "../types";
import { BookingFormDialog } from "./booking-dialogs";

function toHint(classroom: Classroom): FacultyClassroomHint {
  return {
    id: classroom.id,
    roomCode: classroom.roomNumber,
    name: classroom.name,
    building: classroom.block,
    floor: classroom.floor,
    campusId: classroom.campusId,
    status: classroom.status,
    capacity: classroom.capacity,
  };
}

export function FacultyClassroomFinderPage() {
  const [selected, setSelected] = useState<FacultyClassroomHint | null>(null);

  return (
    <>
      <ClassroomFinder
        renderRequestAction={(classroom) => (
          <Button
            type="button"
            size="sm"
            className="h-8 bg-indigo-700 text-white hover:bg-indigo-800"
            onClick={() => setSelected(toHint(classroom))}
          >
            Request this room
          </Button>
        )}
      />
      <BookingFormDialog
        open={Boolean(selected)}
        presetRoom={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </>
  );
}
