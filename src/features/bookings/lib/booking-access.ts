import type { User, UserRole } from "@/types";
import type { FacultyBooking } from "@/features/faculty/types";
import { canCancelBooking as isCancellableStatus, canEditBooking as isEditableStatus } from "@/features/faculty/lib/faculty-time";

export function isPrivilegedBookingActor(role: UserRole | undefined): boolean {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function ownsBooking(booking: FacultyBooking, actorId: string | undefined): boolean {
  return Boolean(actorId) && booking.facultyId === actorId;
}

export function canViewBooking(booking: FacultyBooking, actorId: string | undefined, role: UserRole | undefined): boolean {
  if (!actorId || !role) return false;
  if (isPrivilegedBookingActor(role)) return true;
  if (ownsBooking(booking, actorId)) return true;
  return role === "FACULTY";
}

export function canEditOwnedBooking(
  booking: FacultyBooking,
  actorId: string | undefined,
  role: UserRole | undefined,
  now = new Date()
): boolean {
  if (!canViewBooking(booking, actorId, role)) return false;
  if (!isPrivilegedBookingActor(role) && !ownsBooking(booking, actorId)) return false;
  return isEditableStatus(booking, now) || booking.status === "CONFLICT_DETECTED";
}

export function canCancelOwnedBooking(
  booking: FacultyBooking,
  actorId: string | undefined,
  role: UserRole | undefined,
  now = new Date()
): boolean {
  if (!canViewBooking(booking, actorId, role)) return false;
  if (!isPrivilegedBookingActor(role) && !ownsBooking(booking, actorId)) return false;
  if (booking.status === "CONFLICT_DETECTED") return true;
  return isCancellableStatus(booking, now);
}

export function actorFromUser(user: User | null): { id: string; role: UserRole } | null {
  if (!user) return null;
  return { id: user.id, role: user.role };
}
