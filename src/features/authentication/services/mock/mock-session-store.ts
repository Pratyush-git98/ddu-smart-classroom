import type { User } from "@/types";
import type { AuthSessionSnapshot } from "../auth-service.interface";
import { MOCK_SESSION_TTL_MS } from "./mock-users";

/**
 * In-memory + tab-scoped mock session.
 *
 * - Never writes passwords.
 * - Never writes access tokens.
 * - Never uses localStorage.
 *
 * sessionStorage holds only a non-secret identity envelope so page reloads
 * during frontend development restore the mock user. Replace this module
 * entirely when wiring campus SSO / httpOnly cookies.
 */
const SESSION_KEY = "ddu.scms.mock.identity.v1";

interface MockPersistedIdentity {
  user: User;
  issuedAt: string;
  expiresAt: string;
}

let memorySession: MockPersistedIdentity | null = null;

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function readPersisted(): MockPersistedIdentity | null {
  if (memorySession) return memorySession;
  if (!canUseSessionStorage()) return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MockPersistedIdentity;
    if (!parsed?.user?.id || !parsed.expiresAt) return null;
    memorySession = parsed;
    return parsed;
  } catch {
    return null;
  }
}

function persist(session: MockPersistedIdentity | null): void {
  memorySession = session;
  if (!canUseSessionStorage()) return;

  if (!session) {
    window.sessionStorage.removeItem(SESSION_KEY);
    return;
  }

  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function createMockSession(user: User, ttlMs = MOCK_SESSION_TTL_MS): AuthSessionSnapshot {
  const issuedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + ttlMs).toISOString();
  persist({ user, issuedAt, expiresAt });
  return { user, issuedAt, expiresAt, isExpired: false };
}

export function readMockSession(): AuthSessionSnapshot {
  const session = readPersisted();
  if (!session) {
    return { user: null, issuedAt: null, expiresAt: null, isExpired: false };
  }

  const isExpired = Date.parse(session.expiresAt) <= Date.now();
  return {
    user: session.user,
    issuedAt: session.issuedAt,
    expiresAt: session.expiresAt,
    isExpired,
  };
}

export function refreshMockSession(ttlMs = MOCK_SESSION_TTL_MS): AuthSessionSnapshot {
  const current = readMockSession();
  if (!current.user) {
    return current;
  }
  if (current.isExpired) {
    return current;
  }
  return createMockSession(current.user, ttlMs);
}

export function clearMockSession(): void {
  persist(null);
}
