import { useQuery } from "@tanstack/react-query";
import { projectionService } from "../services/projection.service";
import type { CalculatorOutput } from "../types/projection.types";

export const useProjection = () => {
  return useQuery<CalculatorOutput>({
    queryKey: ["projection"],
    queryFn: projectionService.getProjection,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};
