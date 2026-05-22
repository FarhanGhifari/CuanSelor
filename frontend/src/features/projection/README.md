# Projection Feature

Dashboard proyeksi pensiun terintegrasi dengan kalkulasi Monte Carlo dari Python backend.

## Arsitektur

```
User → Dashboard (/dashboard/projection)
         ↓
    useProjection hook (React Query)
         ↓
    projectionService.getProjection()
         ↓
    Backend Express (/api/projection)
         ↓
    Python child_process (run_calculator.py)
         ↓
    RetirementCalculator (Monte Carlo 10k iterasi)
```

## Komponen

### Hooks
- `useProjection.ts` - React Query hook untuk fetch data proyeksi

### Services
- `projection.service.ts` - API client untuk endpoint projection

### Components
- `ProjectionHero.tsx` - Hero banner dengan status badge
- `KeyMetricCards.tsx` - 4 kartu metrik utama
- `RuinGauge.tsx` - Semi-circle gauge untuk ruin probability
- `ScenarioTabs.tsx` - Tab P10/P50/P90 dengan detail
- `FundProjectionChart.tsx` - Area chart proyeksi dana
- `PortfolioAllocation.tsx` - Donut chart + tabel alokasi
- `SensitivityCards.tsx` - Analisis sensitivitas "Bagaimana jika..."
- `InsightsList.tsx` - Daftar rekomendasi aksi

### Types
- `projection.types.ts` - TypeScript types matching Python CalculatorOutput

### Utils
- `format.ts` - Helper functions untuk format currency, percentage, number

## Usage

```tsx
import { useProjection } from "@/features/projection/hooks/useProjection";

function MyComponent() {
  const { data, isLoading, error } = useProjection();
  
  if (isLoading) return <Loader />;
  if (error) return <Error message={error.message} />;
  
  return <ProjectionDashboard data={data} />;
}
```

## Data Flow

1. User mengakses `/dashboard/projection`
2. `useProjection` hook fetch data dari backend
3. Backend mengambil data user dari Supabase (financial_records, retirement_plans, risk_profiles)
4. Backend menjalankan Python script via `child_process.spawn()`
5. Python script menjalankan Monte Carlo simulation (10.000 iterasi)
6. Output JSON dikembalikan ke frontend
7. Komponen-komponen merender visualisasi

## Dependencies

- `@tanstack/react-query` - Data fetching & caching
- `recharts` - Charting library
- `framer-motion` - Animations
- `lucide-react` - Icons

## Backend Requirements

- Python 3.8+
- numpy, scipy, pandas
- Dataset CSV di `streamlit-ds/data/`
- Module `src.calculator.RetirementCalculator`
