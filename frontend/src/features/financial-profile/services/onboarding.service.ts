import { apiClient } from "@/lib/api/axios.config";
import { API } from "@/lib/constants/api-endpoints";
import type { FinancialOnboardingInput, PensionOnboardingInput } from "@/features/auth/validations/auth.schema";

export const onboardingService = {
  submitFinancial: async (data: FinancialOnboardingInput) => {
    const res = await apiClient.post(API.ONBOARDING.FINANCIAL, data);
    return res.data;
  },

  submitPension: async (
    data: PensionOnboardingInput & { riskAnswers?: Record<string, number> }
  ) => {
    const res = await apiClient.post(API.ONBOARDING.PENSION, data);
    return res.data;
  },
};
