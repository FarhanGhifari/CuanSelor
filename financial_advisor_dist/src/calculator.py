"""
calculator.py — Engine Utama Financial Advisor

Mengorkestrasi semua modul: actuarial + inflation + investment.
Output: JSON-ready dict yang siap disambungkan ke front-end atau AI Engineer.

DUA FASE UTAMA:
  1. Fase Akumulasi  : Sekarang → Usia Pensiun
     Dana_akhir = Σ [Kontribusi × (1 + return)^sisa_bulan]
     (stokastik via Monte Carlo, bukan deterministik)

  2. Fase Dekumulasi : Pensiun → Akhir Hayat
     Apakah dana cukup membiayai pengeluaran selama sisa hidup?
     Output utama: RUIN PROBABILITY — seberapa besar kemungkinan dana habis sebelum meninggal.

CATATAN AKTUARIS:
  Output WAJIB berupa distribusi (P10/P50/P90), bukan satu angka tunggal.
  Satu angka proyeksi adalah pseudoscience finansial.
"""

import numpy as np
import json
from dataclasses import dataclass, field, asdict
from typing import Literal, Optional
from financial_advisor_dist.src.config import (
    MONTE_CARLO, SAFE_WITHDRAWAL_RATES, CONTRIBUTION,
    LIFESTYLE, RISK_PROFILES, SECTOR_SALARY_GROWTH
)
from financial_advisor_dist.src.actuarial import get_mortality_table
from financial_advisor_dist.src.inflation import simulate_inflation_paths
from financial_advisor_dist.src.investment import (
    simulate_portfolio_returns,
    get_glide_path_profile,
    get_portfolio_stats,
)


@dataclass
class UserProfile:
    name:           str
    age:            int
    gender:         Literal["male", "female"]
    monthly_salary: float          # IDR
    savings_rate:   float          # 0.0 – 1.0
    retirement_age: int
    risk_profile:   str            # conservative / moderate / aggressive / very_aggressive
    sector:         Optional[str] = None  # Sektor BPS untuk salary growth rate
    include_pandemic_risk: bool   = False # Jika True, gunakan perhitungan slope (tren termasuk pandemi)
    custom_deposit_rate: Optional[float] = None # Persentase misal 5.5 untuk 5.5%
    custom_planning_age: Optional[int] = None # Jika None, gunakan P90 survival age
    current_assets: float         = 0.0   # Dana investasi awal / uang dingin
    annual_bonus_months: float    = 1.0   # Jumlah gaji ekstra (THR dll)
    replacement_ratio: float      = 0.70  # Gaya hidup pensiun (target %)
    has_health_insurance: bool    = False # Asuransi kesehatan seumur hidup
    monthly_expense: Optional[float] = None  # Jika None, dihitung dari replacement_ratio

def get_salary_growth(profile: UserProfile) -> float:
    if profile.sector and profile.sector in SECTOR_SALARY_GROWTH:
        growth_type = "with_pandemic_risk" if profile.include_pandemic_risk else "normal"
        return SECTOR_SALARY_GROWTH[profile.sector][growth_type]
    return CONTRIBUTION["salary_growth_rate"]


@dataclass
class ProjectionScenario:
    percentile:                str   = ""
    fund_at_retirement:        float = 0.0
    real_fund_at_retirement:   float = 0.0   # Inflasi-adjusted (nilai uang hari ini)
    annual_withdrawal_capacity: float = 0.0
    ruin_probability:          float = 0.0
    fund_depleted_age:         Optional[int] = None
    note:                      str   = ""


@dataclass
class CalculatorOutput:
    user_profile:       dict = field(default_factory=dict)
    actuarial_summary:  dict = field(default_factory=dict)
    projection:         dict = field(default_factory=dict)
    recommendations:    dict = field(default_factory=dict)
    sensitivity:        dict = field(default_factory=dict)
    ab_test_result:     dict = field(default_factory=dict)
    actionable_insights: list = field(default_factory=list)
    metadata:           dict = field(default_factory=dict)

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(asdict(self), indent=indent, ensure_ascii=False)

    def to_dict(self) -> dict:
        return asdict(self)


class RetirementCalculator:
    """
    Main calculator engine. Jalankan dengan `calculate(UserProfile)`.
    """

    def __init__(
        self,
        n_simulations: int = MONTE_CARLO["n_simulations"],
        random_seed:   int = MONTE_CARLO["random_seed"],
    ):
        self.n_sims  = n_simulations
        self.seed    = random_seed
        self.mt      = get_mortality_table()

    # ------------------------------------------------------------------ #
    #  FASE AKUMULASI
    # ------------------------------------------------------------------ #
    def _simulate_accumulation(
        self,
        profile:        UserProfile,
        effective_risk: str,
        inflation_paths: np.ndarray,
    ) -> np.ndarray:
        """
        Simulasi dana yang terkumpul saat pensiun.
        Kontribusi bulanan meningkat sesuai salary_growth_rate.

        Returns: ndarray shape (n_simulations,) — dana saat pensiun dalam IDR nominal
        """
        years_to_ret = profile.retirement_age - profile.age
        months       = years_to_ret * 12

        annual_real_returns = simulate_portfolio_returns(
            profile  = effective_risk,
            n_years  = years_to_ret,
            n_simulations = self.n_sims,
            random_seed   = self.seed,
            inflation_paths = inflation_paths,
            custom_deposit_rate = profile.custom_deposit_rate,
        )

        # Convert ke monthly returns (approx)
        monthly_returns = (1 + annual_real_returns).repeat(12, axis=1)[:, :months]
        monthly_returns = monthly_returns ** (1/12) - 1

        # Hitung kumulatif return factor untuk setiap bulan ke depan
        fund = np.full(self.n_sims, float(profile.current_assets))
        monthly_salary = profile.monthly_salary
        salary_growth_monthly = (1 + get_salary_growth(profile)) ** (1/12) - 1

        for m in range(months):
            # Kontribusi bulan ini (gaji tumbuh)
            current_salary      = monthly_salary * (1 + salary_growth_monthly) ** m
            monthly_contribution = current_salary * profile.savings_rate

            # Return bulan ini (dari monthly_returns)
            r_m = monthly_returns[:, m] if m < monthly_returns.shape[1] else np.zeros(self.n_sims)

            # Grow existing fund + add new contribution
            fund = fund * (1 + r_m) + monthly_contribution

        # Tambah bonus tahunan
        annual_bonus = (
            profile.monthly_salary
            * profile.annual_bonus_months
            * CONTRIBUTION["bonus_savings_rate"]
        )
        for yr in range(years_to_ret):
            months_remaining = (years_to_ret - yr - 1) * 12
            # Future value of bonus
            avg_monthly_r = (1 + annual_real_returns[:, yr]) ** (1/12) - 1
            compound = (1 + avg_monthly_r.mean()) ** months_remaining
            fund += annual_bonus * compound

        return fund

    # ------------------------------------------------------------------ #
    #  FASE DEKUMULASI + RUIN PROBABILITY
    # ------------------------------------------------------------------ #
    def _simulate_decumulation(
        self,
        fund_at_retirement: np.ndarray,
        profile:            UserProfile,
        planning_age:       int,
        inflation_paths:    np.ndarray,   # shape (n_sims, years_post_ret) OR full horizon
        conservative_risk:  str = "conservative",
    ) -> tuple[np.ndarray, np.ndarray]:
        """
        Simulasi apakah dana bertahan hingga planning_age.
        inflation_paths bisa berupa slice post-retirement atau full horizon —
        fungsi ini akan menggunakan years_post_ret kolom pertama.
        """
        years_post_ret = planning_age - profile.retirement_age
        if years_post_ret <= 0:
            return np.zeros(self.n_sims, dtype=bool), np.full(self.n_sims, np.nan)

        # Pastikan inflation_paths memiliki kolom yang cukup
        avail_cols = inflation_paths.shape[1]
        if avail_cols < years_post_ret:
            # Pad dengan long-term mean
            pad = np.full((self.n_sims, years_post_ret - avail_cols), 3.5)
            inf_post = np.hstack([inflation_paths, pad])
        else:
            inf_post = inflation_paths[:, :years_post_ret]

        post_ret_returns = simulate_portfolio_returns(
            profile         = conservative_risk,
            n_years         = years_post_ret,
            n_simulations   = self.n_sims,
            random_seed     = self.seed + 1,
            inflation_paths = inf_post,
            custom_deposit_rate = profile.custom_deposit_rate,
        )
        final_salary = (
            profile.monthly_salary * 12
            * (1 + get_salary_growth(profile)) ** (profile.retirement_age - profile.age)
        )
        if profile.monthly_expense:
            annual_expense = profile.monthly_expense * 12
        else:
            annual_expense = final_salary * profile.replacement_ratio

        fund = fund_at_retirement.copy().astype(float)
        ruin_flags       = np.zeros(self.n_sims, dtype=bool)
        depletion_years  = np.full(self.n_sims, np.nan)

        for yr in range(years_post_ret):
            age_now = profile.retirement_age + yr

            # Healthcare extra burden (incremental above general expenses)
            if profile.has_health_insurance:
                health_premium = 0.0
            else:
                if age_now < 65:
                    health_premium = LIFESTYLE["healthcare_cost_ratio"]["age_55_65"]
                elif age_now < 75:
                    health_premium = LIFESTYLE["healthcare_cost_ratio"]["age_65_75"]
                else:
                    health_premium = LIFESTYLE["healthcare_cost_ratio"]["age_75_plus"]

            # Base expense grows with general inflation (post-retirement, real terms = flat)
            # Healthcare portion grows 0.8% extra per year above general inflation
            total_expense = annual_expense * (1 + health_premium * 0.5) ** max(yr - 10, 0)

            r_yr = post_ret_returns[:, yr]
            fund = fund * (1 + r_yr) - total_expense

            # Mark ruin
            newly_ruined = (fund < 0) & (~ruin_flags)
            depletion_years[newly_ruined] = profile.retirement_age + yr
            ruin_flags |= (fund < 0)

        return ruin_flags, depletion_years

    # ------------------------------------------------------------------ #
    #  SENSITIVITY ANALYSIS
    # ------------------------------------------------------------------ #
    def _sensitivity_analysis(
        self,
        profile:         UserProfile,
        base_ruin_prob:  float,
        base_fund_p50:   float,
        inflation_paths: np.ndarray,
        planning_age:    int,
    ) -> dict:
        """Analisis sensitivitas: variasi inflasi, usia pensiun, kontribusi."""

        def run_scenario(mod_profile, acc_inflation, post_inflation):
            eff_risk = get_glide_path_profile(
                mod_profile.risk_profile,
                mod_profile.retirement_age - mod_profile.age
            )
            fund = self._simulate_accumulation(mod_profile, eff_risk, acc_inflation)
            ruin, _ = self._simulate_decumulation(fund, mod_profile, planning_age, post_inflation)
            return float(np.median(fund)), float(ruin.mean())

        years_to_ret = profile.retirement_age - profile.age
        years_post   = planning_age - profile.retirement_age

        # Base slices
        inf_acc  = inflation_paths[:, :years_to_ret]
        inf_post = inflation_paths[:, years_to_ret:years_to_ret + years_post]

        # Scenario 1: Inflasi +1%
        inf_acc_high  = inflate_shift(inf_acc,  +1.0)
        inf_post_high = inflate_shift(inf_post, +1.0)
        fund_inf, ruin_inf = run_scenario(profile, inf_acc_high, inf_post_high)

        # Scenario 2: Pensiun telat 3 tahun — generate fresh inflation for longer horizon
        profile_late  = UserProfile(**{**profile.__dict__, "retirement_age": profile.retirement_age + 3})
        years_late    = profile_late.retirement_age - profile_late.age
        years_post_late = planning_age - profile_late.retirement_age
        inf_full_late = simulate_inflation_paths(
            n_years=max(years_late + years_post_late, 1),
            n_simulations=self.n_sims, random_seed=self.seed + 10
        )
        inf_acc_late  = inf_full_late[:, :years_late]
        inf_post_late = inf_full_late[:, years_late:years_late + years_post_late]
        fund_late, ruin_late = run_scenario(profile_late, inf_acc_late, inf_post_late)

        # Scenario 3: Kontribusi +10%
        profile_more = UserProfile(**{**profile.__dict__, "savings_rate": min(profile.savings_rate + 0.10, 0.90)})
        fund_more, ruin_more = run_scenario(profile_more, inf_acc, inf_post)

        return {
            "base": {
                "fund_p50": round(base_fund_p50),
                "ruin_probability": round(base_ruin_prob, 4),
            },
            "if_inflation_plus_1pct": {
                "fund_p50": round(fund_inf),
                "ruin_probability": round(ruin_inf, 4),
                "ruin_change": round(ruin_inf - base_ruin_prob, 4),
                "fund_change_pct": round((fund_inf / base_fund_p50 - 1) * 100, 1),
            },
            "if_retirement_delayed_3yr": {
                "fund_p50": round(fund_late),
                "ruin_probability": round(ruin_late, 4),
                "ruin_change": round(ruin_late - base_ruin_prob, 4),
                "fund_change_pct": round((fund_late / base_fund_p50 - 1) * 100, 1),
            },
            "if_savings_rate_plus_10pct": {
                "fund_p50": round(fund_more),
                "ruin_probability": round(ruin_more, 4),
                "ruin_change": round(ruin_more - base_ruin_prob, 4),
                "fund_change_pct": round((fund_more / base_fund_p50 - 1) * 100, 1),
            },
        }

    # ------------------------------------------------------------------ #
    #  A/B TEST: Fixed Allocation vs Glide Path
    # ------------------------------------------------------------------ #
    def _ab_test(
        self,
        profile:         UserProfile,
        inflation_paths: np.ndarray,
        planning_age:    int,
    ) -> dict:
        """
        Uji apakah glide path secara signifikan mengurangi ruin probability
        dibanding fixed allocation.
        H0: Tidak ada perbedaan signifikan.
        H1: Glide path lebih baik (ruin probability lebih rendah).
        Uji: Mann-Whitney U Test (non-parametrik).
        """
        from scipy import stats

        # Strategy A: Fixed (pakai profil asli sepanjang waktu, tanpa glide)
        fund_A = self._simulate_accumulation(profile, profile.risk_profile, inflation_paths)
        ruin_A, _ = self._simulate_decumulation(
            fund_A, profile, planning_age, inflation_paths,
            conservative_risk=profile.risk_profile  # Tidak berubah saat pensiun
        )

        # Strategy B: Glide path (geser ke konservatif mendekati dan saat pensiun)
        eff_risk  = get_glide_path_profile(profile.risk_profile, profile.retirement_age - profile.age)
        fund_B = self._simulate_accumulation(profile, eff_risk, inflation_paths)
        ruin_B, _ = self._simulate_decumulation(
            fund_B, profile, planning_age, inflation_paths,
            conservative_risk="conservative"  # Full konservatif saat pensiun
        )

        # Konversi ke numeric untuk uji statistik (1 = ruin, 0 = survive)
        u_stat, p_value = stats.mannwhitneyu(ruin_A.astype(int), ruin_B.astype(int), alternative="greater")

        ruin_A_mean = float(ruin_A.mean())
        ruin_B_mean = float(ruin_B.mean())
        improvement = ruin_A_mean - ruin_B_mean

        return {
            "hypothesis":              "H1: Glide Path (B) menghasilkan ruin probability lebih rendah dari Fixed (A)",
            "strategy_a_fixed":        {"ruin_probability": round(ruin_A_mean, 4), "label": "Fixed Allocation"},
            "strategy_b_glide_path":   {"ruin_probability": round(ruin_B_mean, 4), "label": "Adaptive Glide Path"},
            "improvement":             round(improvement, 4),
            "improvement_pct":         round(improvement / max(ruin_A_mean, 1e-6) * 100, 1),
            "u_statistic":             round(float(u_stat), 2),
            "p_value":                 round(float(p_value), 4),
            "statistically_significant": bool(p_value < 0.05),
            "winner":                  "B (Glide Path)" if ruin_B_mean < ruin_A_mean else "A (Fixed)",
            "interpretation": (
                f"Glide Path mengurangi ruin probability sebesar {improvement*100:.1f} pp. "
                f"{'Perbedaan signifikan secara statistik (p<0.05).' if p_value < 0.05 else 'Perbedaan TIDAK signifikan secara statistik.'}"
            ),
        }

    # ------------------------------------------------------------------ #
    #  GENERATE INSIGHTS
    # ------------------------------------------------------------------ #
    def _generate_insights(
        self,
        profile:         UserProfile,
        actuarial_sum:   dict,
        p50_scenario:    ProjectionScenario,
        sensitivity:     dict,
        ab_result:       dict,
    ) -> list:
        insights = []

        sp = p50_scenario.ruin_probability
        survival_pct = round((1 - sp) * 100, 1)
        insights.append(
            f"Dalam skenario median, dana Anda memiliki peluang {survival_pct}% "
            f"untuk bertahan hingga usia {actuarial_sum['planning_age_recommended']} tahun."
        )

        if sp > 0.30:
            insights.append(
                f"⚠️ Ruin probability Anda ({round(sp*100,1)}%) TINGGI. "
                "Pertimbangkan meningkatkan kontribusi atau menunda usia pensiun."
            )

        delay_impact = sensitivity["if_retirement_delayed_3yr"]["ruin_change"]
        if delay_impact < -0.05:
            insights.append(
                f"Menunda pensiun 3 tahun adalah lever paling efektif: "
                f"menurunkan ruin probability sebesar {abs(delay_impact)*100:.1f} pp "
                f"dan meningkatkan dana sebesar {abs(sensitivity['if_retirement_delayed_3yr']['fund_change_pct'])}%."
            )

        insights.append(
            "Inflasi kesehatan (~1.8× CPI umum) adalah risiko terbesar di usia 65+. "
            "Pertimbangkan asuransi kesehatan seumur hidup untuk melindungi dana pensiun."
        )

        if ab_result["statistically_significant"] and ab_result["winner"].startswith("B"):
            insights.append(
                f"Strategi Glide Path terbukti lebih baik dari Fixed Allocation "
                f"(p-value={ab_result['p_value']}). {ab_result['interpretation']}"
            )

        if profile.savings_rate < 0.20:
            insights.append(
                f"Tingkat tabungan Anda ({profile.savings_rate*100:.0f}%) di bawah rekomendasi minimum 20%. "
                "Tingkatkan secara bertahap 1-2% per tahun seiring kenaikan gaji."
            )

        return insights

    # ------------------------------------------------------------------ #
    #  MAIN CALCULATE METHOD
    # ------------------------------------------------------------------ #
    def calculate(self, profile: UserProfile) -> CalculatorOutput:
        """
        Jalankan kalkulasi penuh. Entry point utama.
        """
        years_to_ret = profile.retirement_age - profile.age
        if years_to_ret <= 0:
            raise ValueError("retirement_age harus lebih besar dari age saat ini.")

        # 1. Aktuarial summary
        actuarial_sum = self.mt.get_planning_summary(
            profile.age, profile.retirement_age, profile.gender
        )
        if profile.custom_planning_age:
            planning_age = profile.custom_planning_age
        else:
            planning_age = actuarial_sum["planning_age_recommended"]

        # 2. Simulasi inflasi (gunakan untuk semua skenario)
        total_horizon = planning_age - profile.age
        inflation_paths = simulate_inflation_paths(
            n_years       = total_horizon,
            n_simulations = self.n_sims,
            random_seed   = self.seed,
            sector        = "general",
        )
        inflation_acc = inflation_paths[:, :years_to_ret]

        # 3. Effective risk profile dengan glide path
        eff_risk = get_glide_path_profile(profile.risk_profile, years_to_ret)

        # 4. Simulasi akumulasi
        fund_sims = self._simulate_accumulation(profile, eff_risk, inflation_acc)

        # 5. Simulasi dekumulasi + ruin probability
        years_post = planning_age - profile.retirement_age
        inf_post   = inflation_paths[:, years_to_ret:years_to_ret + years_post] if years_post > 0 else np.zeros((self.n_sims, 1))

        ruin_flags, depletion_years = self._simulate_decumulation(
            fund_sims, profile, planning_age, inf_post
        )

        # 6. Hitung cumulative inflation factor sampai pensiun (untuk real value)
        avg_inf_acc = inflation_acc.mean(axis=0) / 100
        cum_inflation = np.prod(1 + avg_inf_acc)

        # 7. Build scenarios (P10, P50, P90)
        def build_scenario(pct: int, label: str) -> ProjectionScenario:
            fund_val = float(np.percentile(fund_sims, pct))
            real_val = fund_val / cum_inflation

            # Subset sims untuk percentile band
            lo, hi = max(pct - 5, 0), min(pct + 5, 100)
            mask = (fund_sims >= np.percentile(fund_sims, lo)) & (fund_sims <= np.percentile(fund_sims, hi))
            ruin_sub = ruin_flags[mask].mean() if mask.sum() > 0 else ruin_flags.mean()
            dep_sub  = depletion_years[mask & ~np.isnan(depletion_years)]
            dep_age  = int(np.median(dep_sub)) if len(dep_sub) > 0 else None

            swr = SAFE_WITHDRAWAL_RATES.get(profile.risk_profile, 0.035)
            withdrawal = fund_val * swr

            return ProjectionScenario(
                percentile                = label,
                fund_at_retirement        = round(fund_val),
                real_fund_at_retirement   = round(real_val),
                annual_withdrawal_capacity = round(withdrawal),
                ruin_probability          = round(float(ruin_sub), 4),
                fund_depleted_age         = dep_age,
                note                      = f"Nilai dana dalam IDR nominal saat pensiun usia {profile.retirement_age}",
            )

        scenarios = {
            "pessimistic_p10": build_scenario(10, "P10 — Pesimistis"),
            "median_p50":      build_scenario(50, "P50 — Median"),
            "optimistic_p90":  build_scenario(90, "P90 — Optimistis"),
        }

        p50 = scenarios["median_p50"]

        # 8. Rekomendasi instrumen
        portfolio_stats = get_portfolio_stats(eff_risk)
        alloc = RISK_PROFILES[eff_risk]["allocation"]

        # Monthly contribution analysis
        final_salary = profile.monthly_salary * (1 + get_salary_growth(profile)) ** years_to_ret
        required_nest_egg = final_salary * 12 * profile.replacement_ratio / SAFE_WITHDRAWAL_RATES.get(profile.risk_profile, 0.035)
        gap = round(p50.fund_at_retirement - required_nest_egg)

        recommendations = {
            "effective_risk_profile":       eff_risk,
            "glide_path_applied":           eff_risk != profile.risk_profile,
            "base_profile":                 profile.risk_profile,
            "allocation":                   alloc,
            "portfolio_nominal_return_mean": f"{portfolio_stats['nominal_return_mean']}%",
            "portfolio_std":                f"{portfolio_stats['nominal_return_std']}%",
            "required_nest_egg":            round(required_nest_egg),
            "projected_fund_p50":           p50.fund_at_retirement,
            "fund_gap_positive_means_surplus": gap,
            "is_on_track":                  gap >= 0,
            "monthly_contribution_current": round(profile.monthly_salary * profile.savings_rate),
            "instruments_in_portfolio":     [k for k, v in alloc.items() if v > 0],
        }

        # 9. Sensitivity analysis
        sensitivity = self._sensitivity_analysis(
            profile, float(ruin_flags.mean()), float(np.median(fund_sims)),
            inflation_paths[:, :years_to_ret], planning_age
        )

        # 10. A/B Test
        ab_result = self._ab_test(profile, inflation_acc, planning_age)

        # 11. Insights
        insights = self._generate_insights(profile, actuarial_sum, p50, sensitivity, ab_result)

        # 12. Build final output
        output = CalculatorOutput(
            user_profile   = {
                "name":           profile.name,
                "age":            profile.age,
                "gender":         profile.gender,
                "monthly_salary": profile.monthly_salary,
                "savings_rate":   profile.savings_rate,
                "retirement_age": profile.retirement_age,
                "risk_profile":   profile.risk_profile,
                "sector":         profile.sector,
                "include_pandemic_risk": profile.include_pandemic_risk,
                "custom_deposit_rate": profile.custom_deposit_rate,
            },
            actuarial_summary  = actuarial_sum,
            projection         = {k: asdict(v) if hasattr(v, "__dataclass_fields__") else v.__dict__
                                  for k, v in scenarios.items()},
            recommendations    = recommendations,
            sensitivity        = sensitivity,
            ab_test_result     = ab_result,
            actionable_insights = insights,
            metadata           = {
                "n_simulations":    self.n_sims,
                "random_seed":      self.seed,
                "inflation_model":  "Ornstein-Uhlenbeck (calibrated BPS 2010-2024)",
                "return_model":     "Log-normal with correlation matrix",
                "mortality_source": get_mortality_table()._source,
                "currency":         "IDR",
                "version":          "1.0.0",
            },
        )

        # Fix projection dict (dataclass → dict)
        output.projection = {
            k: {
                "percentile":                  v.percentile,
                "fund_at_retirement":          v.fund_at_retirement,
                "real_fund_at_retirement":     v.real_fund_at_retirement,
                "annual_withdrawal_capacity":  v.annual_withdrawal_capacity,
                "ruin_probability":            v.ruin_probability,
                "fund_depleted_age":           v.fund_depleted_age,
                "note":                        v.note,
            }
            for k, v in scenarios.items()
        }

        return output


# ------------------------------------------------------------------ #
#  HELPER FUNCTIONS
# ------------------------------------------------------------------ #
def inflate_shift(paths: np.ndarray, shift_pct: float) -> np.ndarray:
    """Geser semua nilai inflasi sebesar shift_pct persen."""
    return np.clip(paths + shift_pct, 0.5, 15.0)


def _get_rationale(instrument_key: str, profile: UserProfile) -> str:
    years = profile.retirement_age - profile.age
    rationale_map = {
        "deposito":            "Likuiditas darurat, capital preservation jangka pendek",
        "ori_sbn":             "Return stabil dijamin pemerintah, hedging volatilitas pasar",
        "rd_pasar_uang":       "Likuid, cocok untuk dana darurat dan buffer volatilitas",
        "rd_pendapatan_tetap": "Pendapatan rutin dari kupon, volatilitas lebih rendah dari saham",
        "rd_campuran":         "Balanced growth: diversifikasi antara saham dan obligasi",
        "rd_saham_idx":        (
            f"Horizon {years} tahun cukup panjang untuk absorb volatilitas IDX. "
            "Return historis IDX ~11% nominal per tahun."
        ),
    }
    return rationale_map.get(instrument_key, "")
