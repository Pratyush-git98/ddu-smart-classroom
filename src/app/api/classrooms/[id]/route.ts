import { NextResponse } from "next/server";
import { classroomService } from "@/features/classrooms/services/mock/mock-classroom-adapter";
import { HTTP_CACHE } from "@/lib/query-cache-policy";

export const runtime = "nodejs";
export const revalidate = HTTP_CACHE.publicStaticSeconds;

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await classroomService.getById(id);
  if (!data) {
    return NextResponse.json({ data: null, message: "Classroom not found." }, { status: 404 });
  }
  return NextResponse.json({ data });
}
