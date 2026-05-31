import { useQuery } from "@tanstack/react-query";
import { projectionService } from "../services/projection.service";
import type { CalculatorOutput } from "../types/projection.types";

export const useProjection = (customPlanningAge?: number) => {
  return useQuery<CalculatorOutput>({
    queryKey: ["projection", customPlanningAge],
    queryFn: () => projectionService.getProjection(customPlanningAge),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
    placeholderData: (previousData) => previousData,
  });
};
