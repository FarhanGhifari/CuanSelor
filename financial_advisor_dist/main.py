"""
main.py -- Entry Point & Demo

Demonstrasi end-to-end kalkulasi dengan profil Gen Z Indonesia.
Jalankan: python main.py
"""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import json
import sys
import os

# Tambahkan project root ke path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from financial_advisor_dist.src.calculator import RetirementCalculator, UserProfile
from financial_advisor_dist.src.inflation import get_inflation_summary, calibrate_ou_params
from financial_advisor_dist.src.investment import get_instrument_comparison_table, fetch_idx_historical_returns
from financial_advisor_dist.src.actuarial import get_mortality_table


def print_section(title: str):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}")


def main():
    print_section("AI Financial Advisor — Retirement Calculator")
    print("Perspektif: Senior Data Scientist + Aktuaris Skeptis")
    print("Target: Gen Z Indonesia | Currency: IDR\n")

    # ------------------------------------------------------------------ #
    # PROFIL PENGGUNA CONTOH
    # ------------------------------------------------------------------ #
    profile = UserProfile(
        name           = "Rizky",
        age            = 25,
        gender         = "male",
        monthly_salary = 8_000_000,   # Rp 8 juta/bulan
        savings_rate   = 0.20,         # 20% dari gaji
        retirement_age = 55,
        risk_profile   = "moderate",
        sector         = "Pertanian, Kehutanan, dan Perikanan",
        include_pandemic_risk = True,
        custom_deposit_rate = 8.0, # e.g. BPR / Bank Digital NeoBank
    )

    from financial_advisor_dist.src.calculator import get_salary_growth
    growth_rate = get_salary_growth(profile)

    print(f"Profil: {profile.name} | Usia: {profile.age} thn | "
          f"Gaji: Rp {profile.monthly_salary:,} | "
          f"Target Pensiun: {profile.retirement_age} thn")
    print(f"Sektor: {profile.sector}")
    print(f"Salary Growth: {growth_rate*100:.2f}%/tahun (Pandemic Risk: {profile.include_pandemic_risk})")
    print(f"Custom Deposit Rate: {profile.custom_deposit_rate}% (Bunga Bank Digital/BPR)")

    # ------------------------------------------------------------------ #
    # AKTUARIAL INFO
    # ------------------------------------------------------------------ #
    print_section("1. Ringkasan Aktuarial")
    mt = get_mortality_table()
    actuarial = mt.get_planning_summary(profile.age, profile.retirement_age, profile.gender)
    print(f"  Sumber data mortalitas : {actuarial['source']}")
    print(f"  Expected death age     : {actuarial['expected_death_age']} tahun")
    print(f"  P50 survival age       : {actuarial['p50_survival_age']} tahun (50% masih hidup)")
    print(f"  P90 survival age       : {actuarial['p90_survival_age']} tahun (10% masih hidup)")
    print(f"  Planning horizon       : {actuarial['planning_horizon_post_retirement']} tahun setelah pensiun")
    print(f"  Longevity risk flag    : {'[!] YA' if actuarial['longevity_risk_flag'] else '[OK] TIDAK'}")

    # ------------------------------------------------------------------ #
    # INFLASI INFO
    # ------------------------------------------------------------------ #
    print_section("2. Proyeksi Inflasi (Ornstein-Uhlenbeck)")
    ou_params = calibrate_ou_params()
    print(f"  Parameter kalibrasi dari: {ou_params['calibrated_from']}")
    print(f"  θ (long-term mean): {ou_params['theta']}%")
    print(f"  κ (mean-reversion speed): {ou_params['kappa']}")
    print(f"  σ (volatilitas): {ou_params['sigma']}")

    inf_summary = get_inflation_summary(n_years=30)
    print(f"\n  Proyeksi 30 tahun ke depan:")
    print(f"    P10 (skenario ringan) : {inf_summary['projected_p10_pct']}% per tahun")
    print(f"    P50 (median)          : {inf_summary['projected_p50_pct']}% per tahun")
    print(f"    P90 (skenario berat)  : {inf_summary['projected_p90_pct']}% per tahun")

    # ------------------------------------------------------------------ #
    # INSTRUMENT TABLE
    # ------------------------------------------------------------------ #
    print_section("3. Instrumen Investasi yang Tersedia")
    df = get_instrument_comparison_table()
    print(df[["Instrumen", "Return Nominal (mean)", "Volatilitas", "Risk Level"]].to_string(index=False))

    # ------------------------------------------------------------------ #
    # IDX DATA
    # ------------------------------------------------------------------ #
    print_section("4. Data Historis IDX Composite (via yfinance)")
    idx_df = fetch_idx_historical_returns(period="10y")
    print(idx_df.tail(10).to_string(index=False))
    print(f"\n  Rata-rata return IDX 10Y : {idx_df['annual_return_pct'].mean():.2f}%")
    print(f"  Std Dev (volatilitas)    : {idx_df['annual_return_pct'].std():.2f}%")

    # ------------------------------------------------------------------ #
    # MAIN CALCULATION
    # ------------------------------------------------------------------ #
    print_section("5. Menjalankan Monte Carlo Simulation (10.000 iterasi)...")
    print("  [Ini mungkin membutuhkan 30-60 detik...]\n")

    calculator = RetirementCalculator(n_simulations=10_000)
    result     = calculator.calculate(profile)

    # ------------------------------------------------------------------ #
    # OUTPUT RINGKASAN
    # ------------------------------------------------------------------ #
    print_section("6. Hasil Proyeksi")
    for key, scenario in result.projection.items():
        print(f"\n  [{scenario['percentile']}]")
        print(f"    Dana saat pensiun      : Rp {scenario['fund_at_retirement']:>15,.0f}")
        print(f"    Nilai real (hari ini)  : Rp {scenario['real_fund_at_retirement']:>15,.0f}")
        print(f"    Kapasitas tarik/tahun  : Rp {scenario['annual_withdrawal_capacity']:>15,.0f}")
        print(f"    Ruin probability       : {scenario['ruin_probability']*100:.1f}%")
        if scenario['fund_depleted_age']:
            print(f"    Dana habis di usia     : {scenario['fund_depleted_age']} tahun")

    print_section("7. Rekomendasi")
    rec = result.recommendations
    print(f"  On track           : {'[OK] YA' if rec['is_on_track'] else '[X] TIDAK'}")
    print(f"  Effective profile  : {rec['effective_risk_profile'].upper()}")
    print(f"  Glide path applied : {'Ya' if rec['glide_path_applied'] else 'Tidak'}")
    print(f"  Fund gap           : Rp {rec['fund_gap_positive_means_surplus']:>15,.0f} "
          f"({'SURPLUS' if rec['fund_gap_positive_means_surplus'] >= 0 else 'DEFICIT'})")

    print_section("8. A/B Test: Fixed vs Glide Path")
    ab = result.ab_test_result
    print(f"  Strategy A (Fixed)      : {ab['strategy_a_fixed']['ruin_probability']*100:.1f}% ruin prob")
    print(f"  Strategy B (Glide Path) : {ab['strategy_b_glide_path']['ruin_probability']*100:.1f}% ruin prob")
    print(f"  Winner                  : {ab['winner']}")
    print(f"  p-value                 : {ab['p_value']}")
    print(f"  Signifikan              : {'[OK] YA (p<0.05)' if ab['statistically_significant'] else '[X] TIDAK'}")

    print_section("9. Actionable Insights")
    for i, insight in enumerate(result.actionable_insights, 1):
        print(f"  {i}. {insight}")

    # ------------------------------------------------------------------ #
    # SAVE JSON OUTPUT
    # ------------------------------------------------------------------ #
    output_path = "data/processed/result_output.json"
    os.makedirs("data/processed", exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(result.to_json())

    print_section("[DONE] Selesai")
    print(f"  JSON output disimpan di: {output_path}")
    print("  Siap disambungkan ke front-end / AI Engineer.")


if __name__ == "__main__":
    main()
