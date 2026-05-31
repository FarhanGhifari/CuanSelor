import { supabase } from "../../config/supabase.js";
import { AppError } from "../../utils/app-error.js";
import { clearUserCache } from "../../utils/cache.js";

// ── Helpers validasi ──────────────────────────────────────────────────────────

const VALID_RISK_PROFILES = ["conservative", "moderate", "aggressive"];

/**
 * Validasi dan konversi angka positif dari payload.
 */
function toPositiveNumber(value, fieldName, { min = 0, max } = {}) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < min) {
    throw new AppError(`${fieldName} harus berupa angka >= ${min}`, 400);
  }
  if (max !== undefined && num > max) {
    throw new AppError(`${fieldName} tidak boleh lebih dari ${max}`, 400);
  }
  return num;
}

// ── Service functions ─────────────────────────────────────────────────────────

export async function getOnboardingStatus(userId) {
  const [financialResult, retirementResult] = await Promise.all([
    supabase.from("financial_records").select("id").eq("user_id", userId).maybeSingle(),
    supabase.from("retirement_plans").select("id").eq("user_id", userId).maybeSingle(),
  ]);

  if (financialResult.error) {
    throw new AppError("Gagal mengecek data finansial", 500, financialResult.error.message);
  }
  if (retirementResult.error) {
    throw new AppError("Gagal mengecek data pensiun", 500, retirementResult.error.message);
  }

  const hasCompletedFinancial = Boolean(financialResult.data);
  const hasCompletedPension = Boolean(retirementResult.data);

  return {
    hasCompletedFinancial,
    hasCompletedPension,
    isFullyOnboarded: hasCompletedFinancial && hasCompletedPension,
  };
}

export async function saveFinancialOnboarding(userId, payload) {
  // ── Cek keberadaan field wajib ─────────────────────────────────────────────
  const requiredFields = [
    "monthlyIncome",
    "monthlyExpense",
    "annualBonusMonths",
    "currentSavings",
    "savingsPercentage",
  ];
  const missingFields = requiredFields.filter((field) => payload[field] == null);
  if (missingFields.length > 0) {
    throw new AppError("Semua field wajib diisi", 400, { missingFields });
  }

  // ── Validasi tipe dan range ────────────────────────────────────────────────
  const monthlyIncome = toPositiveNumber(payload.monthlyIncome, "Pendapatan bulanan");
  const monthlyExpense = toPositiveNumber(payload.monthlyExpense, "Pengeluaran bulanan");
  const annualBonusMonths = toPositiveNumber(payload.annualBonusMonths, "Bulan bonus tahunan", {
    max: 24,
  });
  const currentSavings = toPositiveNumber(payload.currentSavings, "Tabungan saat ini");
  const savingsPercentage = toPositiveNumber(payload.savingsPercentage, "Persentase tabungan", {
    max: 100,
  });

  const { data, error } = await supabase
    .from("financial_records")
    .upsert(
      {
        user_id: userId,
        monthly_income: monthlyIncome,
        monthly_expenses: monthlyExpense,
        annual_bonus: annualBonusMonths,
        cold_cash: currentSavings,
        saving_percentage: savingsPercentage,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (error) {
    throw new AppError("Gagal menyimpan data finansial", 500, error.message);
  }

  await supabase.from("projection_results").delete().eq("user_id", userId);
  clearUserCache(userId);

  return data;
}

export async function savePensionOnboarding(userId, payload) {
  // ── Cek keberadaan field wajib ─────────────────────────────────────────────
  const requiredFields = ["retirementAge", "lifestylePercent", "riskProfile", "sector", "depositRate"];
  const missingFields = requiredFields.filter((field) => payload[field] == null);
  if (missingFields.length > 0) {
    throw new AppError("Semua field wajib diisi", 400, { missingFields });
  }

  // ── Validasi tipe dan range ────────────────────────────────────────────────
  const retirementAge = toPositiveNumber(payload.retirementAge, "Usia pensiun", {
    min: 40,
    max: 80,
  });
  const lifestylePercent = toPositiveNumber(payload.lifestylePercent, "Persentase gaya hidup", {
    max: 200,
  });
  const depositRate = toPositiveNumber(payload.depositRate, "Return investasi tahunan", {
    max: 100,
  });

  // Validasi planning age jika ada
  let planningAge = null;
  if (payload.planningAge != null) {
    planningAge = toPositiveNumber(payload.planningAge, "Usia target perencanaan dana", {
      min: retirementAge,
      max: 120,
    });
  }

  if (!VALID_RISK_PROFILES.includes(payload.riskProfile)) {
    throw new AppError(
      `Profil risiko tidak valid. Gunakan salah satu: ${VALID_RISK_PROFILES.join(", ")}`,
      400,
    );
  }

  // ── Simpan rencana pensiun ─────────────────────────────────────────────────
  const retirementPlanData = {
    user_id: userId,
    target_retirement_age: retirementAge,
    post_retirement_lifestyle: lifestylePercent,
    updated_at: new Date().toISOString(),
  };

  // Tambahkan planning_age jika ada
  if (planningAge !== null) {
    retirementPlanData.planning_age = planningAge;
  }

  const { data: retirementData, error: retirementError } = await supabase
    .from("retirement_plans")
    .upsert(retirementPlanData, { onConflict: "user_id" })
    .select()
    .single();

  if (retirementError) {
    throw new AppError("Gagal menyimpan data proyeksi pensiun", 500, retirementError.message);
  }

  // ── Simpan profil risiko ───────────────────────────────────────────────────
  const { error: riskError } = await supabase.from("risk_profiles").insert({
    user_id: userId,
    answers: payload.riskAnswers || {},
    risk_category: payload.riskProfile,
    assessed_at: new Date().toISOString(),
  });

  if (riskError) {
    throw new AppError("Gagal menyimpan profil risiko", 500, riskError.message);
  }

  // ── Update expected_annual_return di financial_records ────────────────────
  const { error: financialError } = await supabase
    .from("financial_records")
    .update({
      expected_annual_return: depositRate,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (financialError) {
    throw new AppError("Gagal memperbarui return investasi", 500, financialError.message);
  }

  await supabase.from("projection_results").delete().eq("user_id", userId);
  clearUserCache(userId);

  return retirementData;
}
