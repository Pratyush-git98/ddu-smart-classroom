import { NextResponse } from "next/server";
import { academicBookingService } from "@/features/bookings/services/mock/mock-booking-adapter";
import { actorFromRequest } from "@/features/bookings/services/parse-actor";
import type { FacultyBookingDraft } from "@/features/faculty/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const actor = actorFromRequest(request);
  if (!actor) {
    return NextResponse.json({ message: "Sign in is required to list bookings." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const scopeParam = searchParams.get("scope");
  const scope = scopeParam === "history" || scopeParam === "all" ? scopeParam : "active";
  const data = await academicBookingService.listBookings(scope, actor);
  return NextResponse.json({ data, message: "Bookings loaded from the academic booking service." });
}

export async function POST(request: Request) {
  const actor = actorFromRequest(request);
  if (!actor) {
    return NextResponse.json(
      {
        success: false,
        conflict: false,
        pendingBackendValidation: true,
        message: "Sign in is required to create a booking.",
        alternatives: [],
      },
      { status: 401 }
    );
  }

  const draft = (await request.json()) as FacultyBookingDraft;
  const result = await academicBookingService.createBooking(draft, actor);
  return NextResponse.json(result, { status: result.success ? 201 : result.conflict ? 409 : 400 });
}
