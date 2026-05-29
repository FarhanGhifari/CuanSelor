import { useQuery } from "@tanstack/react-query";
import { projectionService } from "../services/projection.service";
import type { CalculatorOutput } from "../types/projection.types";

export const useProjection = (customPlanningAge?: number) => {
  return useQuery<CalculatorOutput>({
    queryKey: ["projection", customPlanningAge],
    queryFn: () => projectionService.getProjection(customPlanningAge),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
