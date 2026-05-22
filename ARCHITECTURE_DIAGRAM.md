# Architecture Diagram — Dashboard Proyeksi Pensiun

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                 │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Next.js Frontend (http://localhost:3000)                  │    │
│  │                                                             │    │
│  │  /dashboard/projection/page.tsx                            │    │
│  │         ↓                                                   │    │
│  │  useProjection() hook (React Query)                        │    │
│  │         ↓                                                   │    │
│  │  projectionService.getProjection()                         │    │
│  │         ↓                                                   │    │
│  │  GET /api/projection + Auth Token                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                           ↓                                          │
└───────────────────────────┼──────────────────────────────────────────┘
                            ↓
                    [HTTP Request]
                            ↓
┌───────────────────────────┼──────────────────────────────────────────┐
│                           ↓                                          │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Express Backend (http://localhost:8000)                   │    │
│  │                                                             │    │
│  │  routes/projection.js                                      │    │
│  │         ↓                                                   │    │
│  │  1. authenticateToken() middleware                         │    │
│  │  2. Fetch user data from Supabase:                         │    │
│  │     - financial_records                                    │    │
│  │     - retirement_plans                                     │    │
│  │     - risk_profiles                                        │    │
│  │  3. Construct UserProfile JSON                             │    │
│  │  4. spawn("python", ["run_calculator.py"])                 │    │
│  │  5. Send JSON via stdin                                    │    │
│  │  6. Read JSON from stdout                                  │    │
│  │  7. Return to frontend                                     │    │
│  └────────────────────────────────────────────────────────────┘    │
│                           ↓                                          │
│                    [child_process]                                   │
│                           ↓                                          │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Python Script (streamlit-ds/run_calculator.py)           │    │
│  │                                                             │    │
│  │  1. Read JSON from stdin                                   │    │
│  │  2. Parse to UserProfile dataclass                         │    │
│  │  3. Initialize RetirementCalculator(n_simulations=10000)   │    │
│  │  4. Run Monte Carlo simulation:                            │    │
│  │     - Actuarial analysis (mortality tables)                │    │
│  │     - Inflation modeling (Ornstein-Uhlenbeck)              │    │
│  │     - Investment returns (historical data)                 │    │
│  │     - Portfolio allocation (glide path)                    │    │
│  │     - Stress testing (crisis scenarios)                    │    │
│  │     - Sensitivity analysis                                 │    │
│  │  5. Generate CalculatorOutput JSON                         │    │
│  │  6. Write JSON to stdout                                   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                      Supabase Database                               │
│                                                                      │
│  Tables:                                                             │
│  - user (id, name, email)                                           │
│  - financial_records (user_id, monthly_income, monthly_expenses,    │
│                       saving_percentage, cold_cash, annual_bonus)   │
│  - retirement_plans (user_id, target_retirement_age,                │
│                      post_retirement_lifestyle)                     │
│  - risk_profiles (user_id, risk_category, answers, assessed_at)    │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Sequence

```
┌──────┐         ┌──────────┐         ┌─────────┐         ┌────────┐
│ User │         │ Frontend │         │ Backend │         │ Python │
└──┬───┘         └────┬─────┘         └────┬────┘         └───┬────┘
   │                  │                    │                   │
   │ 1. Navigate to   │                    │                   │
   │ /dashboard/      │                    │                   │
   │ projection       │                    │                   │
   ├─────────────────>│                    │                   │
   │                  │                    │                   │
   │                  │ 2. useProjection() │                   │
   │                  │    hook triggered  │                   │
   │                  │                    │                   │
   │                  │ 3. GET /api/       │                   │
   │                  │    projection      │                   │
   │                  │    + Auth Token    │                   │
   │                  ├───────────────────>│                   │
   │                  │                    │                   │
   │                  │                    │ 4. Verify token   │
   │                  │                    │                   │
   │                  │                    │ 5. Query Supabase │
   │                  │                    │    (financial,    │
   │                  │                    │     pension,      │
   │                  │                    │     risk data)    │
   │                  │                    │                   │
   │                  │                    │ 6. Spawn Python   │
   │                  │                    │    child process  │
   │                  │                    ├──────────────────>│
   │                  │                    │                   │
   │                  │                    │ 7. Send JSON      │
   │                  │                    │    via stdin      │
   │                  │                    ├──────────────────>│
   │                  │                    │                   │
   │                  │                    │                   │ 8. Parse input
   │                  │                    │                   │
   │                  │                    │                   │ 9. Run Monte
   │                  │                    │                   │    Carlo (10k)
   │                  │                    │                   │
   │                  │                    │                   │ 10. Calculate
   │                  │                    │                   │     projections
   │                  │                    │                   │
   │                  │                    │ 11. JSON output   │
   │                  │                    │     via stdout    │
   │                  │                    │<──────────────────┤
   │                  │                    │                   │
   │                  │ 12. Return JSON    │                   │
   │                  │     response       │                   │
   │                  │<───────────────────┤                   │
   │                  │                    │                   │
   │ 13. Render       │                    │                   │
   │     dashboard    │                    │                   │
   │     components   │                    │                   │
   │<─────────────────┤                    │                   │
   │                  │                    │                   │
```

---

## 🗂️ File Structure

```
CuanSelor/
├── backend/
│   ├── index.js                    # Express app entry point
│   ├── routes/
│   │   └── projection.js           # ✅ Projection endpoint
│   ├── middleware/
│   │   └── auth.js                 # JWT authentication
│   └── config/
│       └── supabase.js             # Supabase client
│
├── streamlit-ds/
│   ├── run_calculator.py           # ✅ CLI script for calculator
│   ├── src/
│   │   ├── calculator.py           # RetirementCalculator class
│   │   ├── actuarial.py            # Mortality tables
│   │   ├── inflation.py            # O-U inflation model
│   │   └── investment.py           # Portfolio returns
│   └── data/
│       ├── mortality_tables.csv
│       ├── inflation_history.csv
│       └── investment_returns.csv
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   └── dashboard/
    │   │       └── projection/
    │   │           └── page.tsx    # ✅ Main projection page
    │   │
    │   ├── features/
    │   │   └── projection/
    │   │       ├── components/     # ✅ 8 UI components
    │   │       │   ├── ProjectionHero.tsx
    │   │       │   ├── KeyMetricCards.tsx
    │   │       │   ├── RuinGauge.tsx
    │   │       │   ├── ScenarioTabs.tsx
    │   │       │   ├── FundProjectionChart.tsx
    │   │       │   ├── PortfolioAllocation.tsx
    │   │       │   ├── SensitivityCards.tsx
    │   │       │   └── InsightsList.tsx
    │   │       │
    │   │       ├── hooks/
    │   │       │   └── useProjection.ts    # ✅ React Query hook
    │   │       │
    │   │       ├── services/
    │   │       │   └── projection.service.ts # ✅ API client
    │   │       │
    │   │       ├── types/
    │   │       │   └── projection.types.ts   # ✅ TypeScript types
    │   │       │
    │   │       └── utils/
    │   │           └── format.ts             # ✅ Format helpers
    │   │
    │   └── components/
    │       └── layout/
    │           └── LayoutWrapper.tsx         # ✅ QueryClientProvider
    │
    └── package.json
```

---

## 🔄 State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    React Query Cache                        │
│                                                             │
│  Query Key: ["projection"]                                 │
│  Stale Time: 5 minutes                                     │
│  GC Time: 10 minutes                                       │
│  Retry: 2 times                                            │
│                                                             │
│  States:                                                    │
│  - isLoading: true/false                                   │
│  - isError: true/false                                     │
│  - data: CalculatorOutput | undefined                      │
│  - error: Error | null                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
ProjectionPage
├── ProjectionHero
│   ├── Status Badge (On Track / Perlu Perhatian)
│   └── Summary Text
│
├── KeyMetricCards (Grid 4 cards)
│   ├── Dana saat Pensiun
│   ├── Kapasitas Tarik/bulan
│   ├── Durasi Pensiun
│   └── Tabungan Bulanan
│
├── Grid (2 columns)
│   ├── RuinGauge
│   │   ├── SVG Semi-circle
│   │   ├── Percentage Text
│   │   └── Status Badge
│   │
│   └── ScenarioTabs
│       ├── Tab Buttons (P10/P50/P90)
│       └── Scenario Details
│
├── FundProjectionChart
│   └── Recharts AreaChart
│       ├── Pesimis Line
│       ├── Median Line
│       └── Optimis Line
│
├── PortfolioAllocation
│   ├── Recharts PieChart (Donut)
│   ├── Allocation Table
│   └── Instruments List
│
├── SensitivityCards (Grid 3 cards)
│   ├── Inflasi +1%
│   ├── Pensiun ditunda 3 tahun
│   └── Nabung +10%
│
└── InsightsList
    └── Numbered Recommendations
```

---

## 🔐 Security Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
│                                                              │
│  1. User login → Better Auth generates JWT token            │
│  2. Token stored in httpOnly cookie                         │
│  3. Frontend sends request with cookie                      │
│  4. Backend middleware verifies token:                      │
│     - Check signature                                       │
│     - Check expiration                                      │
│     - Extract user_id                                       │
│  5. If valid → proceed to route handler                     │
│  6. If invalid → return 401 Unauthorized                    │
│                                                              │
│  Route Protection:                                           │
│  - /api/projection → authenticateToken middleware           │
│  - User can only access their own data                      │
│  - SQL injection prevented by Supabase parameterized queries│
│  - Command injection prevented by JSON-only input to Python │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## ⚡ Performance Optimizations

```
┌──────────────────────────────────────────────────────────────┐
│                    Performance Strategy                      │
│                                                              │
│  Frontend:                                                   │
│  - React Query caching (5 min stale time)                   │
│  - Lazy loading components (code splitting)                 │
│  - Framer Motion optimized animations                       │
│  - Recharts virtualization for large datasets              │
│                                                              │
│  Backend:                                                    │
│  - Parallel Supabase queries (Promise.all)                  │
│  - Python child process timeout (30 sec)                    │
│  - JSON streaming for large outputs                         │
│                                                              │
│  Python:                                                     │
│  - NumPy vectorized operations                              │
│  - Pre-loaded CSV data (cached in memory)                   │
│  - Efficient Monte Carlo sampling                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚨 Error Handling

```
┌──────────────────────────────────────────────────────────────┐
│                    Error Handling Strategy                   │
│                                                              │
│  Frontend:                                                   │
│  - Loading state: Spinner + text                            │
│  - Error state: Icon + message + action button              │
│  - Empty state: Placeholder + CTA                           │
│  - Network error: Retry mechanism (max 2)                   │
│                                                              │
│  Backend:                                                    │
│  - 400: Missing/invalid data → user-friendly message        │
│  - 401: Unauthorized → redirect to login                    │
│  - 500: Server error → log + generic message                │
│  - Timeout: Kill Python process + return error              │
│                                                              │
│  Python:                                                     │
│  - Try-catch all exceptions                                 │
│  - Write errors to stderr (not stdout)                      │
│  - Exit code 1 on error                                     │
│  - UTF-8 encoding errors handled                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

**Last Updated:** 2026-05-22
