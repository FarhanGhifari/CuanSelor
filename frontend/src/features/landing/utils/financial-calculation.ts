export function calculateFutureValue({
    monthlyInvestment,
    years,
    annualReturn,
}: {
    monthlyInvestment: number;
    years: number;
    annualReturn: number;
}) {
    const monthlyReturn = annualReturn / 12;
    const months = years * 12;

    if (monthlyReturn === 0) {
        return monthlyInvestment * months;
    }

    return (
        monthlyInvestment *
        (((1 + monthlyReturn) ** months - 1) / monthlyReturn)
    );
}