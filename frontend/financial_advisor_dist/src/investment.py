"""
investment.py — Model Return Investasi Multi-Aset & Monte Carlo Simulation

CATATAN AKTUARIS SKEPTIS:
  Return investasi adalah STOKASTIK, bukan deterministic.
  "Saham IDX return 11% per tahun" adalah rata-rata historis — bukan jaminan.
  Sequence-of-returns risk: urutan return buruk di AWAL pensiun jauh lebih
  merusak daripada return buruk di tengah fase akumulasi.
  Model ini mensimulasikan distribusi return, bukan satu angka tunggal.

Pendekatan:
  - Return tahunan diasumsikan log-normal (sesuai standar keuangan)
  - Korelasi antar aset dimodel (diversifikasi bukan gratis tapi nyata)
  - Glide path: otomatis shift ke konservatif saat mendekati pensiun
"""

from typing import Optional
import numpy as np
import pandas as pd
from src.config import (
    INVESTMENT_INSTRUMENTS,
    RISK_PROFILES,
    PROFILE_ORDER,
)

# Matriks korelasi antar instrumen (perkiraan untuk pasar Indonesia)
# Urutan: deposito, ori_sbn, rd_pasar_uang, rd_pendapatan_tetap, rd_campuran, rd_saham_idx
_INSTRUMENTS_ORDER = [
    "deposito", "ori_sbn", "rd_pasar_uang",
    "rd_pendapatan_tetap", "rd_campuran", "rd_saham_idx",
]

_CORRELATION_MATRIX = np.array([
    # dep   ori   rdpu  rdpt  rdca  rdsa
    [1.00,  0.10,  0.95,  0.05, -0.05, -0.10],  # deposito
    [0.10,  1.00,  0.15,  0.75,  0.45,  0.20],  # ori_sbn
    [0.95,  0.15,  1.00,  0.10,  0.00, -0.05],  # rd_pasar_uang
    [0.05,  0.75,  0.10,  1.00,  0.60,  0.35],  # rd_pendapatan_tetap
    [-0.05, 0.45,  0.00,  0.60,  1.00,  0.80],  # rd_campuran
    [-0.10, 0.20, -0.05,  0.35,  0.80,  1.00],  # rd_saham_idx
])


def get_glide_path_profile(
    base_profile: str, years_to_retirement: int
) -> str:
    """
    Tentukan profil risiko efektif berdasarkan glide path logic.
    Semakin dekat pensiun → geser ke lebih konservatif.
    """
    idx = PROFILE_ORDER.index(base_profile) if base_profile in PROFILE_ORDER else 1

    if years_to_retirement > 20:
        shift = 0
    elif years_to_retirement > 10:
        shift = 1
    elif years_to_retirement > 5:
        shift = 2
    else:
        shift = 3  # Full conservative

    effective_idx = min(idx + shift, len(PROFILE_ORDER) - 1)
    return PROFILE_ORDER[effective_idx]


def get_portfolio_stats(profile: str, custom_deposit_rate: Optional[float] = None) -> dict:
    """
    Hitung weighted mean dan std dari portfolio berdasarkan profil risiko.
    Returns: dict dengan nominal_return_mean, nominal_return_std, real_return_mean, etc.
    """
    alloc = RISK_PROFILES[profile]["allocation"]
    instruments = INVESTMENT_INSTRUMENTS

    w_nominal_mean = 0.0
    w_real_mean    = 0.0
    weights = []
    stds_nominal = []

    for inst_key in _INSTRUMENTS_ORDER:
        w = alloc.get(inst_key, 0.0)
        inst = instruments[inst_key]
        
        nom_mean = inst["nominal_return_mean"]
        real_mean = inst["real_return_mean"]
        
        if inst_key == "deposito" and custom_deposit_rate is not None:
            nom_mean = custom_deposit_rate
            real_mean = custom_deposit_rate - 3.50 # Asumsi inflasi rata-rata 3.5%
            
        w_nominal_mean += w * nom_mean
        w_real_mean    += w * real_mean
        weights.append(w)
        stds_nominal.append(inst["nominal_return_std"])

    w = np.array(weights)
    s = np.array(stds_nominal)

    # Portfolio variance (with correlation)
    cov_matrix = np.outer(s, s) * _CORRELATION_MATRIX
    port_variance = float(w @ cov_matrix @ w)
    port_std = np.sqrt(port_variance)

    return {
        "profile": profile,
        "nominal_return_mean": round(w_nominal_mean, 4),
        "nominal_return_std":  round(port_std, 4),
        "real_return_mean":    round(w_real_mean, 4),
        "allocation":          alloc,
    }


def simulate_portfolio_returns(
    profile: str,
    n_years: int,
    n_simulations: int = 10_000,
    random_seed: int = 42,
    inflation_paths: Optional[np.ndarray] = None,
    custom_deposit_rate: Optional[float] = None,
) -> np.ndarray:
    """
    Simulasi return portfolio tahunan menggunakan distribusi log-normal.

    Args:
        profile:         Risk profile key
        n_years:         Jumlah tahun simulasi
        n_simulations:   Jumlah simulasi Monte Carlo
        random_seed:     Seed reproduktibilitas
        inflation_paths: ndarray (n_simulations, n_years) dalam % (opsional)
                         Jika diberikan, return di-deflate untuk mendapat real return

    Returns:
        ndarray shape (n_simulations, n_years) — REAL annual return dalam desimal
    """
    stats = get_portfolio_stats(profile, custom_deposit_rate=custom_deposit_rate)

    mu_pct    = stats["nominal_return_mean"]
    sigma_pct = stats["nominal_return_std"]

    # Log-normal parameters
    mu_log    = np.log(1 + mu_pct / 100) - 0.5 * np.log(1 + (sigma_pct / (100 + mu_pct))**2)
    sigma_log = np.sqrt(np.log(1 + (sigma_pct / (100 + mu_pct))**2))

    rng = np.random.default_rng(random_seed)
    raw_returns = rng.lognormal(mu_log, sigma_log, size=(n_simulations, n_years)) - 1

    if inflation_paths is not None:
        # Deflate: real_return = (1 + nominal) / (1 + inflation) - 1
        inflation_decimal = inflation_paths / 100
        real_returns = (1 + raw_returns) / (1 + inflation_decimal) - 1
        return real_returns

    # Jika tidak ada inflation_paths, gunakan asumsi inflasi long-term
    long_term_inflation = 0.035  # 3.5%
    real_returns = (1 + raw_returns) / (1 + long_term_inflation) - 1
    return real_returns


def fetch_idx_historical_returns(period: str = "10y") -> pd.DataFrame:
    """
    Fetch data historis IDX Composite (^JKSE) dari Yahoo Finance via yfinance.
    Returns DataFrame dengan kolom: year, annual_return_pct
    """
    try:
        import yfinance as yf
        ticker = yf.Ticker("^JKSE")
        hist   = ticker.history(period=period, interval="1mo")
        if hist.empty:
            raise ValueError("Data IDX kosong dari yfinance")
        hist.index = pd.to_datetime(hist.index)
        monthly_returns = hist["Close"].pct_change().dropna()
        annual_returns  = (
            (1 + monthly_returns)
            .resample("YE")
            .prod() - 1
        ) * 100
        df = annual_returns.reset_index()
        df.columns = ["date", "annual_return_pct"]
        df["year"] = df["date"].dt.year
        return df[["year", "annual_return_pct"]].dropna()
    except Exception as e:
        print(f"[WARNING] Gagal fetch data IDX dari yfinance: {e}")
        print("          Menggunakan data historis statis sebagai fallback.")
        # Fallback: data IDX approximate dari berbagai sumber
        fallback = {
            2014: 22.3, 2015: -12.1, 2016: 15.3, 2017: 20.0,
            2018: -2.5, 2019: 1.7,   2020: -5.1, 2021: 10.1,
            2022: 4.1,  2023: 6.2,   2024: 3.5,
        }
        return pd.DataFrame(
            list(fallback.items()), columns=["year", "annual_return_pct"]
        )


def get_instrument_comparison_table() -> pd.DataFrame:
    """Return tabel perbandingan instrumen investasi untuk display."""
    rows = []
    for key, inst in INVESTMENT_INSTRUMENTS.items():
        rows.append({
            "Kode":                  key,
            "Instrumen":             inst["name"],
            "Return Nominal (mean)": f"{inst['nominal_return_mean']}%",
            "Volatilitas":           f"{inst['nominal_return_std']}%",
            "Return Real (mean)":    f"{inst['real_return_mean']}%",
            "Risk Level":            inst["risk_level"],
            "Pajak":                 f"{int(inst['tax_rate']*100)}%",
            "Min. Investasi":        f"Rp {inst['min_investment']:,}",
            "Deskripsi":             inst["description"],
        })
    return pd.DataFrame(rows)
