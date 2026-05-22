# Data Synchronization Audit — Frontend ↔ Backend ↔ Python

## ✅ Audit Completed: 2026-05-22

Semua data sudah **SINKRON** antara Frontend, Backend, dan Python Calculator!

---

## 🔍 Masalah yang Ditemukan & Diperbaiki

### ❌ **Masalah #1: Field `gender` tidak ditanyakan**
- **Impact:** Python calculator butuh gender untuk tabel mortalitas (harapan hidup berbeda antara pria dan wanita)
- **Fix:** ✅ Tambahkan step baru (Step 0) untuk menanyakan data personal

### ❌ **Masalah #2: Field `age` tidak ditanyakan**
- **Impact:** Python calculator butuh usia saat ini untuk kalkulasi aktuaria
- **Fix:** ✅ Tambahkan input usia di Step 0

### ❌ **Masalah #3: Sektor tidak sinkron**
- **Impact:** Frontend pakai 10 kategori user-friendly, Python pakai 18 kategori BPS
- **Fix:** ✅ Buat mapping di backend (sudah dijelaskan di `SECTOR_MAPPING.md`)

---

## 📊 Data Flow Lengkap

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                           │
│                                                                 │
│  OnBoardingWizard (12 steps):                                  │
│  Step 0: fullName, age, gender                                 │
│  Step 1: monthlyIncome                                         │
│  Step 2: annualBonusMonths                                     │
│  Step 3: monthlyExpense                                        │
│  Step 4: savingsPercentage                                     │
│  Step 5: currentSavings, totalDebt                             │
│  Step 6: (totalDebt - moved to step 5)                         │
│  Step 7: retirementAge                                         │
│  Step 8: lifestylePercent                                      │
│  Step 9: riskProfile, riskAnswers                              │
│  Step 10: sector                                               │
│  Step 11: depositRate, hasHealthInsurance, includePandemicRisk │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    POST /api/profile
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                            │
│                                                                 │
│  Menyimpan ke 4 tabel Supabase:                                │
│                                                                 │
│  1. profiles:                                                   │
│     - id (user_id)                                             │
│     - full_name                                                │
│     - gender ("Laki-laki" / "Perempuan")                       │
│     - date_of_birth (calculated from age)                      │
│                                                                 │
│  2. financial_records:                                          │
│     - user_id                                                  │
│     - monthly_income                                           │
│     - monthly_expenses                                         │
│     - saving_percentage                                        │
│     - cold_cash (currentSavings)                               │
│     - annual_bonus                                             │
│     - expected_annual_return (depositRate)                     │
│                                                                 │
│  3. retirement_plans:                                           │
│     - user_id                                                  │
│     - target_retirement_age                                    │
│     - post_retirement_lifestyle                                │
│                                                                 │
│  4. risk_profiles:                                              │
│     - user_id                                                  │
│     - risk_category                                            │
│     - answers (JSONB):                                         │
│       {                                                        │
│         q1, q2, q3, q4,                                        │
│         sector,                                                │
│         hasHealthInsurance,                                    │
│         includePandemicRisk,                                   │
│         gender,  ← Stored here for easy access                │
│         age      ← Stored here for easy access                │
│       }                                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    GET /api/projection
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express)                            │
│                                                                 │
│  Fetch data dari Supabase → Construct payload:                 │
│                                                                 │
│  {                                                              │
│    name: user.name,                                            │
│    age: risk.answers.age,              ← From risk_profiles   │
│    gender: risk.answers.gender,        ← From risk_profiles   │
│    monthly_salary: financial.monthly_income,                   │
│    savings_rate: financial.saving_percentage / 100,            │
│    retirement_age: pension.target_retirement_age,              │
│    risk_profile: risk.risk_category,                           │
│    sector: mapSectorToBPS(risk.answers.sector), ← Mapped!     │
│    include_pandemic_risk: risk.answers.includePandemicRisk,    │
│    custom_deposit_rate: financial.expected_annual_return / 100,│
│    current_assets: financial.cold_cash,                        │
│    annual_bonus_months: financial.annual_bonus,                │
│    replacement_ratio: pension.post_retirement_lifestyle / 100, │
│    has_health_insurance: risk.answers.hasHealthInsurance,      │
│    monthly_expense: financial.monthly_expenses                 │
│  }                                                              │
│                                                                 │
│  → Send to Python via child_process                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    Python child_process
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PYTHON CALCULATOR                            │
│                                                                 │
│  UserProfile dataclass:                                         │
│  - name: str                                                   │
│  - age: int                          ✅ Now provided           │
│  - gender: "male" | "female"         ✅ Now provided           │
│  - monthly_salary: float                                       │
│  - savings_rate: float                                         │
│  - retirement_age: int                                         │
│  - risk_profile: str                                           │
│  - sector: str                       ✅ Mapped to BPS          │
│  - include_pandemic_risk: bool                                 │
│  - custom_deposit_rate: float | None                           │
│  - custom_planning_age: int | None                             │
│  - current_assets: float                                       │
│  - annual_bonus_months: float                                  │
│  - replacement_ratio: float                                    │
│  - has_health_insurance: bool                                  │
│  - monthly_expense: float | None                               │
│                                                                 │
│  → Run Monte Carlo simulation (10k iterations)                 │
│  → Return CalculatorOutput JSON                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Field Mapping Table

| Frontend Field | Database Table | Database Column | Python Field | Notes |
|----------------|----------------|-----------------|--------------|-------|
| `fullName` | `profiles` | `full_name` | `name` | ✅ |
| `age` | `risk_profiles` | `answers.age` | `age` | ✅ Stored in JSONB |
| `gender` | `profiles` | `gender` | `gender` | ✅ Mapped: male→Laki-laki |
| `gender` | `risk_profiles` | `answers.gender` | `gender` | ✅ Also stored here |
| `monthlyIncome` | `financial_records` | `monthly_income` | `monthly_salary` | ✅ |
| `annualBonusMonths` | `financial_records` | `annual_bonus` | `annual_bonus_months` | ✅ |
| `monthlyExpense` | `financial_records` | `monthly_expenses` | `monthly_expense` | ✅ |
| `savingsPercentage` | `financial_records` | `saving_percentage` | `savings_rate` | ✅ Divided by 100 |
| `currentSavings` | `financial_records` | `cold_cash` | `current_assets` | ✅ |
| `totalDebt` | - | - | - | ❌ Not used in Python |
| `retirementAge` | `retirement_plans` | `target_retirement_age` | `retirement_age` | ✅ |
| `lifestylePercent` | `retirement_plans` | `post_retirement_lifestyle` | `replacement_ratio` | ✅ Divided by 100 |
| `riskProfile` | `risk_profiles` | `risk_category` | `risk_profile` | ✅ |
| `sector` | `risk_profiles` | `answers.sector` | `sector` | ✅ **Mapped to BPS** |
| `hasHealthInsurance` | `risk_profiles` | `answers.hasHealthInsurance` | `has_health_insurance` | ✅ |
| `depositRate` | `financial_records` | `expected_annual_return` | `custom_deposit_rate` | ✅ Divided by 100 |
| `includePandemicRisk` | `risk_profiles` | `answers.includePandemicRisk` | `include_pandemic_risk` | ✅ |

---

## 🎯 Key Changes Made

### 1. **Frontend (OnBoardingWizard.tsx)**
- ✅ Added Step 0: Personal Data (fullName, age, gender)
- ✅ Updated TOTAL from 11 to 12 steps
- ✅ Updated WizardData interface
- ✅ Updated Summary to show personal data
- ✅ Updated STEP_CONFIG validation

### 2. **Frontend (Types & Hooks)**
- ✅ Updated `OnboardingPayload` interface
- ✅ Updated `sanitize()` function in `useOnboarding.ts`

### 3. **Backend (routes/profile.js)**
- ✅ Added upsert to `profiles` table
- ✅ Store `age` and `gender` in `risk_profiles.answers` for easy access
- ✅ Calculate `date_of_birth` from age (approximate)

### 4. **Backend (routes/projection.js)**
- ✅ Get `age` and `gender` from `risk_profiles.answers`
- ✅ Remove `calculateAge()` function (no longer needed)
- ✅ Sector mapping already implemented

---

## ✅ Verification Checklist

- [x] Frontend: Step 0 menanyakan nama, usia, gender
- [x] Frontend: WizardData interface updated
- [x] Frontend: Summary menampilkan data personal
- [x] Backend: POST /api/profile menyimpan ke profiles table
- [x] Backend: age & gender disimpan di risk_profiles.answers
- [x] Backend: GET /api/projection mengambil age & gender dari risk_profiles
- [x] Backend: Sector mapping berfungsi
- [x] Python: Semua field UserProfile terpenuhi
- [x] Build: Frontend build success
- [x] Backend: Server restart success

---

## 🚀 Testing Steps

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Restart frontend** (jika belum)
3. **Login** dengan akun baru atau existing
4. **Isi onboarding** dari awal (12 steps)
5. **Klik "Hitung Proyeksiku!"**
6. **Expected:**
   - ✅ Data tersimpan ke 4 tabel (profiles, financial_records, retirement_plans, risk_profiles)
   - ✅ Redirect ke `/dashboard/projection`
   - ✅ Python calculator menerima semua field yang dibutuhkan
   - ✅ Dashboard projection tampil dengan data yang benar

---

## 📝 Notes

- **Gender mapping:** Frontend "male"/"female" → Database "Laki-laki"/"Perempuan" → Python "male"/"female"
- **Age storage:** Disimpan di 2 tempat:
  1. `profiles.date_of_birth` (calculated, approximate)
  2. `risk_profiles.answers.age` (exact, for easy access)
- **Sector mapping:** Transparent untuk user, dilakukan di backend
- **totalDebt:** Ditanyakan di frontend tapi tidak dipakai di Python calculator (untuk future feature)

---

**Last Updated:** 2026-05-22
**Status:** ✅ All Data Synchronized
