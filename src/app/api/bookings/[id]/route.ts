import { NextResponse } from "next/server";
import { academicBookingService } from "@/features/bookings/services/mock/mock-booking-adapter";
import { actorFromRequest } from "@/features/bookings/services/parse-actor";
import type { FacultyBookingDraft } from "@/features/faculty/types";

export const runtime = "nodejs";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = actorFromRequest(request);
  if (!actor) {
    return NextResponse.json({ access: "forbidden", booking: null, message: "Sign in is required." }, { status: 401 });
  }

  const { id } = await context.params;
  const result = await academicBookingService.getBookingById(id, actor);
  const status = result.access === "ok" ? 200 : result.access === "forbidden" ? 403 : 404;
  return NextResponse.json(result, { status });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = actorFromRequest(request);
  if (!actor) {
    return NextResponse.json(
      {
        success: false,
        conflict: false,
        pendingBackendValidation: true,
        message: "Sign in is required to update a booking.",
        alternatives: [],
      },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const draft = (await request.json()) as FacultyBookingDraft;
  const result = await academicBookingService.updateBooking(id, draft, actor);
  const status = result.success ? 200 : result.conflict ? 409 : 400;
  return NextResponse.json(result, { status });
}
