import { NextResponse } from "next/server";
import { academicBookingService } from "@/features/bookings/services/mock/mock-booking-adapter";
import { actorFromRequest } from "@/features/bookings/services/parse-actor";

export const runtime = "nodejs";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = actorFromRequest(request);
  if (!actor) {
    return NextResponse.json(
      {
        success: false,
        conflict: false,
        pendingBackendValidation: true,
        message: "Sign in is required to cancel a booking.",
        alternatives: [],
      },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const result = await academicBookingService.cancelBooking(id, actor);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}
