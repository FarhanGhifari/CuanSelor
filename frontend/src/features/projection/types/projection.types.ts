// ── Types matching Python CalculatorOutput JSON ────────────────

export interface ProjectionScenario {
  percentile: string;
  fund_at_retirement: number;
  real_fund_at_retirement: number;
  annual_withdrawal_capacity: number;
  ruin_probability: number;
  fund_depleted_age: number | null;
  note: string;
}

export interface ProjectionData {
  pessimistic_p10: ProjectionScenario;
  median_p50: ProjectionScenario;
  optimistic_p90: ProjectionScenario;
}

export interface ActuarialSummary {
  source: string;
  current_age: number;
  gender: string;
  expected_death_age: number;
  p50_survival_age: number;
  p75_survival_age: number;
  p90_survival_age: number;
  planning_age_recommended: number;
  years_to_retirement: number;
  planning_horizon_post_retirement: number;
  survival_prob_at_retirement: number;
  longevity_risk_flag: boolean;
  warning: string | null;
}

export interface Recommendations {
  effective_risk_profile: string;
  glide_path_applied: boolean;
  base_profile: string;
  allocation: Record<string, number>;
  portfolio_nominal_return_mean: string;
  portfolio_std: string;
  required_nest_egg: number;
  projected_fund_p50: number;
  fund_gap_positive_means_surplus: number;
  is_on_track: boolean;
  monthly_contribution_current: number;
  instruments_in_portfolio: string[];
}

export interface SensitivityScenario {
  fund_p50: number;
  ruin_probability: number;
  ruin_change?: number;
  fund_change_pct?: number;
}

export interface SensitivityData {
  base: SensitivityScenario;
  if_inflation_plus_1pct: SensitivityScenario;
  if_retirement_delayed_3yr: SensitivityScenario;
  if_savings_rate_plus_10pct: SensitivityScenario;
}

export interface ABTestResult {
  hypothesis: string;
  strategy_a_fixed: {
    ruin_probability: number;
    label: string;
  };
  strategy_b_glide_path: {
    ruin_probability: number;
    label: string;
  };
  improvement: number;
  improvement_pct: number;
  u_statistic: number;
  p_value: number;
  statistically_significant: boolean;
  winner: string;
  interpretation: string;
}

export interface UserProfileData {
  name: string;
  age: number;
  gender: string;
  monthly_salary: number;
  savings_rate: number;
  retirement_age: number;
  risk_profile: string;
  sector: string;
  include_pandemic_risk: boolean;
  custom_deposit_rate: number | null;
  custom_planning_age?: number | null;
  current_assets?: number;
}

export interface ProjectionMetadata {
  n_simulations: number;
  random_seed: number;
  inflation_model: string;
  return_model: string;
  mortality_source: string;
  currency: string;
  version: string;
}

export interface CalculatorOutput {
  user_profile: UserProfileData;
  actuarial_summary: ActuarialSummary;
  projection: ProjectionData;
  recommendations: Recommendations;
  sensitivity: SensitivityData;
  ab_test_result: ABTestResult;
  actionable_insights: string[];
  metadata: ProjectionMetadata;
}
