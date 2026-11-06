"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClassroomFinder } from "@/features/classrooms";

export function FacultyClassroomFinderPage() {
  return (
    <ClassroomFinder
      renderRequestAction={(classroom) => (
        <Button
          type="button"
          size="sm"
          className="h-8 bg-indigo-700 text-white hover:bg-indigo-800"
          render={<Link href={`/faculty/bookings/new?classroomId=${classroom.id}`} />}
        >
          Request this room
        </Button>
      )}
    />
  );
}
