"use client";

import React, { createContext, useContext, useState, useCallback, useId } from "react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "destructive" | "warning" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export type ToastOptions = Omit<ToastItem, "id">;

interface ToastContextType {
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
  toasts: ToastItem[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 4000 }: ToastOptions) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, title, description, variant, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss, toasts }}>
      {children}
      {/* Toast Notification Viewport */}
      <div
        role="region"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex max-h-screen w-full max-w-sm flex-col-reverse gap-2 pointer-events-none p-4 sm:p-0"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            aria-live="polite"
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3",
              item.variant === "success" &&
                "border-emerald-200 bg-white text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-100",
              item.variant === "destructive" &&
                "border-rose-200 bg-white text-rose-950 dark:border-rose-800 dark:bg-rose-950/90 dark:text-rose-100",
              item.variant === "warning" &&
                "border-amber-200 bg-white text-amber-950 dark:border-amber-800 dark:bg-amber-950/90 dark:text-amber-100",
              item.variant === "info" &&
                "border-blue-200 bg-white text-blue-950 dark:border-blue-800 dark:bg-blue-950/90 dark:text-blue-100",
              (!item.variant || item.variant === "default") &&
                "border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            )}
          >
            {/* Variant Icon */}
            <div className="shrink-0 mt-0.5">
              {item.variant === "success" && (
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              )}
              {item.variant === "destructive" && (
                <AlertCircle className="size-4 text-rose-600 dark:text-rose-400" />
              )}
              {item.variant === "warning" && (
                <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
              )}
              {item.variant === "info" && (
                <Info className="size-4 text-blue-600 dark:text-blue-400" />
              )}
              {(!item.variant || item.variant === "default") && (
                <Info className="size-4 text-slate-600 dark:text-slate-400" />
              )}
            </div>

            {/* Text Content */}
            <div className="flex-1 space-y-1">
              <h5 className="text-xs font-bold leading-none">{item.title}</h5>
              {item.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  {item.description}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => dismiss(item.id)}
              className="shrink-0 rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none"
              aria-label="Dismiss notification"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

