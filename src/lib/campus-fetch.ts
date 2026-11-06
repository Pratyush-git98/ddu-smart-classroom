import { HTTP_CACHE } from "./query-cache-policy";

export type CampusCachePolicy = "publicStatic" | "noStore";

/**
 * Shared fetch wrapper.
 *
 * - Never reads tokens from localStorage.
 * - `publicStatic` is for catalog-like GET payloads (Next.js `revalidate` when this runs on the server).
 * - `noStore` is the default for bookings, availability, notifications and profiles.
 */
export async function campusFetch(
  input: RequestInfo | URL,
  init: RequestInit & { cachePolicy?: CampusCachePolicy } = {}
): Promise<Response> {
  const { cachePolicy = "noStore", headers, ...rest } = init;
  const nextCache =
    cachePolicy === "publicStatic"
      ? { cache: "force-cache" as const, next: { revalidate: HTTP_CACHE.publicStaticSeconds } }
      : { cache: HTTP_CACHE.noStore, next: { revalidate: 0 } };

  return fetch(input, {
    ...rest,
    ...nextCache,
    credentials: rest.credentials ?? "same-origin",
    headers,
  } as RequestInit);
}

export async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("The campus service returned an unreadable response.");
  }
}
