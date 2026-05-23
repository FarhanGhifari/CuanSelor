import { useMemo, useState } from "react";
import { RISK_PROFILES } from "../data/simulation-preview-data";
import { calculateFutureValue } from "../utils/financial-calculation";
import type { RiskProfile } from "../types/simulation-preview.types";

export function useSimulationPreview() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(2_500_000);
    const [currentAge, setCurrentAge] = useState(23);
    const [riskProfile, setRiskProfile] = useState<RiskProfile>("moderate");

    const selectedRisk = useMemo(() => {
        return (
            RISK_PROFILES.find((item) => item.id === riskProfile) ??
            RISK_PROFILES[1]
        );
    }, [riskProfile]);

    const simulation = useMemo(() => {
        const targetRetirementAge = 55;
        const yearsToInvest = Math.max(targetRetirementAge - currentAge, 1);

        const estimatedFund = calculateFutureValue({
            monthlyInvestment,
            years: yearsToInvest,
            annualReturn: selectedRisk.estimatedReturn,
        });

        const idealRetirementFund = 3_000_000_000;

        const readinessScore = Math.min(
            Math.round((estimatedFund / idealRetirementFund) * 100),
            100
        );

        const fasterYears = Math.max(
            0,
            Math.floor((monthlyInvestment - 1_000_000) / 750_000)
        );

        const projectedRetirementAge = Math.max(
            45,
            targetRetirementAge - fasterYears
        );

        const yearlyProjection = Array.from({ length: 6 }).map((_, index) => {
            const year = Math.round((yearsToInvest / 5) * index);

            const value = calculateFutureValue({
                monthlyInvestment,
                years: Math.max(year, 1),
                annualReturn: selectedRisk.estimatedReturn,
            });

            return {
                year: currentAge + year,
                value,
            };
        });

        return {
            targetRetirementAge,
            projectedRetirementAge,
            estimatedFund,
            readinessScore,
            fasterYears,
            yearlyProjection,
        };
    }, [monthlyInvestment, currentAge, selectedRisk]);

    return {
        monthlyInvestment,
        setMonthlyInvestment,
        currentAge,
        setCurrentAge,
        riskProfile,
        setRiskProfile,
        selectedRisk,
        simulation,
    };
}