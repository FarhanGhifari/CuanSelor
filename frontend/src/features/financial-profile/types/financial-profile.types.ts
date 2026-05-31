export type RiskProfile = "conservative" | "moderate" | "aggressive";

export interface OnboardingPayload {
    // Step 0 - Personal Data
    fullName: string;
    age: number;
    gender: "male" | "female";
    // Step 1
    monthlyIncome: number;
    annualBonusMonths: number;
    // Step 2
    monthlyExpense: number;
    savingsPercentage: number;
    // Step 3
    currentSavings: number;
    totalDebt: number;
    // Step 4
    retirementAge: number;
    planningAge?: number;
    lifestylePercent: number;
    // Step 5
    riskProfile: RiskProfile;
    riskAnswers: Record<string, number>;
    // Step 6
    sector: string;
    hasHealthInsurance: boolean;
    depositRate: number;
    includePandemicRisk: boolean;
}

export interface FinancialProfile extends OnboardingPayload {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}