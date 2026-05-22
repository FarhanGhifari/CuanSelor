# Dashboard Proyeksi Pensiun — Redesign & Kalkulasi Terintegrasi

Mengintegrasikan seluruh logika perhitungan pensiun dari aplikasi Streamlit (Monte Carlo, aktuaria, inflasi O-U, investasi, stress testing) ke dalam dashboard Next.js CuanSelor, dengan desain yang premium, hangat, dan tidak terasa "AI-generated".

## Arsitektur Ringkas

```
User → Onboarding (sudah ada) → data disimpan di Supabase
                                       ↓
                              Dashboard /dashboard (page.tsx)
                                       ↓
                             Backend Express (api/projection)
                                       ↓
                  Menghitung via child_process.spawn() Python script
                         (streamlit-ds/run_calculator.py)
```

> [!IMPORTANT]
> **Keputusan arsitektur kunci:** Logika kalkulasi Python (Monte Carlo 10.000 iterasi, numpy, scipy) **tidak bisa** diport ke JavaScript/TypeScript secara realistis karena bergantung pada numpy, scipy.stats, dan dataset CSV lokal. Oleh karena itu, kita akan menjalankan script Python lokal secara on-demand menggunakan `child_process.spawn` di Express. Ini meminimalkan setup server tambahan dan memisahkan tugas dari tim AI (folder `ai-service/` yang digunakan untuk profile risk & chat advisor tidak akan kita ganggu).

## Open Questions

> [!IMPORTANT]
> 1. **Data user:** Apakah tabel Supabase sudah di-create dan ada datanya? Saya perlu memastikan field `user_id`, `monthly_income`, `retirement_age`, dsb. sudah tersedia.
> 2. **Charting library:** Saya berencana menggunakan **Recharts** (ringan, React-native) untuk grafik proyeksi dana pensiun. Atau apakah Anda prefer library lain?

---

## Proposed Changes

### 1. Integration Script: Python Calculator Runner

#### [NEW] [run_calculator.py](file:///d:/KULIAH/MBKM/Capstone%20Project/CuanSelor/streamlit-ds/run_calculator.py)
- Script CLI yang menerima user profile JSON melalui `stdin`, menjalankan simulasi `RetirementCalculator` dengan data tersebut, lalu memuntahkan output JSON ke `stdout`.
- Menggunakan engine bawaan yang dibuat Tim Data Scientist di folder `streamlit-ds/src`.

---

### 2. Backend Express: Projection Calculator Integration

#### [MODIFY] [index.js](file:///d:/KULIAH/MBKM/Capstone%20Project/CuanSelor/backend/index.js)
- Tambahkan route `POST /api/profile` (untuk menyimpan onboarding data — fix error "Route not found" 404)
- Tambahkan route `GET /api/projection` untuk mengambil hasil kalkulasi proyeksi pensiun user secara real-time dengan cara:
  1. Mengambil parameter profil & keuangan dari Supabase (`financial_records`, `retirement_plans`, `risk_profiles`).
  2. Menjalankan Python child process (`run_calculator.py`) dengan input tersebut.
  3. Mengembalikan output JSON dari model data scientist ke frontend Next.js.

#### [NEW] `backend/routes/projection.js`
- Route handler untuk kalkulasi proyeksi pensiun via child_process Python.

---

### 3. Frontend Dashboard: Redesign Total

Desain dashboard baru akan terdiri dari **7 section utama** yang mengikuti alur storytelling Streamlit, tapi dengan UX premium dan warm:

---

#### Section Layout (Desktop: 2-3 columns, Mobile: stacked)

```
┌─────────────────────────────────────────────────────────────┐
│  1. HERO BANNER — "Proyeksi Pensiunmu"                      │
│  Ilustrasi sunset/pantai + nama user + summary 1 baris      │
│  Badge: On Track ✓ / Perlu Perhatian ⚡                     │
├─────────────────────────────────────────────────────────────┤
│  2. KEY METRICS (3-4 cards)                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Dana saat │ │Kapasitas │ │Durasi    │ │Tabungan  │       │
│  │Pensiun   │ │Tarik/bln │ │Pensiun   │ │Bulanan   │       │
│  │Rp 2.9M   │ │Rp 8.6jt  │ │41 tahun  │ │Rp 1.6jt  │       │
│  │ (Median) │ │ (Real)   │ │ (P90)    │ │ (20%)    │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
├─────────────────────────────────────────────────────────────┤
│  3. RUIN PROBABILITY — Gauge visual besar                    │
│  Lingkaran besar di tengah + label + penjelasan bahasa       │
│  sederhana: "Peluang dana habis sebelum usia XX"             │
│  Warna dinamis: hijau (<15%) → kuning (15-40%) → merah (>40%)│
├──────────────────────┬──────────────────────────────────────┤
│  4. SKENARIO P10/    │  5. GRAFIK PROYEKSI                  │
│     P50/P90          │  Line chart: Usia vs Dana             │
│  3 kartu vertikal    │  3 garis: Pesimis / Median / Optimis │
│  dengan tab switch   │  Area fill gradient                   │
│  Detail per skenario │  Animated on scroll                   │
├──────────────────────┴──────────────────────────────────────┤
│  6. ALOKASI PORTOFOLIO                                       │
│  Donut chart + tabel instrumen                               │
│  Deposito, ORI/SBN, RD Pasar Uang, RD Saham, dll.          │
│  Profil efektif + Glide Path status                         │
├─────────────────────────────────────────────────────────────┤
│  7. STRESS TESTING                                           │
│  4 kartu krisis horizontal (Krismon 98, Covid, Inflasi, dst) │
│  Setiap kartu: nama krisis + ruin prob + impact bar          │
│  Worst case highlight merah di bawah                         │
├─────────────────────────────────────────────────────────────┤
│  8. SENSITIVITY ANALYSIS                                     │
│  "Bagaimana jika..." cards:                                  │
│  - Inflasi naik 1%  → dana -11.7%                           │
│  - Pensiun ditunda 3 thn → dana +28%                        │
│  - Nabung +10% → dana +46.2%                                │
├─────────────────────────────────────────────────────────────┤
│  9. ACTIONABLE INSIGHTS                                      │
│  Numbered list dgn ilustrasi kecil (bukan emoji AI)          │
│  Rekomendasi konkret dari engine                             │
└─────────────────────────────────────────────────────────────┘
```

---

#### Design Philosophy — "Warm Financial Storytelling"

| Aspek | Pendekatan |
|-------|-----------|
| **Warna** | Tetap mengikuti token CuanSelor: emerald `#006241`/`#00754A` + parchment `#f2f0eb`. Aksen: soft coral `#FF6B6B` untuk danger, ocean blue `#4EA8DE` untuk info |
| **Tipografi** | SoDoSans / Inter. Angka besar menggunakan tabular-nums untuk alignment |
| **Ilustrasi** | SVG custom hand-drawn style: sunset, rumah kecil, pohon tumbuh, payung hujan (untuk stress test). **Bukan emoji AI**. Menggunakan `generate_image` untuk aset kunci |
| **Card style** | Rounded-3xl, border hairline `#e7e7e7`, shadow ambient sangat tipis. Hover: lift + glow sesuai DESIGN.md |
| **Motion** | Framer Motion: stagger children on mount, number counter animation untuk angka rupiah, progress bar fill animation |
| **Gauge** | Ruin probability ditampilkan sebagai semi-circle gauge SVG custom (bukan library), warna gradien hijau-kuning-merah |
| **Chart** | Recharts `<AreaChart>` dengan gradient fill, tooltip custom styled |

---

#### File-file Frontend

#### [NEW] `frontend/src/app/dashboard/projection/page.tsx`
- Halaman utama proyeksi pensiun
- Client component, fetch data dari API, render semua section

#### [NEW] `frontend/src/features/projection/components/`
- `ProjectionHero.tsx` — Banner atas dengan summary + status badge
- `KeyMetricCards.tsx` — 4 kartu metrik utama (dana, kapasitas tarik, durasi, tabungan)
- `RuinGauge.tsx` — SVG semi-circle gauge untuk ruin probability
- `ScenarioTabs.tsx` — Tab P10/P50/P90 dengan detail per skenario
- `FundProjectionChart.tsx` — Area chart Recharts (usia vs dana)
- `PortfolioAllocation.tsx` — Donut chart + tabel instrumen
- `StressTestCards.tsx` — 4 kartu skenario krisis
- `SensitivityCards.tsx` — "Bagaimana jika..." cards
- `InsightsList.tsx` — Daftar rekomendasi dengan ilustrasi

#### [NEW] `frontend/src/features/projection/hooks/useProjection.ts`
- Custom hook: fetch + cache data proyeksi via React Query

#### [NEW] `frontend/src/features/projection/types/projection.types.ts`
- TypeScript types untuk CalculatorOutput JSON

#### [MODIFY] [layout.tsx](file:///d:/KULIAH/MBKM/Capstone%20Project/CuanSelor/frontend/src/app/dashboard/layout.tsx)
- Tambahkan nav item "Proyeksi Pensiun" ke sidebar (icon: BarChart3)

---

### 4. Asset & Illustrations

Akan di-generate menggunakan `generate_image`:
- Ilustrasi sunset/pantai untuk Hero banner
- Ikon rumah kecil untuk skenario pensiun
- Ikon payung/perisai untuk stress test section
- Pattern background subtle untuk card variasi

---

## Verification Plan

### Automated Tests
- Build check: `npm run build` di frontend
- Backend: Test endpoint `/api/projection/calculate` dengan sample payload
- Python AI-service: Run `main.py` sample calculation, bandingkan output JSON dengan `result_output.json`

### Manual Verification
- Visual check semua section dashboard di browser (desktop + mobile responsive)
- Verifikasi angka-angka kalkulasi cocok antara Streamlit output vs dashboard display
- Test loading state, error state, empty state (user belum onboarding)
