# Quick Start Guide — Dashboard Proyeksi Pensiun

## 🚀 Getting Started (5 Minutes)

### Prerequisites
- Node.js 18+ installed
- Python 3.8+ installed
- PostgreSQL (via Supabase)
- Git

---

## 📦 Installation

### 1. Clone & Install Dependencies

```bash
# Clone repository (jika belum)
git clone <repo-url>
cd CuanSelor

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install Python dependencies
cd ../streamlit-ds
pip install -r requirements.txt
```

---

### 2. Environment Setup

#### Backend `.env`
```bash
cd backend
# Create .env file
cat > .env << EOF
PORT=8000
NEXT_APP_URL=http://localhost:3000

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Better Auth
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
EOF
```

#### Frontend `.env.local`
```bash
cd ../frontend
# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ML_API_URL=http://localhost:8000

# Better Auth
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Supabase
DATABASE_URL=your_postgres_connection_string
EOF
```

---

### 3. Database Setup (Supabase)

Pastikan tabel-tabel berikut sudah ada:

```sql
-- Users table (dari Better Auth)
CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Financial records
CREATE TABLE IF NOT EXISTS financial_records (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
  monthly_income NUMERIC NOT NULL,
  monthly_expenses NUMERIC,
  saving_percentage NUMERIC,
  cold_cash NUMERIC DEFAULT 0,
  annual_bonus NUMERIC DEFAULT 1,
  expected_annual_return NUMERIC,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Retirement plans
CREATE TABLE IF NOT EXISTS retirement_plans (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
  target_retirement_age INTEGER NOT NULL,
  post_retirement_lifestyle NUMERIC DEFAULT 70,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Risk profiles
CREATE TABLE IF NOT EXISTS risk_profiles (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES "user"(id) ON DELETE CASCADE,
  risk_category TEXT NOT NULL,
  answers JSONB,
  assessed_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🏃 Running the Application

### Terminal 1: Backend
```bash
cd backend
npm start

# Expected output:
# 🚀 Server Backend berjalan di http://localhost:8000
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev

# Expected output:
# ▲ Next.js 16.2.4
# - Local: http://localhost:3000
```

### Terminal 3: Test Python Calculator (Optional)
```bash
cd streamlit-ds

# Test with sample data
echo '{
  "name": "Test User",
  "age": 30,
  "gender": "male",
  "monthly_salary": 10000000,
  "savings_rate": 0.2,
  "retirement_age": 55,
  "risk_profile": "moderate",
  "sector": "Rata-rata",
  "include_pandemic_risk": false,
  "custom_deposit_rate": null,
  "custom_planning_age": null,
  "current_assets": 0,
  "annual_bonus_months": 1,
  "replacement_ratio": 0.7,
  "has_health_insurance": false,
  "monthly_expense": null
}' | python run_calculator.py

# Expected: JSON output with projection data
```

---

## 🧪 Testing the Feature

### 1. Create Test User

```bash
# Navigate to http://localhost:3000/auth/register
# Register with:
# - Email: test@example.com
# - Password: Test123!
```

### 2. Complete Onboarding

```bash
# Navigate to http://localhost:3000/auth/onboarding
# Fill in:
# - Financial data (income, expenses, savings)
# - Retirement plans (target age, lifestyle)
# - Risk profile (questionnaire)
```

### 3. View Projection Dashboard

```bash
# Navigate to http://localhost:3000/dashboard/projection
# You should see:
# ✅ Hero banner with your name
# ✅ 4 metric cards
# ✅ Ruin probability gauge
# ✅ Scenario tabs
# ✅ Projection chart
# ✅ Portfolio allocation
# ✅ Sensitivity analysis
# ✅ Actionable insights
```

---

## 🐛 Troubleshooting

### Issue: "Route not found" 404

**Solution:**
```bash
# Check if backend is running
curl http://localhost:8000/

# Expected: {"message": "Selamat! API CUAN SELOR berhasil menyala."}
```

---

### Issue: "Data belum lengkap"

**Solution:**
- Complete onboarding at `/auth/onboarding`
- Ensure all 3 steps are completed:
  1. Financial data
  2. Retirement plans
  3. Risk profile

---

### Issue: Python error "ModuleNotFoundError"

**Solution:**
```bash
cd streamlit-ds
pip install -r requirements.txt

# Or install individually:
pip install numpy pandas scipy
```

---

### Issue: "No QueryClient set"

**Solution:**
- Already fixed in `LayoutWrapper.tsx`
- If still occurs, clear `.next` cache:
```bash
cd frontend
rm -rf .next
npm run dev
```

---

### Issue: Timeout (> 30 seconds)

**Possible causes:**
1. Python dependencies not installed
2. CSV data files missing
3. Large simulation size (10k iterations)

**Solution:**
```bash
# Check Python script manually
cd streamlit-ds
python run_calculator.py < sample_input.json

# If slow, reduce n_simulations temporarily:
# Edit src/calculator.py → n_simulations=1000
```

---

### Issue: Chart not rendering

**Solution:**
```bash
# Check if recharts is installed
cd frontend
npm list recharts

# If not found:
npm install recharts
```

---

## 📊 Sample API Requests

### Get Projection (with auth)

```bash
# Get auth token first (login via frontend)
# Then:

curl -X GET http://localhost:8000/api/projection \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user_profile": {
      "name": "Test User",
      "age": 30,
      "monthly_salary": 10000000,
      ...
    },
    "actuarial_summary": {
      "expected_death_age": 75,
      "planning_age_recommended": 85,
      ...
    },
    "projection": {
      "pessimistic_p10": { ... },
      "median_p50": { ... },
      "optimistic_p90": { ... }
    },
    "recommendations": { ... },
    "sensitivity": { ... },
    "actionable_insights": [ ... ]
  }
}
```

---

## 🎯 Quick Verification Checklist

After setup, verify:

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can register new user
- [ ] Can complete onboarding
- [ ] Can view dashboard
- [ ] Projection page loads without error
- [ ] All 8 components render
- [ ] Charts display correctly
- [ ] No console errors

---

## 📚 Next Steps

1. **Customize Design**
   - Edit colors in `tailwind.config.js`
   - Modify components in `features/projection/components/`

2. **Add Features**
   - Export to PDF
   - Compare projections over time
   - Interactive "What-if" scenarios

3. **Deploy**
   - Frontend: Vercel / Netlify
   - Backend: Railway / Render
   - Database: Supabase (already cloud)

---

## 🆘 Need Help?

**Documentation:**
- `IMPLEMENTATION_SUMMARY.md` - What was built
- `ARCHITECTURE_DIAGRAM.md` - How it works
- `TESTING_CHECKLIST.md` - How to test
- `frontend/src/features/projection/README.md` - Feature docs

**Common Commands:**
```bash
# Restart everything
pkill -f "node\|python"
cd backend && npm start &
cd frontend && npm run dev &

# Check logs
cd backend && npm start  # See backend logs
cd frontend && npm run dev  # See frontend logs

# Rebuild frontend
cd frontend
rm -rf .next
npm run build
```

---

**Last Updated:** 2026-05-22
**Status:** ✅ Ready to Use
