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

function validateNonNegativeNumber(value, fieldName) {
  if (value === undefined || value === null || value === "") return;

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new AppError(`${fieldName} harus berupa angka >= 0`, 400);
  }
}

function validateRiskOverrides(overrides = {}) {
  const numericFields = [
    ["age", "Usia"],
    ["annualIncome", "Pendapatan tahunan"],
    ["annual_income", "Pendapatan tahunan"],
    ["loanAmount", "Jumlah pinjaman"],
    ["loan_amount", "Jumlah pinjaman"],
    ["totalDebt", "Total utang"],
    ["total_debt", "Total utang"],
    ["loanDurationMonths", "Durasi pinjaman"],
    ["loan_duration_months", "Durasi pinjaman"],
    ["interestRate", "Suku bunga"],
    ["interest_rate", "Suku bunga"],
    ["debtToIncomeRatio", "Rasio utang terhadap pendapatan"],
    ["debt_to_income_ratio", "Rasio utang terhadap pendapatan"],
    ["monthlyExpenses", "Pengeluaran bulanan"],
    ["monthly_expenses", "Pengeluaran bulanan"],
    ["savingsBalance", "Saldo tabungan"],
    ["savings_balance", "Saldo tabungan"],
    ["employmentStabilityYears", "Stabilitas kerja"],
    ["employment_stability_years", "Stabilitas kerja"],
    ["previousDefaultCount", "Jumlah gagal bayar sebelumnya"],
    ["previous_default_count", "Jumlah gagal bayar sebelumnya"],
  ];

  for (const [field, label] of numericFields) {
    validateNonNegativeNumber(overrides[field], label);
  }
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
  if (!aiResult) return null;

  // Prioritas pertama: ambil nama profil langsung dari Railway API (e.g. "Financially Stable")
  if (typeof aiResult.profile_name === "string" && aiResult.profile_name.trim()) {
    return aiResult.profile_name.trim();
  }

  // Prioritas kedua: ambil label angka dari model segmentasi (0, 1, 2)
  if (aiResult.financial_profile_label !== undefined && aiResult.financial_profile_label !== null) {
    return String(aiResult.financial_profile_label);
  }

  const candidates = [
    aiResult.segment,
    aiResult.profile_segment,
    aiResult.financial_profile_segment,
    aiResult.risk_profile,
    aiResult.risk_category,
    aiResult.prediction,
    aiResult.label,
    aiResult.result?.segment,
    aiResult.result?.prediction,
  ];

  const found = candidates.find((candidate) => typeof candidate === "string" && candidate.trim());
  return found || null;
}

function mapSegmentToRiskCategory(segment, fallback = "moderate") {
  if (segment === null || segment === undefined) return fallback;
  const normalized = String(segment).toLowerCase().trim();

  // Pemetaan untuk segmen dari Railway AI (cluster 0, 1, 2 atau nama profilnya)
  if (
    normalized.includes("stable") || 
    normalized === "0" || 
    normalized.includes("aggressive") || 
    normalized.includes("high") || 
    normalized.includes("tinggi")
  ) {
    return "aggressive";
  }

  if (
    normalized.includes("vulnerable") || 
    normalized.includes("struggling") || 
    normalized === "2" || 
    normalized.includes("conservative") || 
    normalized.includes("low") || 
    normalized.includes("rendah")
  ) {
    return "conservative";
  }

  if (
    normalized.includes("moderate") || 
    normalized === "1" || 
    normalized.includes("medium") || 
    normalized.includes("sedang")
  ) {
    return "moderate";
  }

  return fallback;
}

function buildAiPayload({ profile, financial, latestRisk, overrides = {} }) {
  const answers = latestRisk?.answers || {};
  const monthlyIncome = toNumber(financial.monthly_income);
  const annualIncome = monthlyIncome * (12 + toNumber(financial.annual_bonus));
  
  // Get loan_amount from answers (from new questionnaire)
  const loanAmount = pickFirstNumber(
    overrides.loanAmount,
    overrides.loan_amount,
    answers.loan_amount,
    overrides.totalDebt,
    overrides.total_debt,
    answers.loanAmount,
    answers.totalDebt,
    answers.total_debt,
  );

  return {
    // Age from questionnaire or calculated from DOB
    age: pickFirstNumber(
      overrides.age, 
      answers.age, 
      calculateAge(profile?.date_of_birth), 
      30
    ),
    
    // Annual income from questionnaire or calculated from financial data
    annual_income: pickFirstNumber(
      overrides.annualIncome, 
      overrides.annual_income, 
      answers.annual_income,
      annualIncome
    ),
    
    // Loan amount from questionnaire
    loan_amount: loanAmount,
    
    // Loan duration from questionnaire
    loan_duration_months: pickFirstNumber(
      overrides.loanDurationMonths,
      overrides.loan_duration_months,
      answers.loan_duration_months,
      answers.loanDurationMonths,
      DEFAULT_AI_INPUT.loan_duration_months,
    ),
    
    // Interest rate from questionnaire
    interest_rate: pickFirstNumber(
      overrides.interestRate,
      overrides.interest_rate,
      answers.interest_rate,
      answers.interestRate,
      DEFAULT_AI_INPUT.interest_rate,
    ),
    
    // Debt to income ratio from questionnaire or calculated
    debt_to_income_ratio: pickFirstNumber(
      overrides.debtToIncomeRatio,
      overrides.debt_to_income_ratio,
      answers.debt_to_income_ratio,
      answers.debtToIncomeRatio,
      annualIncome > 0 ? loanAmount / annualIncome : 0,
    ),
    
    // Monthly expenses from questionnaire or financial data
    monthly_expenses: pickFirstNumber(
      overrides.monthlyExpenses,
      overrides.monthly_expenses,
      answers.monthly_expenses,
      answers.monthlyExpenses,
      financial.monthly_expenses,
    ),
    
    // Savings balance from questionnaire or financial data
    savings_balance: pickFirstNumber(
      overrides.savingsBalance,
      overrides.savings_balance,
      answers.savings_balance,
      answers.savingsBalance,
      financial.cold_cash,
    ),
    
    // Employment stability from questionnaire
    employment_stability_years: pickFirstNumber(
      overrides.employmentStabilityYears,
      overrides.employment_stability_years,
      answers.employment_stability_years,
      answers.employmentStabilityYears,
      DEFAULT_AI_INPUT.employment_stability_years,
    ),
    
    // Previous default count from questionnaire
    previous_default_count: pickFirstNumber(
      overrides.previousDefaultCount,
      overrides.previous_default_count,
      answers.previous_default_count,
      answers.previousDefaultCount,
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
  validateRiskOverrides(overrides);

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

  let aiResult = null;
  let aiSegment = null;
  try {
    aiResult = await predictFinancialSegment(aiInput);
    aiSegment = extractAiSegment(aiResult);
  } catch (err) {
    console.warn("[RISK AI] Failed to contact AI service for risk assessment, using fallback:", err.message);
  }

  const riskCategory = latestRisk?.risk_category || "moderate";

  const { data, error } = await supabase
    .from("risk_profiles")
    .insert({
      user_id: userId,
      risk_category: riskCategory,
      ai_suggestion: aiResult ? JSON.stringify(aiResult) : null,
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
