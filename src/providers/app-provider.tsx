"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { CampusLocationId } from "@/types";
import { QueryProvider } from "./query-provider";
import { ToastProvider } from "@/components/ui/toast";

interface CampusContextType {
  activeCampus: CampusLocationId | "ALL";
  setActiveCampus: (campus: CampusLocationId | "ALL") => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export function useActiveCampus() {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error("useActiveCampus must be used within an AppProviders component");
  }
  return context;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [activeCampus, setActiveCampus] = useState<CampusLocationId | "ALL">("ALL");

  return (
    <QueryProvider>
      <ToastProvider>
        <CampusContext.Provider value={{ activeCampus, setActiveCampus }}>
          {children}
        </CampusContext.Provider>
      </ToastProvider>
    </QueryProvider>
  );
}

