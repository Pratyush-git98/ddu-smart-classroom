import type { AdminDashboardService } from "./admin-dashboard-service.interface";
import { mockAdminDashboardService } from "./mock/mock-admin-adapter";

/**
 * Swap `mockAdminDashboardService` for an HTTP adapter when the campus
 * administration API is available. Hooks should keep calling
 * `getAdminDashboardService()` only.
 */
export function getAdminDashboardService(): AdminDashboardService {
  return mockAdminDashboardService;
}

export const adminDashboardService = getAdminDashboardService();
