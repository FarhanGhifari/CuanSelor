import type { FinancialOnboardingInput, PensionOnboardingInput } from "@/features/auth/validations/auth.schema";

type MockResult<T = unknown> = { data: T | null; error: { message: string } | null };

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const onboardingMock = {
  submitFinancial: async (
    payload: FinancialOnboardingInput
  ): Promise<MockResult<{ id: string }>> => {
    await delay(1000);
    console.log("[Mock] Financial data saved:", payload);
    return { data: { id: "mock-financial-001" }, error: null };
  },

  submitPension: async (
    payload: PensionOnboardingInput & { riskAnswers?: Record<string, number> }
  ): Promise<MockResult<{ id: string }>> => {
    await delay(1000);
    console.log("[Mock] Pension data saved:", payload);
    return { data: { id: "mock-pension-001" }, error: null };
  },
};
