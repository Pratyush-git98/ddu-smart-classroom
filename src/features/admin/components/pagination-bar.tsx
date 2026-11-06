"use client";

import { Button } from "@/components/ui/button";
import { pageCount } from "../lib/paginate";

export function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const pages = pageCount(total, pageSize);
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
      <p className="text-xs text-slate-500">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="px-2 text-xs font-medium text-slate-600">
          {page} / {pages}
        </span>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
