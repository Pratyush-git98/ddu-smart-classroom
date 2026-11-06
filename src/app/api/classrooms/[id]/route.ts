import { NextResponse } from "next/server";
import { classroomService } from "@/features/classrooms/services/mock/mock-classroom-adapter";
export const runtime = "nodejs";
export const revalidate = 600;

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  void request;
  const { id } = await context.params;
  const data = await classroomService.getById(id);
  if (!data) {
    return NextResponse.json({ data: null, message: "Classroom not found." }, { status: 404 });
  }
  return NextResponse.json({ data });
}
