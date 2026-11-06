import type { PaginatedResult } from "../types";

export const ADMIN_PAGE_SIZE = 8;

export function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page: safePage,
    pageSize,
  };
}

export function pageCount(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}
