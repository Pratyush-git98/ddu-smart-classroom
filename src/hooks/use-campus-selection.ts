"use client";

import { useState } from "react";
import type { CampusLocationId } from "@/types";

export type CampusFilterValue = CampusLocationId | "ALL";

export function useCampusSelection(initialCampus: CampusFilterValue = "ALL") {
  const [selectedCampus, setSelectedCampus] = useState<CampusFilterValue>(initialCampus);

  const isIet = selectedCampus === "IET";
  const isDeekshaBhawan = selectedCampus === "DEEKSHA_BHAWAN";
  const isAll = selectedCampus === "ALL";

  return {
    selectedCampus,
    setSelectedCampus,
    isIet,
    isDeekshaBhawan,
    isAll,
  };
}

