const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");
const supabase = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");

// ── GET /api/projection ─────────────────────────────────────
// Menghitung proyeksi pensiun user menggunakan Monte Carlo simulation
// via Python child process (streamlit-ds/run_calculator.py)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch semua data user dari Supabase secara paralel
    const [financialRes, pensionRes, riskRes, userRes] = await Promise.all([
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
      supabase
        .from("user")
        .select("name, email")
        .eq("id", userId)
        .single(),
    ]);

    const financial = financialRes.data;
    const pension = pensionRes.data;
    const risk = riskRes.data;
    const user = userRes.data;

    // 2. Validasi: semua data harus ada
    if (!financial || !pension || !risk) {
      return res.status(400).json({
        success: false,
        message: "Data belum lengkap. Silakan selesaikan onboarding terlebih dahulu.",
        missing: {
          financial: !financial,
          pension: !pension,
          risk: !risk,
        },
      });
    }

    // 3. Construct payload untuk Python calculator
    //    Mapping field database → field UserProfile Python
    const riskAnswers = risk.answers || {};
    const sector = riskAnswers.sector || "Rata-rata";
    const hasHealthInsurance = riskAnswers.hasHealthInsurance || false;
    const includePandemicRisk = riskAnswers.includePandemicRisk || false;

    const calculatorInput = {
      name: user?.name || "User",
      age: calculateAge(user),
      gender: riskAnswers.gender || "male",
      monthly_salary: Number(financial.monthly_income) || 0,
      savings_rate: Number(financial.saving_percentage) / 100 || 0.20,
      retirement_age: Number(pension.target_retirement_age) || 55,
      risk_profile: (risk.risk_category || "moderate").toLowerCase(),
      sector: sector,
      include_pandemic_risk: includePandemicRisk,
      custom_deposit_rate: financial.expected_annual_return
        ? Number(financial.expected_annual_return) / 100
        : null,
      custom_planning_age: null,
      current_assets: Number(financial.cold_cash) || 0,
      annual_bonus_months: Number(financial.annual_bonus) || 1.0,
      replacement_ratio: Number(pension.post_retirement_lifestyle) / 100 || 0.70,
      has_health_insurance: hasHealthInsurance,
      monthly_expense: Number(financial.monthly_expenses) || null,
    };

    // 4. Spawn Python child process
    const scriptDir = path.resolve(__dirname, "../../streamlit-ds");
    const scriptPath = path.join(scriptDir, "run_calculator.py");

    const result = await runPythonCalculator(scriptPath, scriptDir, calculatorInput);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("[Projection GET] Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Gagal menghitung proyeksi pensiun",
    });
  }
});

// ── Helper: Run Python Calculator ───────────────────────────
function runPythonCalculator(scriptPath, cwd, inputPayload) {
  return new Promise((resolve, reject) => {
    const py = spawn("python", [scriptPath], {
      cwd,
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf-8");
    });

    py.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf-8");
    });

    py.on("close", (code) => {
      if (code !== 0) {
        console.error("[Python stderr]:", stderr);
        return reject(
          new Error(`Kalkulasi gagal (exit code ${code}): ${stderr}`)
        );
      }

      try {
        // stdout bisa mengandung warning lines sebelum JSON
        // Cari baris yang dimulai dengan '{' sebagai awal JSON
        const jsonStart = stdout.indexOf("{");
        if (jsonStart === -1) {
          return reject(new Error("Output Python tidak mengandung JSON valid"));
        }
        const jsonStr = stdout.substring(jsonStart);
        const parsed = JSON.parse(jsonStr);
        resolve(parsed);
      } catch (parseErr) {
        console.error("[Python stdout]:", stdout);
        reject(new Error(`Gagal parse output JSON: ${parseErr.message}`));
      }
    });

    py.on("error", (err) => {
      reject(new Error(`Gagal menjalankan Python: ${err.message}`));
    });

    // Send input payload via stdin
    py.stdin.write(JSON.stringify(inputPayload));
    py.stdin.end();

    // Safety timeout: 30 detik
    setTimeout(() => {
      py.kill("SIGTERM");
      reject(new Error("Kalkulasi timeout (>30 detik)"));
    }, 30000);
  });
}

// ── Helper: Calculate age from user data ────────────────────
function calculateAge(user) {
  // Default age jika tidak bisa dihitung
  if (!user) return 30;
  // Jika ada date_of_birth di profiles table
  // Untuk sementara, default 30 tahun (bisa diupdate nanti)
  return 30;
}

module.exports = router;
