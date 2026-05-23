export type RiskProfile = "conservative" | "moderate" | "aggressive";

export interface RiskProfileOption {
  id: RiskProfile;
  label: string;
  description: string;
  estimatedReturn: number;
}

export interface YearlyProjection {
  year: number;
  value: number;
}

export interface SimulationResult {
  targetRetirementAge: number;
  projectedRetirementAge: number;
  estimatedFund: number;
  readinessScore: number;
  fasterYears: number;
  yearlyProjection: YearlyProjection[];
}