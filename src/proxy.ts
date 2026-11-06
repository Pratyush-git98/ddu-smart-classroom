import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Production authorization boundary (Next.js 16 `proxy` convention).
 *
 * When campus SSO or a secure API is wired, this proxy MUST:
 * 1. Read the httpOnly session cookie issued by the identity provider.
 * 2. Validate the session with the backend (or a signed JWT public key).
 * 3. Redirect unauthenticated users to /login.
 * 4. Redirect authenticated users who lack the matching role to /unauthorized.
 *
 * The current mock adapter cannot mint httpOnly cookies from the browser, so
 * this matcher is a documented placeholder. Client RoleGuard is UX-only and
 * is not a substitute for this check.
 */
export function proxy(request: NextRequest) {
  void request;
  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/faculty/:path*", "/admin/:path*"],
};
