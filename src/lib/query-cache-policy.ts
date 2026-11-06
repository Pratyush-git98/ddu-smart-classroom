/**
 * Client (TanStack Query) and server (Next.js fetch / route) cache policy.
 *
 * Auth secrets and session tokens are never written to QueryClient or localStorage.
 * Identity for mock development lives in memory (see mock-session-store).
 */
export const QUERY_CACHE = {
  /** Default for mixed dashboard payloads. */
  defaultStaleTimeMs: 60_000,
  defaultGcTimeMs: 5 * 60_000,
  defaultRetry: 1,

  /** Room names, facilities, buildings — rarely edited mid-day. */
  classroomMetadata: {
    staleTimeMs: 10 * 60_000,
    gcTimeMs: 30 * 60_000,
  },

  /** Search mixes catalog with provisional occupancy. */
  classroomSearch: {
    staleTimeMs: 15_000,
    gcTimeMs: 5 * 60_000,
  },

  /** Live slot maps change with bookings and timetable edits. */
  availability: {
    staleTimeMs: 15_000,
    gcTimeMs: 2 * 60_000,
  },

  /** Teaching grids change less often than occupancy, more often than room metadata. */
  timetable: {
    staleTimeMs: 2 * 60_000,
    gcTimeMs: 15 * 60_000,
  },

  /** Requisitions and approvals must not look confirmed after a mutation. */
  bookings: {
    staleTimeMs: 20_000,
    gcTimeMs: 5 * 60_000,
  },

  notifications: {
    staleTimeMs: 20_000,
    gcTimeMs: 5 * 60_000,
  },

  /** Directory / SIS-style profile fields. Never includes credentials. */
  profiles: {
    staleTimeMs: 10 * 60_000,
    gcTimeMs: 30 * 60_000,
  },
} as const;

/** Next.js Data Cache / Full Route Cache. Only applies to server-side fetch and cached GET routes. */
export const HTTP_CACHE = {
  /** Public facility catalog and building lists. */
  publicStaticSeconds: 600,
  /** Sensitive or rapidly changing resources must skip the Data Cache. */
  noStore: "no-store" as const,
};
