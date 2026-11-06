import { NextResponse } from "next/server";
import { classroomService } from "@/features/classrooms/services/mock/mock-classroom-adapter";
import { HTTP_CACHE } from "@/lib/query-cache-policy";

export const runtime = "nodejs";
export const revalidate = HTTP_CACHE.publicStaticSeconds;

export async function GET() {
  const data = await classroomService.listCatalog();
  return NextResponse.json({ data });
}
