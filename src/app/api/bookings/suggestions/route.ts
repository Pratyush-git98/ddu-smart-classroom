import { NextResponse } from "next/server";
import { academicBookingService } from "@/features/bookings/services/mock/mock-booking-adapter";
import { actorFromRequest } from "@/features/bookings/services/parse-actor";
import type { AlternativeSuggestionQuery } from "@/features/bookings/services/booking-service.interface";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  const actor = actorFromRequest(request);
  if (!actor) {
    return NextResponse.json({ message: "Sign in is required." }, { status: 401 });
  }

  const query = (await request.json()) as AlternativeSuggestionQuery;
  const data = await academicBookingService.suggestAlternatives(query, actor);
  return NextResponse.json({ data });
}
