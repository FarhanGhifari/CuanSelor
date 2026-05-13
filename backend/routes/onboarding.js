const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");

// ── GET /api/onboarding/status ──────────────────────────────
// Cek status onboarding user (apakah sudah isi finansial & pensiun)
router.get("/status", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Cek record finansial
    const { data: finData } = await supabase
      .from("financial_records")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    // Cek record proyeksi pensiun
    const { data: retData } = await supabase
      .from("retirement_plans")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    const hasCompletedFinancial = !!finData;
    const hasCompletedPension = !!retData;

    return res.status(200).json({
      success: true,
      hasCompletedFinancial,
      hasCompletedPension,
      isFullyOnboarded: hasCompletedFinancial && hasCompletedPension,
    });
  } catch (err) {
    console.error("[Onboarding Status] Error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengecek status onboarding",
    });
  }
});

// ── POST /api/onboarding/financial ────────────────────────────
// Simpan data finansial user (Step 2)
router.post("/financial", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      monthlyIncome,
      monthlyExpense,
      annualBonusMonths,
      currentSavings,
      savingsPercentage,
    } = req.body;

    // Validasi field wajib
    if (
      monthlyIncome == null ||
      monthlyExpense == null ||
      annualBonusMonths == null ||
      currentSavings == null ||
      savingsPercentage == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    // Upsert ke financial_records (1 user = 1 record, UNIQUE constraint)
    const { data, error } = await supabase
      .from("financial_records")
      .upsert(
        {
          user_id: userId,
          monthly_income: Number(monthlyIncome),
          monthly_expenses: Number(monthlyExpense),
          annual_bonus: Number(annualBonusMonths),
          cold_cash: Number(currentSavings),
          saving_percentage: Number(savingsPercentage),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("[Onboarding Financial] Supabase error:", error);
      return res.status(500).json({
        success: false,
        message: "Gagal menyimpan data finansial",
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data finansial berhasil disimpan",
      data,
    });
  } catch (err) {
    console.error("[Onboarding Financial] Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ── POST /api/onboarding/pension ──────────────────────────────
// Simpan data proyeksi pensiun + risk profile (Step 3)
router.post("/pension", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      retirementAge,
      lifestylePercent,
      hasHealthInsurance,
      riskProfile,
      riskAnswers,
      sector,
      includePandemicRisk,
      depositRate,
    } = req.body;

    // Validasi field wajib
    if (
      retirementAge == null ||
      lifestylePercent == null ||
      riskProfile == null ||
      sector == null ||
      depositRate == null
    ) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    // 1. Upsert retirement_plans
    const { data: retirementData, error: retirementError } = await supabase
      .from("retirement_plans")
      .upsert(
        {
          user_id: userId,
          target_retirement_age: Number(retirementAge),
          post_retirement_lifestyle: Number(lifestylePercent),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (retirementError) {
      console.error("[Onboarding Pension] Supabase error:", retirementError);
      return res.status(500).json({
        success: false,
        message: "Gagal menyimpan data proyeksi pensiun",
        error: retirementError.message,
      });
    }

    // 2. Insert risk_profiles (history — bisa banyak assessment)
    const { error: riskError } = await supabase
      .from("risk_profiles")
      .insert({
        user_id: userId,
        answers: riskAnswers || {},
        risk_category: riskProfile,
        assessed_at: new Date().toISOString(),
      });

    if (riskError) {
      console.error("[Onboarding Pension] Risk profile error:", riskError);
      // Non-blocking — data pensiun sudah tersimpan
    }

    // 3. Update financial_records dengan deposit rate
    await supabase
      .from("financial_records")
      .update({
        expected_annual_return: Number(depositRate),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    return res.status(200).json({
      success: true,
      message: "Data proyeksi pensiun berhasil disimpan",
      data: retirementData,
    });
  } catch (err) {
    console.error("[Onboarding Pension] Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
