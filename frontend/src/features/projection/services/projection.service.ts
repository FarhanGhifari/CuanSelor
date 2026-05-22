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
  getProjection: async (): Promise<CalculatorOutput> => {
    const { data } = await apiClient.get<ProjectionResponse>(
      API.PROJECTION_CALC.GET
    );
    return data.data;
  },
};
