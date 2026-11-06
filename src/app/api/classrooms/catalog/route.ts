import { NextResponse } from "next/server";
import { classroomService } from "@/features/classrooms/services/mock/mock-classroom-adapter";
export const runtime = "nodejs";
export const revalidate = 600;

export async function GET() {
  const data = await classroomService.listCatalog();
  return NextResponse.json({ data });
}
