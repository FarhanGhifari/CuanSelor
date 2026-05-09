"""
actuarial.py — Modul Mortalitas & Harapan Hidup

CATATAN AKTUARIS SKEPTIS:
  Tabel mortalitas adalah alat POPULASI, bukan prediksi individu.
  Selalu gunakan P90 longevity untuk financial planning — bukan expected value.
  Seseorang dengan expected death age 75 masih punya ~10% chance hidup sampai 88+.
  Mengabaikan longevity tail risk adalah kesalahan fatal dalam perencanaan pensiun.

Prioritas data:
  1. BPJS mortality table (jika CSV tersedia)
  2. Fallback: Gompertz-Makeham dikalibrasi untuk populasi Indonesia
"""

import numpy as np
import pandas as pd
from pathlib import Path
from typing import Optional, Literal
from financial_advisor_dist.src.config import ACTUARIAL


class MortalityTable:
    """
    Loads dan memproses tabel mortalitas.
    Jika CSV BPJS tidak tersedia, gunakan synthetic Gompertz-Makeham.
    """

    def __init__(self, table_path: Optional[str] = None):
        self.table_path = Path(table_path or ACTUARIAL["mortality_table_path"])
        self._qx_male: dict = {}
        self._qx_female: dict = {}
        self._lx_male: dict = {}
        self._lx_female: dict = {}
        self._max_age: int = 111  # Will be updated from data
        self._source: str = ""
        self._load()

    def _load(self):
        if self.table_path.exists():
            self._load_from_csv()
        else:
            print(
                f"[WARNING] Tabel mortalitas BPJS tidak ditemukan di '{self.table_path}'.\n"
                "          Menggunakan synthetic Gompertz-Makeham (Indonesia-calibrated).\n"
                "          Ganti dengan data BPJS asli untuk akurasi lebih tinggi."
            )
            self._load_gompertz_synthetic()

    def _load_from_csv(self):
        """Load dari CSV TMPI / BPJS yang disediakan user."""
        df = pd.read_csv(self.table_path)
        required_cols = {"age", "qx_male", "qx_female"}
        missing = required_cols - set(df.columns)
        if missing:
            raise ValueError(f"Kolom berikut tidak ada di CSV mortalitas: {missing}")

        self._max_age = int(df["age"].max())

        # Interpolasi untuk usia yang mungkin loncat
        full_ages = pd.DataFrame({"age": range(0, self._max_age + 1)})
        df = full_ages.merge(df[["age", "qx_male", "qx_female"]], on="age", how="left")
        df = df.interpolate(method="cubic")
        df["qx_male"]   = df["qx_male"].clip(0.0001, 1.0)
        df["qx_female"] = df["qx_female"].clip(0.0001, 1.0)
        # Force qx = 1 at terminal age
        df.loc[df["age"] == self._max_age, ["qx_male", "qx_female"]] = 1.0

        self._qx_male   = dict(zip(df["age"], df["qx_male"]))
        self._qx_female = dict(zip(df["age"], df["qx_female"]))
        self._compute_lx()
        self._source = f"TMPI 2023 (BPJS/PAI/ITB): {self.table_path.name}"

    def _load_gompertz_synthetic(self):
        """
        Fallback: Gompertz-Makeham model dikalibrasi ke Indonesia.
        mu_x = A + B * c^x
        Referensi: TMI III (AAJI/OJK) approximate values.
        """
        # Gompertz-Makeham parameters (Indonesia male/female approximation)
        params = {
            "male":   {"A": 0.0007, "B": 0.000060, "c": 1.0915},
            "female": {"A": 0.0004, "B": 0.000035, "c": 1.0920},
        }
        for gender, p in params.items():
            qx_dict = {}
            for age in range(0, 101):
                if age == 100:
                    qx_dict[age] = 1.0
                else:
                    # Force of mortality
                    mu = p["A"] + p["B"] * (p["c"] ** age)
                    # qx ≈ 1 - exp(-mu) for small mu, capped
                    qx = min(1 - np.exp(-mu), 1.0)
                    # Add infant/child mortality bump for realism
                    if age == 0:
                        qx = max(qx, 0.024)
                    elif age < 5:
                        qx = max(qx, 0.003 - age * 0.0005)
                    qx_dict[age] = max(qx, 0.0001)
            if gender == "male":
                self._qx_male = qx_dict
            else:
                self._qx_female = qx_dict

        self._compute_lx()
        self._source = "Synthetic Gompertz-Makeham (Indonesia-calibrated, fallback)"

    def _compute_lx(self):
        """Hitung lx (jumlah hidup) dari qx. Radix = 100,000."""
        radix = 100_000
        for gender in ["male", "female"]:
            qx = self._qx_male if gender == "male" else self._qx_female
            lx = {}
            lx[0] = radix
            for age in range(0, self._max_age):
                lx[age + 1] = lx[age] * (1 - qx.get(age, 1.0))
            lx[self._max_age] = 0
            if gender == "male":
                self._lx_male = lx
            else:
                self._lx_female = lx

    def get_qx(self, age: int, gender: Literal["male", "female"]) -> float:
        """Probabilitas meninggal dalam setahun pada usia `age`."""
        qx = self._qx_male if gender == "male" else self._qx_female
        return qx.get(int(age), 1.0)

    def survival_probability(
        self,
        current_age: int,
        target_age: int,
        gender: Literal["male", "female"],
    ) -> float:
        """P(masih hidup di target_age | masih hidup di current_age)."""
        if target_age <= current_age:
            return 1.0
        lx = self._lx_male if gender == "male" else self._lx_female
        l_current = lx.get(int(current_age), 1)
        l_target  = lx.get(int(target_age), 0)
        if l_current == 0:
            return 0.0
        return l_target / l_current

    def expected_remaining_life(
        self, age: int, gender: Literal["male", "female"]
    ) -> float:
        """Harapan hidup sisa (curtate life expectancy) dari usia `age`."""
        lx = self._lx_male if gender == "male" else self._lx_female
        l_x = lx.get(int(age), 0)
        if l_x == 0:
            return 0.0
        ex = sum(lx.get(t, 0) for t in range(int(age) + 1, self._max_age + 1)) / l_x
        return round(ex, 2)

    def get_longevity_percentile(
        self,
        current_age: int,
        gender: Literal["male", "female"],
        percentile: float = 0.90,
    ) -> int:
        """
        Usia di mana (1 - percentile) dari populasi masih hidup.
        Contoh: percentile=0.90 → usia di mana 10% populasi masih hidup.
        """
        for target_age in range(int(current_age) + 1, self._max_age + 1):
            sp = self.survival_probability(current_age, target_age, gender)
            if sp <= (1 - percentile):
                return target_age
        return self._max_age

    def get_planning_summary(
        self, current_age: int, retirement_age: int, gender: Literal["male", "female"]
    ) -> dict:
        """Ringkasan aktuarial lengkap untuk satu individu."""
        expected_death = current_age + self.expected_remaining_life(current_age, gender)
        p50_survival   = self.get_longevity_percentile(current_age, gender, 0.50)
        p75_survival   = self.get_longevity_percentile(current_age, gender, 0.75)
        p90_survival   = self.get_longevity_percentile(current_age, gender, 0.90)

        planning_age   = p90_survival  # Gunakan P90 untuk planning
        horizon_post_retirement = max(planning_age - retirement_age, 0)

        return {
            "source":                    self._source,
            "current_age":               current_age,
            "gender":                    gender,
            "expected_death_age":        round(expected_death, 1),
            "p50_survival_age":          p50_survival,
            "p75_survival_age":          p75_survival,
            "p90_survival_age":          p90_survival,
            "planning_age_recommended":  planning_age,
            "years_to_retirement":       retirement_age - current_age,
            "planning_horizon_post_retirement": horizon_post_retirement,
            "survival_prob_at_retirement": round(
                self.survival_probability(current_age, retirement_age, gender), 4
            ),
            "longevity_risk_flag": expected_death < (retirement_age + 15),
            "warning": (
                "Harapan hidup mendekati target pensiun. Pertimbangkan pensiun lebih awal "
                "atau perlindungan asuransi jiwa tambahan."
                if expected_death < (retirement_age + 15) else None
            ),
        }


# Singleton instance (lazy-loaded)
_mortality_table: Optional[MortalityTable] = None


def get_mortality_table() -> MortalityTable:
    global _mortality_table
    if _mortality_table is None:
        _mortality_table = MortalityTable()
    return _mortality_table
