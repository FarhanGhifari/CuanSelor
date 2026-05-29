import { apiClient }       from "@/lib/api/axios.config";
import { API }             from "@/lib/constants/api-endpoints";
import type { CalculatorOutput } from "../types/projection.types";

interface ProjectionResponse {
  success: boolean;
  data: CalculatorOutput;
  message?: string;
}

export const projectionService = {
  /**
   * Fetch projection calculation from backend
   * Backend will pull user data from Supabase and run Python Monte Carlo
   */
  getProjection: async (customPlanningAge?: number): Promise<CalculatorOutput> => {
    const url = customPlanningAge
      ? `${API.PROJECTION_CALC.GET}?custom_planning_age=${customPlanningAge}`
      : API.PROJECTION_CALC.GET;
    const { data } = await apiClient.get<ProjectionResponse>(url);
    return data.data;
  },
};
