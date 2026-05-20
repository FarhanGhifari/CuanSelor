import type { OnboardingPayload, FinancialProfile } from "../types/financial-profile.types";

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const financialProfileMock = {
    save: async (payload: OnboardingPayload): Promise<FinancialProfile> => {
        await delay(1200);
        return {
            ...payload,
            id: "mock-profile-001",
            userId: "mock-user-001",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    },

    get: async (): Promise<FinancialProfile | null> => {
        await delay(500);
        return null; // null = belum pernah onboarding
    },
};