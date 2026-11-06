"use client";

import { useEffect, type ReactNode } from "react";

export function MobileNavDrawer({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label={label}>
      <button
        type="button"
        className="fixed inset-0 bg-slate-950/70"
        onClick={onClose}
        aria-label="Close navigation"
      />
      <div className="relative z-50 h-full w-72">{children}</div>
    </div>
  );
}
