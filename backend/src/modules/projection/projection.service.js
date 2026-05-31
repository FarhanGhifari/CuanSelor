import { supabase } from "../../config/supabase.js";
import { AppError } from "../../utils/app-error.js";
import { mapSectorToBps } from "./sector.mapper.js";
import { callFastAPICalculator } from "./fastapi-calculator.client.js";
import {
  generateCacheKey,
  generateUserProjectionCacheKey,
  getCachedProjection,
  setCachedProjection,
} from "../../utils/cache.js";

async function getStoredProjectionResult(userId, inputHash) {
  const { data, error } = await supabase
    .from("projection_results")
    .select("result_json, computed_at")
    .eq("user_id", userId)
    .eq("input_hash", inputHash)
    .maybeSingle();

  if (error) {
    console.warn(
      `[PROJECTION DB] Gagal membaca projection_results untuk user ${userId}: ${error.message}`,
    );
    return null;
  }

  return data;
}

async function saveProjectionResult(
  userId,
  inputHash,
  calculatorInput,
  result,
) {
  const { error } = await supabase.from("projection_results").upsert(
    {
      user_id: userId,
      input_hash: inputHash,
      calculator_input: calculatorInput,
      result_json: result,
      computed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,input_hash", ignoreDuplicates: false },
  );

  if (error) {
    console.warn(
      `[PROJECTION DB] Gagal menyimpan projection_results untuk user ${userId}: ${error.message}`,
    );
  }
}

export async function calculateProjection(userId, customPlanningAge = null) {
  const [financialResult, pensionResult, riskResult, userResult] =
    await Promise.all([
      supabase
        .from("financial_records")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("retirement_plans")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),
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
    throw new AppError(
      "Data belum lengkap. Silakan selesaikan onboarding terlebih dahulu.",
      400,
      {
        financial: !financial,
        pension: !pension,
        risk: !risk,
      },
    );
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
      ? Number(financial.expected_annual_return)
      : null,
    custom_planning_age: customPlanningAge
      ? Number(customPlanningAge)
      : pension.planning_age
        ? Number(pension.planning_age)
        : null,
    current_assets: Number(financial.cold_cash) || 0,
    annual_bonus_months: Number(financial.annual_bonus) || 1.0,
    replacement_ratio: Number(pension.post_retirement_lifestyle) / 100 || 0.7,
    has_health_insurance: riskAnswers.hasHealthInsurance || false,
    monthly_expense: null,
  };

  const inputHash = generateCacheKey(calculatorInput);
  const cacheKey = generateUserProjectionCacheKey(userId, inputHash);

  const cachedResult = getCachedProjection(cacheKey);
  if (cachedResult) {
    return {
      ...cachedResult,
      cached: true,
      source: "memory-cache",
      cacheKey,
      inputHash,
    };
  }

  const storedResult = await getStoredProjectionResult(userId, inputHash);
  if (storedResult?.result_json) {
    setCachedProjection(cacheKey, storedResult.result_json);

    return {
      ...storedResult.result_json,
      cached: true,
      source: "database",
      cacheKey,
      inputHash,
      computedAt: storedResult.computed_at,
    };
  }

  const result = await callFastAPICalculator(calculatorInput);

  if (result && result.user_profile) {
    result.user_profile.current_assets = calculatorInput.current_assets;
  }

  await saveProjectionResult(userId, inputHash, calculatorInput, result);
  setCachedProjection(cacheKey, result);

  return {
    ...result,
    cached: false,
    source: "fastapi",
    cacheKey,
    inputHash,
  };
}
