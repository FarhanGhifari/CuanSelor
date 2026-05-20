import { z } from "zod";

export const onboardingSchema = z.object({
    // Step 1
    monthlyIncome: z.number().min(1, "Wajib diisi"),
    annualBonusMonths: z.number().min(0).max(12),
    // Step 2
    monthlyExpense: z.number().min(1, "Wajib diisi"),
    savingsPercentage: z.number().min(1).max(100),
    // Step 3
    currentSavings: z.number().min(0),
    totalDebt: z.number().min(0),
    // Step 4
    retirementAge: z.number().min(30).max(80),
    lifestylePercent: z.number().min(10).max(200),
    // Step 5
    riskProfile: z.enum(["conservative", "moderate", "aggressive"]),
    riskAnswers: z.record(z.string(), z.number()),
    // Step 6
    sector: z.string().min(1, "Wajib dipilih"),
    hasHealthInsurance: z.boolean(),
    depositRate: z.number().min(0).max(20),
    includePandemicRisk: z.boolean(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;