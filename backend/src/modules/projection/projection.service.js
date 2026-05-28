import { supabase } from "../../config/supabase.js";
import { AppError } from "../../utils/app-error.js";
import { mapSectorToBps } from "./sector.mapper.js";
import { callFastAPICalculator } from "./fastapi-calculator.client.js";
import { generateCacheKey, getCachedProjection, setCachedProjection } from "../../utils/cache.js";

export async function calculateProjection(userId) {
  const [financialResult, pensionResult, riskResult, userResult] = await Promise.all([
    supabase.from("financial_records").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("retirement_plans").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("risk_profiles")
      .select("*")
      .eq("user_id", userId)
      .order("assessed_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("user").select("name, email").eq("id", userId).single(),
  ]);

  const financial = financialResult.data;
  const pension = pensionResult.data;
  const risk = riskResult.data;
  const user = userResult.data;

  if (!financial || !pension || !risk) {
    throw new AppError("Data belum lengkap. Silakan selesaikan onboarding terlebih dahulu.", 400, {
      financial: !financial,
      pension: !pension,
      risk: !risk,
    });
  }

  const riskAnswers = risk.answers || {};

  const calculatorInput = {
    name: user?.name || "User",
    age: Number(riskAnswers.age || 30),
    gender: riskAnswers.gender || "male",
    monthly_salary: Number(financial.monthly_income) || 0,
    savings_rate: Number(financial.saving_percentage) / 100 || 0.2,
    retirement_age: Number(pension.target_retirement_age) || 55,
    risk_profile: (risk.risk_category || "moderate").toLowerCase(),
    sector: mapSectorToBps(riskAnswers.sector || "Rata-rata"),
    include_pandemic_risk: riskAnswers.includePandemicRisk || false,
    custom_deposit_rate: financial.expected_annual_return
      ? Number(financial.expected_annual_return) / 100
      : null,
    custom_planning_age: null,
    current_assets: Number(financial.cold_cash) || 0,
    annual_bonus_months: Number(financial.annual_bonus) || 1.0,
    replacement_ratio: Number(pension.post_retirement_lifestyle) / 100 || 0.7,
    has_health_insurance: riskAnswers.hasHealthInsurance || false,
  };

  // Debug logging untuk compare dengan Streamlit
  console.log(`[PROJECTION] Calculator Input for user ${userId}:`, JSON.stringify(calculatorInput, null, 2));

  // Generate cache key dari calculator input
  const cacheKey = generateCacheKey(calculatorInput);

  // Cek cache terlebih dahulu
  const cachedResult = getCachedProjection(cacheKey);
  if (cachedResult) {
    console.log(`[CACHE HIT] Projection untuk user ${userId} (key: ${cacheKey})`);
    return {
      ...cachedResult,
      cached: true,
      cacheKey,
    };
  }

  console.log(`[CACHE MISS] Menjalankan kalkulasi via FastAPI untuk user ${userId}`);

  // Jalankan kalkulasi via FastAPI
  const result = await callFastAPICalculator(calculatorInput);

  // Simpan ke cache dengan TTL 1 jam
  setCachedProjection(cacheKey, result);

  return {
    ...result,
    cached: false,
    cacheKey,
  };
}
