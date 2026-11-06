import type { UserRole } from "@/types";
import type { BookingActor } from "./booking-service.interface";

const ROLES: UserRole[] = ["STUDENT", "FACULTY", "ADMIN", "SUPER_ADMIN"];

export function actorFromRequest(request: Request): BookingActor | null {
  const id = request.headers.get("X-DDU-Actor-Id")?.trim();
  const role = request.headers.get("X-DDU-Actor-Role")?.trim() as UserRole | undefined;
  const displayName = request.headers.get("X-DDU-Actor-Name")?.trim() || undefined;
  if (!id || !role || !ROLES.includes(role)) return null;
  return { id, role, displayName };
}
