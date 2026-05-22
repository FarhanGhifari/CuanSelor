const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");

// GET /api/profile
// Get all user profile data (auth, financial, pension, risk)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user basic info from Better Auth table
    const { data: user, error: userErr } = await supabase
      .from('user')
      .select('name, email')
      .eq('id', userId)
      .single();

    // Fetch financial records
    const { data: financial } = await supabase
      .from("financial_records")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    // Fetch pension plans
    const { data: pension } = await supabase
      .from("retirement_plans")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    // Fetch risk profile (latest one)
    const { data: risk } = await supabase
      .from("risk_profiles")
      .select("*")
      .eq("user_id", userId)
      .order("assessed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return res.status(200).json({
      success: true,
      data: {
        personal: user || { name: req.user.name, email: req.user.email },
        financial: financial || null,
        pension: pension || null,
        risk: risk || null
      }
    });
  } catch (err) {
    console.error("[Profile GET] Error:", err);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data profil",
    });
  }
});

// POST /api/profile
// Save/update user onboarding data (financial, pension, risk, personal)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      fullName,
      age,
      gender,
      monthlyIncome,
      annualBonusMonths,
      monthlyExpense,
      savingsPercentage,
      currentSavings,
      totalDebt,
      retirementAge,
      lifestylePercent,
      riskProfile,
      riskAnswers,
      sector,
      hasHealthInsurance,
      depositRate,
      includePandemicRisk,
    } = req.body;

    // 0. Upsert profiles (personal data)
    // Calculate date_of_birth from age (approximate)
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - (age || 30);
    const dateOfBirth = `${birthYear}-01-01`; // Approximate to Jan 1st

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .upsert({
        id: userId, // profiles.id references auth.users(id)
        full_name: fullName || "User",
        gender: gender === "male" ? "Laki-laki" : "Perempuan",
        date_of_birth: dateOfBirth,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "id",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (profileErr) {
      console.error("[Profile POST] Profile error:", profileErr);
      // Don't fail if profiles table doesn't exist, continue with other tables
      console.warn("Skipping profiles table (might not exist yet)");
    }

    // 1. Upsert financial_records
    const { data: financial, error: financialErr } = await supabase
      .from("financial_records")
      .upsert({
        user_id: userId,
        monthly_income: monthlyIncome || 0,
        monthly_expenses: monthlyExpense || 0,
        saving_percentage: savingsPercentage || 0,
        cold_cash: currentSavings || 0,
        annual_bonus: annualBonusMonths || 0,
        expected_annual_return: depositRate || 4.5,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (financialErr) {
      console.error("[Profile POST] Financial error:", financialErr);
      return res.status(500).json({
        success: false,
        message: "Gagal menyimpan data finansial: " + financialErr.message,
      });
    }

    // 2. Upsert retirement_plans
    const { data: pension, error: pensionErr } = await supabase
      .from("retirement_plans")
      .upsert({
        user_id: userId,
        target_retirement_age: retirementAge || 55,
        post_retirement_lifestyle: lifestylePercent || 80,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id",
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (pensionErr) {
      console.error("[Profile POST] Pension error:", pensionErr);
      return res.status(500).json({
        success: false,
        message: "Gagal menyimpan data pensiun: " + pensionErr.message,
      });
    }

    // 3. Insert new risk_profiles (always create new, not update)
    const { data: risk, error: riskErr } = await supabase
      .from("risk_profiles")
      .insert({
        user_id: userId,
        risk_category: riskProfile || "moderate",
        answers: {
          ...riskAnswers,
          sector,
          hasHealthInsurance,
          includePandemicRisk,
          gender, // Store gender in risk_profiles too for easy access
          age,    // Store age in risk_profiles too
        },
        assessed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (riskErr) {
      console.error("[Profile POST] Risk error:", riskErr);
      return res.status(500).json({
        success: false,
        message: "Gagal menyimpan profil risiko: " + riskErr.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data berhasil disimpan",
      data: {
        profile,
        financial,
        pension,
        risk,
      },
    });
  } catch (err) {
    console.error("[Profile POST] Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Gagal menyimpan data profil",
    });
  }
});

module.exports = router;
