import type { OnboardingPayload, FinancialProfile } from "../types/financial-profile.types";

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const MOCK_PROFILE: FinancialProfile = {
    id: "mock-profile-001",
    userId: "mock-user-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fullName: "Budi Santoso",
    age: 25,
    gender: "male",
    monthlyIncome: 8_000_000,
    annualBonusMonths: 2,
    monthlyExpense: 4_500_000,
    savingsPercentage: 20,
    currentSavings: 15_000_000,
    totalDebt: 5_000_000,
    retirementAge: 55,
    lifestylePercent: 80,
    riskProfile: "moderate",
    riskAnswers: { q1: 2, q2: 3, q3: 2, q4: 1 },
    sector: "Teknologi",
    hasHealthInsurance: true,
    depositRate: 4.5,
    includePandemicRisk: false,
};

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
        return MOCK_PROFILE; // returns mock data for UI testing
    },
};