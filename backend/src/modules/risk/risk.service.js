import { supabase } from "../../config/supabase.js";
import { AppError } from "../../utils/app-error.js";
import { predictFinancialSegment } from "./risk-ai.client.js";

const DEFAULT_AI_INPUT = {
  loan_duration_months: 12,
  interest_rate: 0,
  employment_stability_years: 1,
  previous_default_count: 0,
};

function toNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;

  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const hasHadBirthday =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());

  if (!hasHadBirthday) age -= 1;
  return age;
}

function pickFirstNumber(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return toNumber(value);
    }
  }

  return 0;
}

function extractAiSegment(aiResult) {
  const candidates = [
    aiResult?.segment,
    aiResult?.profile_segment,
    aiResult?.financial_profile_segment,
    aiResult?.risk_profile,
    aiResult?.risk_category,
    aiResult?.prediction,
    aiResult?.label,
    aiResult?.result?.segment,
    aiResult?.result?.prediction,
  ];

  return candidates.find((candidate) => typeof candidate === "string" && candidate.trim()) || null;
}

function mapSegmentToRiskCategory(segment, fallback = "moderate") {
  const normalized = String(segment || "").toLowerCase();

  if (normalized.includes("aggressive") || normalized.includes("high") || normalized.includes("tinggi")) {
    return "aggressive";
  }

  if (
    normalized.includes("conservative") ||
    normalized.includes("low") ||
    normalized.includes("rendah")
  ) {
    return "conservative";
  }

  if (normalized.includes("moderate") || normalized.includes("medium") || normalized.includes("sedang")) {
    return "moderate";
  }

  return fallback;
}

function buildAiPayload({ profile, financial, latestRisk, overrides = {} }) {
  const answers = latestRisk?.answers || {};
  const monthlyIncome = toNumber(financial.monthly_income);
  const annualIncome = monthlyIncome * (12 + toNumber(financial.annual_bonus));
  const loanAmount = pickFirstNumber(
    overrides.loanAmount,
    overrides.loan_amount,
    overrides.totalDebt,
    overrides.total_debt,
    answers.loanAmount,
    answers.loan_amount,
    answers.totalDebt,
    answers.total_debt,
  );

  return {
    age: pickFirstNumber(overrides.age, answers.age, calculateAge(profile?.date_of_birth), 30),
    annual_income: pickFirstNumber(overrides.annualIncome, overrides.annual_income, annualIncome),
    loan_amount: loanAmount,
    loan_duration_months: pickFirstNumber(
      overrides.loanDurationMonths,
      overrides.loan_duration_months,
      answers.loanDurationMonths,
      answers.loan_duration_months,
      DEFAULT_AI_INPUT.loan_duration_months,
    ),
    interest_rate: pickFirstNumber(
      overrides.interestRate,
      overrides.interest_rate,
      answers.interestRate,
      answers.interest_rate,
      DEFAULT_AI_INPUT.interest_rate,
    ),
    debt_to_income_ratio: pickFirstNumber(
      overrides.debtToIncomeRatio,
      overrides.debt_to_income_ratio,
      annualIncome > 0 ? loanAmount / annualIncome : 0,
    ),
    monthly_expenses: pickFirstNumber(
      overrides.monthlyExpenses,
      overrides.monthly_expenses,
      financial.monthly_expenses,
    ),
    savings_balance: pickFirstNumber(
      overrides.savingsBalance,
      overrides.savings_balance,
      financial.cold_cash,
    ),
    employment_stability_years: pickFirstNumber(
      overrides.employmentStabilityYears,
      overrides.employment_stability_years,
      answers.employmentStabilityYears,
      answers.employment_stability_years,
      DEFAULT_AI_INPUT.employment_stability_years,
    ),
    previous_default_count: pickFirstNumber(
      overrides.previousDefaultCount,
      overrides.previous_default_count,
      answers.previousDefaultCount,
      answers.previous_default_count,
      DEFAULT_AI_INPUT.previous_default_count,
    ),
  };
}

export async function getLatestRiskAssessment(userId) {
  const { data, error } = await supabase
    .from("risk_profiles")
    .select("id, risk_category, answers, ai_suggestion, assessed_at")
    .eq("user_id", userId)
    .order("assessed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new AppError("Gagal mengambil hasil profil risiko", 500, error.message);
  }

  return data;
}

export async function generateRiskAssessment(userId, overrides = {}) {
  const [profileResult, financialResult, latestRiskResult] = await Promise.all([
    supabase.from("profiles").select("date_of_birth").eq("id", userId).maybeSingle(),
    supabase.from("financial_records").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("risk_profiles")
      .select("risk_category, answers")
      .eq("user_id", userId)
      .order("assessed_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (profileResult.error) {
    throw new AppError("Gagal mengambil data profil", 500, profileResult.error.message);
  }
  if (financialResult.error) {
    throw new AppError("Gagal mengambil data finansial", 500, financialResult.error.message);
  }
  if (latestRiskResult.error) {
    throw new AppError("Gagal mengambil profil risiko terakhir", 500, latestRiskResult.error.message);
  }
  if (!financialResult.data) {
    throw new AppError("Data finansial belum lengkap. Isi financial profile terlebih dahulu.", 400);
  }

  const latestRisk = latestRiskResult.data;
  const aiInput = buildAiPayload({
    profile: profileResult.data,
    financial: financialResult.data,
    latestRisk,
    overrides,
  });
  const aiResult = await predictFinancialSegment(aiInput);
  const aiSegment = extractAiSegment(aiResult);
  const riskCategory = mapSegmentToRiskCategory(aiSegment, latestRisk?.risk_category || "moderate");

  const { data, error } = await supabase
    .from("risk_profiles")
    .insert({
      user_id: userId,
      risk_category: riskCategory,
      ai_suggestion: JSON.stringify(aiResult),
      answers: {
        ...(latestRisk?.answers || {}),
        aiInput,
        aiSegment,
      },
      assessed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new AppError("Gagal menyimpan hasil AI profil risiko", 500, error.message);
  }

  return {
    assessment: data,
    aiInput,
    aiResult,
    aiSegment,
    riskCategory,
  };
}
