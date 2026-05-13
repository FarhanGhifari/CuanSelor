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

module.exports = router;
