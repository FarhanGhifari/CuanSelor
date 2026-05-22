"use client";

import { useQuery } from "@tanstack/react-query";
import { projectionService } from "../services/projection.service";
import { QUERY_KEYS }        from "@/lib/constants/query-keys";
import type { CalculatorOutput } from "../types/projection.types";

/**
 * Custom hook untuk fetch & cache data proyeksi pensiun.
 * - Stale time 5 menit (data tidak berubah-ubah cepat)
 * - Retry 1x jika gagal (Python process bisa timeout)
 */
export function useProjection() {
  return useQuery<CalculatorOutput>({
    queryKey: QUERY_KEYS.PROJECTION.GET({}),
    queryFn: projectionService.getProjection,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
