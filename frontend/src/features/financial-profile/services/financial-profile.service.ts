import { apiClient }           from "@/lib/api/axios.config";
import { API }                 from "@/lib/constants/api-endpoints";
import type { OnboardingPayload, FinancialProfile } from "../types/financial-profile.types";
import type { ApiResponse }    from "@/types/api.types";

type RiskProfileValue = OnboardingPayload["riskProfile"];

interface BackendProfileResponse {
  personal?: {
    name?: string;
    email?: string;
  } | null;
  financial?: {
    monthly_income?: number;
    monthly_expenses?: number;
    annual_bonus?: number;
    saving_percentage?: number;
    cold_cash?: number;
    expected_annual_return?: number;
  } | null;
  pension?: {
    target_retirement_age?: number;
    post_retirement_lifestyle?: number;
  } | null;
  risk?: {
    risk_category?: string;
    answers?: Partial<OnboardingPayload>;
  } | null;
}

function normalizeRiskProfile(value?: string): RiskProfileValue {
  if (value === "conservative" || value === "moderate" || value === "aggressive") {
    return value;
  }

  return "moderate";
}

export const financialProfileService = {
  save: async (payload: OnboardingPayload): Promise<FinancialProfile> => {
    await apiClient.post<ApiResponse<unknown>>(
      API.PROFILE.UPDATE,
      payload
    );

    // Trigger AI Risk Assessment after profile is saved so that AI analyzes the new data
    try {
      await apiClient.post(API.RISK.SUBMIT);
    } catch (error) {
      console.error("Failed to trigger AI risk assessment:", error);
    }

    // Since backend upsert returns { profile, financial, pension, risk },
    // we just return the payload mapped to FinancialProfile for optimistic UI if needed,
    // or just return get() to be safe. But to keep it simple, we just map what we can.
    return {
      ...payload,
      id: "saved",
      userId: "saved",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  get: async (): Promise<FinancialProfile | null> => {
    const { data } = await apiClient.get<ApiResponse<BackendProfileResponse>>(
      API.PROFILE.GET
    );
    const raw = data.data;
    if (!raw || !raw.financial) {
      return null;
    }
    
    // Map backend response to frontend FinancialProfile
    return {
      id: "profile",
      userId: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fullName: raw.personal?.name || "",
      age: raw.risk?.answers?.age || 30,
      gender: raw.risk?.answers?.gender || "male",
      monthlyIncome: raw.financial.monthly_income || 0,
      annualBonusMonths: raw.financial.annual_bonus || 0,
      monthlyExpense: raw.financial.monthly_expenses || 0,
      savingsPercentage: raw.financial.saving_percentage || 0,
      currentSavings: raw.financial.cold_cash || 0,
      totalDebt: Number(raw.risk?.answers?.totalDebt) || 0,
      retirementAge: raw.pension?.target_retirement_age || 55,
      lifestylePercent: raw.pension?.post_retirement_lifestyle || 80,
      riskProfile: normalizeRiskProfile(raw.risk?.risk_category),
      riskAnswers: (raw.risk?.answers || {}) as Record<string, number>,
      sector: raw.risk?.answers?.sector || "",
      hasHealthInsurance: raw.risk?.answers?.hasHealthInsurance || false,
      depositRate: raw.financial.expected_annual_return || 4.5,
      includePandemicRisk: raw.risk?.answers?.includePandemicRisk || false,
    };
  },
};
