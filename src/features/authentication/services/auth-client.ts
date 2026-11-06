import type { AuthService } from "./auth-service.interface";
import { mockAuthAdapter } from "./mock/mock-auth-adapter";

/**
 * Single factory for the active authentication adapter.
 *
 * To replace mock auth with campus SSO or a secure API, implement `AuthService`
 * (for example `SsoAuthAdapter` or `ApiAuthAdapter`) and return it here.
 * Feature pages should keep calling `getAuthService()` / `useAuth()` only.
 */
export function getAuthService(): AuthService {
  return mockAuthAdapter;
}

export const authService = getAuthService();
