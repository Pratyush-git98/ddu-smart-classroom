"use client";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import type { ClassroomAvailabilityQuery, ClassroomSearchFilters } from "@/types";
import { QUERY_CACHE } from "@/lib/query-cache-policy";
import { queryKeys } from "@/lib/query-keys";
import { getClassroomService } from "../services/classroom-client";

const classroomService = getClassroomService();

export function useClassroomSearch(filters: ClassroomSearchFilters) {
  return useQuery({
    queryKey: queryKeys.classrooms.search(filters),
    queryFn: () => classroomService.search(filters),
    staleTime: QUERY_CACHE.classroomSearch.staleTimeMs,
    gcTime: QUERY_CACHE.classroomSearch.gcTimeMs,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  });
}

export function useClassroomCatalog() {
  return useQuery({
    queryKey: queryKeys.classrooms.catalog(),
    queryFn: () => classroomService.listCatalog(),
    staleTime: QUERY_CACHE.classroomMetadata.staleTimeMs,
    gcTime: QUERY_CACHE.classroomMetadata.gcTimeMs,
    refetchOnWindowFocus: false,
  });
}

export function useClassroomBuildings(campusId: ClassroomSearchFilters["campusId"]) {
  return useQuery({
    queryKey: queryKeys.classrooms.buildings(campusId),
    queryFn: () => classroomService.listBuildings(campusId),
    staleTime: QUERY_CACHE.classroomMetadata.staleTimeMs,
    gcTime: QUERY_CACHE.classroomMetadata.gcTimeMs,
    refetchOnWindowFocus: false,
  });
}

export function useClassroom(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.classrooms.detail(id ?? ""),
    queryFn: () => classroomService.getById(id!),
    enabled: Boolean(id),
    staleTime: QUERY_CACHE.classroomMetadata.staleTimeMs,
    gcTime: QUERY_CACHE.classroomMetadata.gcTimeMs,
    refetchOnWindowFocus: false,
  });
}

export function useClassroomAvailability(query: ClassroomAvailabilityQuery, enabled = true) {
  return useQuery({
    queryKey: queryKeys.classrooms.availability(query),
    queryFn: () => classroomService.getAvailability(query),
    enabled: enabled && Boolean(query.classroomId && query.date),
    staleTime: QUERY_CACHE.availability.staleTimeMs,
    gcTime: QUERY_CACHE.availability.gcTimeMs,
    refetchOnWindowFocus: true,
  });
}

/** Always hits the booking/availability service. Do not read this from the Query cache. */
export function useConfirmClassroomAvailability() {
  return useMutation({
    mutationFn: (query: ClassroomAvailabilityQuery) => classroomService.confirmAvailability(query),
    gcTime: 0,
    retry: 0,
  });
}
