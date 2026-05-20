import { apiClient }           from "@/lib/api/axios.config";
import { API }                 from "@/lib/constants/api-endpoints";
import type { OnboardingPayload, FinancialProfile } from "../types/financial-profile.types";
import type { ApiResponse }    from "@/types/api.types";

export const financialProfileService = {
  save: async (payload: OnboardingPayload): Promise<FinancialProfile> => {
    const { data } = await apiClient.post<ApiResponse<FinancialProfile>>(
      API.PROFILE.UPDATE,
      payload
    );
    return data.data;
  },

  get: async (): Promise<FinancialProfile | null> => {
    const { data } = await apiClient.get<ApiResponse<FinancialProfile | null>>(
      API.PROFILE.GET
    );
    return data.data;
  },
};