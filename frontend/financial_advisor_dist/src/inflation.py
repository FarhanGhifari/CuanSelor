"""
inflation.py — Model Inflasi Dinamis (Ornstein-Uhlenbeck)

CATATAN AKTUARIS SKEPTIS:
  Menggunakan asumsi inflasi FLAT (misal "3% selamanya") adalah kesalahan serius.
  Inflasi Indonesia bergerak antara 1.7% hingga 17% dalam 25 tahun terakhir.
  Model ini menggunakan Ornstein-Uhlenbeck process (mean-reverting stochastic):
    dπ_t = κ(θ - π_t)dt + σ dW_t
  Ini lebih jujur secara matematis: inflasi cenderung kembali ke mean,
  tapi path-nya tidak bisa diprediksi dengan pasti.
"""

import numpy as np
import pandas as pd
from typing import Optional
from src.config import HISTORICAL_CPI_INDONESIA, INFLATION_OU_PARAMS, SECTORAL_INFLATION_MULTIPLIERS


def calibrate_ou_params(historical_data: Optional[dict] = None) -> dict:
    """
    Kalibrasi parameter Ornstein-Uhlenbeck dari data historis BPS.
    Menggunakan metode least-squares pada discretized OU process.
    """
    data = historical_data or HISTORICAL_CPI_INDONESIA

    # Gunakan 15 tahun terakhir (post-structural break) untuk kalibrasi
    recent_years = sorted(data.keys())[-15:]
    series = np.array([data[y] for y in recent_years])

    # Discretized OU: π_{t+1} = α + β*π_t + ε
    x = series[:-1]
    y = series[1:]
    n = len(x)

    beta  = (n * np.sum(x * y) - np.sum(x) * np.sum(y)) / (n * np.sum(x**2) - np.sum(x)**2)
    alpha = (np.sum(y) - beta * np.sum(x)) / n

    # OU parameters
    kappa = -np.log(beta)                     # Mean reversion speed
    theta = alpha / (1 - beta)               # Long-term mean
    resid = y - (alpha + beta * x)
    sigma = np.std(resid, ddof=1) * np.sqrt(2 * kappa / (1 - np.exp(-2 * kappa)))

    return {
        "theta": round(theta, 4),
        "kappa": round(kappa, 4),
        "sigma": round(sigma, 4),
        "calibrated_from": f"{recent_years[0]}-{recent_years[-1]}",
        "n_observations": n,
    }


def simulate_inflation_paths(
    n_years: int,
    n_simulations: int = 10_000,
    initial_inflation: Optional[float] = None,
    params: Optional[dict] = None,
    random_seed: int = 42,
    sector: str = "general",
) -> np.ndarray:
    """
    Simulasi path inflasi menggunakan Ornstein-Uhlenbeck process.

    Args:
        n_years:           Jumlah tahun proyeksi
        n_simulations:     Jumlah simulasi Monte Carlo
        initial_inflation: Inflasi awal (default: inflasi terbaru dari data BPS)
        params:            Parameter OU (default: dikalibrasi dari data BPS)
        random_seed:       Seed untuk reproduktibilitas
        sector:            "general", "healthcare", "education", "food"

    Returns:
        ndarray shape (n_simulations, n_years) — inflasi dalam % per tahun
    """
    if params is None:
        params = calibrate_ou_params()

    theta = params.get("theta", INFLATION_OU_PARAMS["theta"])
    kappa = params.get("kappa", INFLATION_OU_PARAMS["kappa"])
    sigma = params.get("sigma", INFLATION_OU_PARAMS["sigma"])
    floor   = INFLATION_OU_PARAMS["floor"]
    ceiling = INFLATION_OU_PARAMS["ceiling"]

    if initial_inflation is None:
        last_year = max(HISTORICAL_CPI_INDONESIA.keys())
        initial_inflation = HISTORICAL_CPI_INDONESIA[last_year]

    # Sektoral multiplier
    multiplier = SECTORAL_INFLATION_MULTIPLIERS.get(sector, 1.0)

    rng = np.random.default_rng(random_seed)
    dt  = 1.0  # time step = 1 tahun

    # Shape: (n_simulations, n_years)
    paths = np.zeros((n_simulations, n_years))
    pi_t  = np.full(n_simulations, initial_inflation)

    for t in range(n_years):
        dW    = rng.standard_normal(n_simulations) * np.sqrt(dt)
        pi_t  = pi_t + kappa * (theta - pi_t) * dt + sigma * dW
        pi_t  = np.clip(pi_t, floor, ceiling)
        paths[:, t] = pi_t * multiplier

    return paths


def get_inflation_summary(n_years: int = 30, sector: str = "general") -> dict:
    """
    Ringkasan statistik proyeksi inflasi untuk n_years ke depan.
    """
    paths = simulate_inflation_paths(n_years=n_years, n_simulations=10_000, sector=sector)

    avg_per_sim   = paths.mean(axis=1)  # Rata-rata per simulasi

    return {
        "sector": sector,
        "n_years": n_years,
        "historical_mean_pct": round(np.mean(list(HISTORICAL_CPI_INDONESIA.values())), 2),
        "projected_mean_pct":  round(float(avg_per_sim.mean()), 2),
        "projected_p10_pct":   round(float(np.percentile(avg_per_sim, 10)), 2),
        "projected_p50_pct":   round(float(np.percentile(avg_per_sim, 50)), 2),
        "projected_p90_pct":   round(float(np.percentile(avg_per_sim, 90)), 2),
        "calibrated_params":   calibrate_ou_params(),
    }


def get_historical_series() -> pd.DataFrame:
    """Return data historis CPI BPS sebagai DataFrame."""
    df = pd.DataFrame(
        list(HISTORICAL_CPI_INDONESIA.items()),
        columns=["year", "cpi_pct"]
    ).sort_values("year").reset_index(drop=True)
    df["cpi_decimal"] = df["cpi_pct"] / 100
    return df
