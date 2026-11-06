import { NextResponse } from "next/server";
import { classroomService } from "@/features/classrooms/services/mock/mock-classroom-adapter";
import type { ClassroomSearchFilters } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  const filters = (await request.json()) as ClassroomSearchFilters;
  const data = await classroomService.search(filters);
  return NextResponse.json(data);
}
