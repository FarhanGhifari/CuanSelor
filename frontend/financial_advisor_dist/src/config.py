"""
config.py — Konstanta & Parameter Terpusat
Semua asumsi ekonomi dan parameter model dikumpulkan di sini agar mudah diaudit.

CATATAN AKTUARIS:
  Setiap angka di sini adalah ASUMSI, bukan fakta.
  Selalu dokumentasikan sumber dan tanggal kalibrasi terakhir.
  Last calibrated: April 2026 | Source: BPS, BI, OJK
"""

# ============================================================
# HISTORICAL BPS CPI INDONESIA (Annual Headline Inflation %)
# Source: Badan Pusat Statistik (bps.go.id)
# ============================================================
HISTORICAL_CPI_INDONESIA = {
    2000: 9.35,  2001: 12.55, 2002: 10.03, 2003: 5.06,
    2004: 6.40,  2005: 17.11, 2006: 6.60,  2007: 6.59,
    2008: 11.06, 2009: 2.78,  2010: 6.96,  2011: 3.79,
    2012: 4.30,  2013: 8.38,  2014: 8.36,  2015: 3.35,
    2016: 3.02,  2017: 3.61,  2018: 3.13,  2019: 2.72,
    2020: 1.68,  2021: 1.87,  2022: 5.51,  2023: 2.61,
    2024: 2.20,
}

# Inflasi sektoral (multiplier relatif terhadap CPI umum)
SECTORAL_INFLATION_MULTIPLIERS = {
    "general":    1.00,
    "healthcare": 1.80,   # Inflasi kesehatan ~1.8x CPI umum
    "education":  1.50,   # Inflasi pendidikan ~1.5x CPI umum
    "food":       1.10,
}

# ============================================================
# ORNSTEIN-UHLENBECK INFLATION MODEL
# Dikalibrasi dari data BPS 2010-2024 (post-structural break)
# ============================================================
INFLATION_OU_PARAMS = {
    "theta": 3.50,   # Long-term mean (%) — BI target range 2.5-4.5%
    "kappa": 0.35,   # Mean-reversion speed
    "sigma": 1.45,   # Volatilitas shock inflasi
    "floor": 0.50,   # Batas bawah (lindungi dari deflasi)
    "ceiling": 15.0, # Batas atas
}

# ============================================================
# INSTRUMEN INVESTASI LOKAL (Real returns, net of inflation)
# ============================================================
INVESTMENT_INSTRUMENTS = {
    "deposito": {
        "name": "Deposito Bank",
        "real_return_mean": 1.50,
        "real_return_std":  0.50,
        "nominal_return_mean": 5.00,
        "nominal_return_std":  1.00,
        "risk_level": 1,
        "tax_rate": 0.20,
        "min_investment": 1_000_000,
        "description": "Deposito bank, dijamin LPS s.d. Rp 2 Miliar",
    },
    "ori_sbn": {
        "name": "ORI / SBN (Obligasi Pemerintah)",
        "real_return_mean": 3.42,
        "real_return_std":  0.38,
        "nominal_return_mean": 6.92,
        "nominal_return_std":  0.38,
        "risk_level": 2,
        "tax_rate": 0.10,
        "min_investment": 1_000_000,
        "description": "Obligasi Negara Ritel, dijamin pemerintah Indonesia",
    },
    "rd_pasar_uang": {
        "name": "Reksa Dana Pasar Uang",
        "real_return_mean": 2.50,
        "real_return_std":  0.40,
        "nominal_return_mean": 6.00,
        "nominal_return_std":  0.80,
        "risk_level": 2,
        "tax_rate": 0.00,
        "min_investment": 10_000,
        "description": "RD berbasis instrumen pasar uang, likuiditas harian",
    },
    "rd_pendapatan_tetap": {
        "name": "Reksa Dana Pendapatan Tetap",
        "real_return_mean": 4.00,
        "real_return_std":  1.50,
        "nominal_return_mean": 7.50,
        "nominal_return_std":  2.50,
        "risk_level": 3,
        "tax_rate": 0.00,
        "min_investment": 10_000,
        "description": "RD berbasis obligasi korporasi dan pemerintah",
    },
    "rd_campuran": {
        "name": "Reksa Dana Campuran",
        "real_return_mean": 5.50,
        "real_return_std":  4.00,
        "nominal_return_mean": 9.00,
        "nominal_return_std":  6.00,
        "risk_level": 4,
        "tax_rate": 0.00,
        "min_investment": 10_000,
        "description": "Campuran saham dan obligasi, balanced growth",
    },
    "rd_saham_idx": {
        "name": "Reksa Dana Saham / IDX Composite",
        "proxy_ticker": "^JKSE",
        "real_return_mean": 7.50,
        "real_return_std":  15.00,
        "nominal_return_mean": 11.00,
        "nominal_return_std":  18.00,
        "risk_level": 5,
        "tax_rate": 0.00,
        "min_investment": 10_000,
        "description": "Berbasis IDX Composite (IHSG) via Reksa Dana indeks",
    },
}

# ============================================================
# ALOKASI PORTFOLIO BERDASARKAN PROFIL RISIKO
# ============================================================
RISK_PROFILES = {
    "conservative": {
        "label": "Konservatif",
        "description": "Prioritas preservasi modal, toleransi risiko rendah",
        "allocation": {
            "deposito": 0.30, "ori_sbn": 0.40, "rd_pasar_uang": 0.20,
            "rd_pendapatan_tetap": 0.10, "rd_campuran": 0.00, "rd_saham_idx": 0.00,
        },
    },
    "moderate": {
        "label": "Moderat",
        "description": "Keseimbangan antara pertumbuhan dan stabilitas",
        "allocation": {
            "deposito": 0.10, "ori_sbn": 0.25, "rd_pasar_uang": 0.10,
            "rd_pendapatan_tetap": 0.15, "rd_campuran": 0.25, "rd_saham_idx": 0.15,
        },
    },
    "aggressive": {
        "label": "Agresif",
        "description": "Prioritas pertumbuhan jangka panjang, toleransi risiko tinggi",
        "allocation": {
            "deposito": 0.05, "ori_sbn": 0.10, "rd_pasar_uang": 0.05,
            "rd_pendapatan_tetap": 0.10, "rd_campuran": 0.25, "rd_saham_idx": 0.45,
        },
    },
    "very_aggressive": {
        "label": "Sangat Agresif",
        "description": "Maksimalkan pertumbuhan, siap menghadapi volatilitas tinggi",
        "allocation": {
            "deposito": 0.00, "ori_sbn": 0.05, "rd_pasar_uang": 0.00,
            "rd_pendapatan_tetap": 0.05, "rd_campuran": 0.15, "rd_saham_idx": 0.75,
        },
    },
}

PROFILE_ORDER = ["very_aggressive", "aggressive", "moderate", "conservative"]

# ============================================================
# MONTE CARLO PARAMETERS
# ============================================================
MONTE_CARLO = {
    "n_simulations": 10_000,
    "random_seed": 42,
    "time_step_months": 1,
}

# ============================================================
# SAFE WITHDRAWAL RATE (SWR)
# Lebih konservatif dari Trinity Study karena market Indonesia less mature
# ============================================================
SAFE_WITHDRAWAL_RATES = {
    "conservative":    0.030,
    "moderate":        0.035,
    "aggressive":      0.040,
    "very_aggressive": 0.045,
}

# ============================================================
# AKTUARIAL
# ============================================================
ACTUARIAL = {
    "planning_confidence_level": 0.90,
    "mortality_improvement_rate": 0.005,
    "mortality_table_path": "data/raw/mortality_bpjs.csv",
}

# ============================================================
# ASUMSI KONTRIBUSI & PERTUMBUHAN GAJI (Kalibrasi BPS 2015-2025)
# ============================================================
CONTRIBUTION = {
    "salary_growth_rate":   0.05,   # Fallback rate
    "annual_bonus_months":  1.0,    # 1x gaji per tahun
    "bonus_savings_rate":   0.50,   # 50% bonus langsung diinvestasikan
}

SECTOR_SALARY_GROWTH = {
    "Pertanian, Kehutanan, dan Perikanan": {
        "normal": 0.0637,
        "with_pandemic_risk": 0.0535
    },
    "Pertambangan dan Penggalian": {
        "normal": 0.0332,
        "with_pandemic_risk": 0.0238
    },
    "Industri Pengolahan": {
        "normal": 0.0609,
        "with_pandemic_risk": 0.0495
    },
    "Pengadaan Listrik, Gas, Uap/Air Panas dan Udara Dingin": {
        "normal": 0.0624,
        "with_pandemic_risk": 0.0521
    },
    "Treatment Air, Treatment Air Limbah, Treatment dan Pemulihan Material Sampah, dan Aktivitas Remediasi": {
        "normal": 0.0624,
        "with_pandemic_risk": 0.0334
    },
    "Konstruksi": {
        "normal": 0.0481,
        "with_pandemic_risk": 0.0417
    },
    "Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor": {
        "normal": 0.0528,
        "with_pandemic_risk": 0.0439
    },
    "Pengangkutan dan Pergudangan": {
        "normal": 0.049,
        "with_pandemic_risk": 0.0386
    },
    "Penyediaan Akomodasi dan Penyedia Makan Minum": {
        "normal": 0.0431,
        "with_pandemic_risk": 0.0288
    },
    "Informasi dan Komunikasi": {
        "normal": 0.0249,
        "with_pandemic_risk": 0.0293
    },
    "Aktivitas Keuangan dan Asuransi": {
        "normal": 0.0446,
        "with_pandemic_risk": 0.042
    },
    "Real Estat": {
        "normal": 0.039,
        "with_pandemic_risk": 0.0366
    },
    "Aktivitas Profesional dan Perusahaan": {
        "normal": 0.0466,
        "with_pandemic_risk": 0.0378
    },
    "Administrasi Pemerintahan, Pertahanan, dan Jaminan Sosial Wajib": {
        "normal": 0.0274,
        "with_pandemic_risk": 0.0188
    },
    "Pendidikan": {
        "normal": 0.0247,
        "with_pandemic_risk": 0.0124
    },
    "Aktivitas Kesehatan dan Kegiatan Sosial": {
        "normal": 0.0298,
        "with_pandemic_risk": 0.0308
    },
    "Aktivitas Jasa Lainnya": {
        "normal": 0.0609,
        "with_pandemic_risk": 0.0464
    },
    "Rata-Rata": {
        "normal": 0.0461,
        "with_pandemic_risk": 0.0366
    },
}

# ============================================================
# LIFESTYLE
# ============================================================
LIFESTYLE = {
    "replacement_ratio": 0.70,  # Target 70% dari gaji terakhir saat pensiun
    "healthcare_cost_ratio": {
        "age_55_65":  0.10,
        "age_65_75":  0.18,
        "age_75_plus": 0.28,
    },
}
