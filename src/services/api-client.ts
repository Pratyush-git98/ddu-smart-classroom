import type { ApiResponse } from "@/types";

/**
 * Production-ready mock and API communication utilities.
 * Simulates microsecond-to-millisecond network delays and guarantees strict type safety.
 */

export const mockDelay = (ms = 150): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function createApiResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

