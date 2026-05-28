import { supabase } from "../../config/supabase.js";
import { AppError } from "../../utils/app-error.js";
import { clearUserCache } from "../../utils/cache.js";

// ── Helpers validasi ──────────────────────────────────────────────────────────

const VALID_GENDERS = ["male", "female"];

/**
 * Validasi dan konversi angka positif dari payload.
 * @param {*} value  - nilai mentah dari payload
 * @param {string} fieldName - nama field untuk pesan error
 * @param {object} [opts]
 * @param {number} [opts.min=0] - batas minimum (inklusif)
 * @param {number} [opts.max]   - batas maksimum (inklusif)
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

export async function getProfile(user) {
  const userId = user.id;

  const [userResult, financialResult, pensionResult, riskResult] = await Promise.all([
    supabase.from("user").select("name, email").eq("id", userId).single(),
    supabase
      .from("financial_records")
      .select(
        "monthly_income, monthly_expenses, saving_percentage, cold_cash, annual_bonus, expected_annual_return",
      )
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("retirement_plans")
      .select("target_retirement_age, post_retirement_lifestyle")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("risk_profiles")
      .select("risk_category, answers, ai_suggestion, assessed_at")
      .eq("user_id", userId)
      .order("assessed_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  // Cek semua error — termasuk userResult yang sebelumnya diabaikan
  if (userResult.error) {
    throw new AppError("Gagal mengambil data user", 500, userResult.error.message);
  }
  if (financialResult.error) {
    throw new AppError("Gagal mengambil data finansial", 500, financialResult.error.message);
  }
  if (pensionResult.error) {
    throw new AppError("Gagal mengambil data pensiun", 500, pensionResult.error.message);
  }
  if (riskResult.error) {
    throw new AppError("Gagal mengambil profil risiko", 500, riskResult.error.message);
  }

  return {
    personal: userResult.data || { name: user.name, email: user.email },
    financial: financialResult.data || null,
    pension: pensionResult.data || null,
    risk: riskResult.data || null,
  };
}

export async function upsertProfile(userId, payload) {
  // ── Validasi input ──────────────────────────────────────────────────────────
  const age = toPositiveNumber(payload.age ?? 30, "Usia", { min: 17, max: 80 });

  // Normalize gender to ensure it's always valid
  let gender = "Laki-laki"; // default
  if (payload.gender === "male" || payload.gender === "Laki-laki") {
    gender = "Laki-laki";
  } else if (payload.gender === "female" || payload.gender === "Perempuan") {
    gender = "Perempuan";
  }

  const monthlyIncome = toPositiveNumber(payload.monthlyIncome ?? 0, "Pendapatan bulanan");
  const monthlyExpense = toPositiveNumber(payload.monthlyExpense ?? 0, "Pengeluaran bulanan");
  const savingsPercentage = toPositiveNumber(payload.savingsPercentage ?? 0, "Persentase tabungan", {
    max: 100,
  });
  const currentSavings = toPositiveNumber(payload.currentSavings ?? 0, "Tabungan saat ini");
  const depositRate = toPositiveNumber(payload.depositRate ?? 4.5, "Return investasi", { max: 100 });
  const retirementAge = toPositiveNumber(payload.retirementAge ?? 55, "Usia pensiun", {
    min: age + 1,
    max: 80,
  });
  const lifestylePercent = toPositiveNumber(payload.lifestylePercent ?? 80, "Persentase gaya hidup", {
    max: 200,
  });

  // ── Hitung tanggal lahir dari usia ─────────────────────────────────────────
  const birthYear = new Date().getFullYear() - age;
  const dateOfBirth = `${birthYear}-01-01`;

  // ── Jalankan semua upsert secara paralel ───────────────────────────────────
  const [profileResult, financialResult, pensionResult] = await Promise.all([
    supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: payload.fullName || "User",
          gender: gender,
          date_of_birth: dateOfBirth,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id", ignoreDuplicates: false },
      )
      .select()
      .single(),
    supabase
      .from("financial_records")
      .upsert(
        {
          user_id: userId,
          monthly_income: monthlyIncome,
          monthly_expenses: monthlyExpense,
          saving_percentage: savingsPercentage,
          cold_cash: currentSavings,
          annual_bonus: toPositiveNumber(payload.annualBonusMonths ?? 0, "Bonus tahunan"),
          expected_annual_return: depositRate,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id", ignoreDuplicates: false },
      )
      .select()
      .single(),
    supabase
      .from("retirement_plans")
      .upsert(
        {
          user_id: userId,
          target_retirement_age: retirementAge,
          post_retirement_lifestyle: lifestylePercent,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id", ignoreDuplicates: false },
      )
      .select()
      .single(),
  ]);

  // ── Cek semua error — termasuk profiles yang sebelumnya di-silent ──────────
  if (profileResult.error) {
    throw new AppError("Gagal menyimpan data profil", 500, profileResult.error.message);
  }
  if (financialResult.error) {
    throw new AppError("Gagal menyimpan data finansial", 500, financialResult.error.message);
  }
  if (pensionResult.error) {
    throw new AppError("Gagal menyimpan data pensiun", 500, pensionResult.error.message);
  }

  // ── Simpan risk profile (selalu insert — bukan upsert, karena histori dicatat) ──
  const { data: risk, error: riskError } = await supabase
    .from("risk_profiles")
    .insert({
      user_id: userId,
      risk_category: payload.riskProfile || "moderate",
      answers: {
        ...(payload.riskAnswers || {}),
        sector: payload.sector,
        totalDebt: payload.totalDebt,
        hasHealthInsurance: payload.hasHealthInsurance,
        includePandemicRisk: payload.includePandemicRisk,
        gender: payload.gender,
        age,
      },
      assessed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (riskError) {
    throw new AppError("Gagal menyimpan profil risiko", 500, riskError.message);
  }

  // Clear cache projection untuk user ini karena data sudah berubah
  const clearedCount = clearUserCache(userId);
  console.log(`[CACHE CLEAR] Cleared ${clearedCount} cache entries untuk user ${userId}`);

  return {
    profile: profileResult.data,
    financial: financialResult.data,
    pension: pensionResult.data,
    risk,
  };
}
