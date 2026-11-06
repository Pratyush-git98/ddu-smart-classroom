import { NextResponse } from "next/server";
import { classroomService } from "@/features/classrooms/services/mock/mock-classroom-adapter";
import type { ClassroomAvailabilityQuery } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  const query = (await request.json()) as ClassroomAvailabilityQuery;
  const confirm = new URL(request.url).searchParams.get("confirm") === "1";
  const data = confirm
    ? await classroomService.confirmAvailability(query)
    : await classroomService.getAvailability(query);
  return NextResponse.json(data);
}
