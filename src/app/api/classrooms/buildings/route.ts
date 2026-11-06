import { NextResponse } from "next/server";
import { classroomService } from "@/features/classrooms/services/mock/mock-classroom-adapter";
import { HTTP_CACHE } from "@/lib/query-cache-policy";
import type { ClassroomSearchFilters } from "@/types";

export const runtime = "nodejs";
export const revalidate = HTTP_CACHE.publicStaticSeconds;

export async function GET(request: Request) {
  const campusId = (new URL(request.url).searchParams.get("campusId") ?? "ALL") as ClassroomSearchFilters["campusId"];
  const data = await classroomService.listBuildings(campusId);
  return NextResponse.json({ data });
}
