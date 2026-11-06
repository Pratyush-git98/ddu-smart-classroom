"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import type { ClassroomAvailabilityQuery, ClassroomSearchFilters } from "@/types";
import { serializeClassroomSearchFilters } from "../lib/default-filters";
import { getClassroomService } from "../services/classroom-client";

const classroomService = getClassroomService();

export function useClassroomSearch(filters: ClassroomSearchFilters) {
  return useQuery({
    queryKey: ["classrooms", "search", serializeClassroomSearchFilters(filters)],
    queryFn: () => classroomService.search(filters),
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
}

export function useClassroomBuildings(campusId: ClassroomSearchFilters["campusId"]) {
  return useQuery({
    queryKey: ["classrooms", "buildings", campusId],
    queryFn: () => classroomService.listBuildings(campusId),
    staleTime: 60_000,
  });
}

export function useConfirmClassroomAvailability() {
  return useMutation({
    mutationFn: (query: ClassroomAvailabilityQuery) => classroomService.confirmAvailability(query),
  });
}
