import io
import json
import os
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.calculator import RetirementCalculator, UserProfile


def _number(payload, key, default=0):
    try:
        value = payload.get(key, default)
        if value is None:
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


def _optional_number(payload, key):
    value = payload.get(key)
    if value in (None, ""):
        return None

    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _optional_integer(payload, key):
    value = _optional_number(payload, key)
    return int(value) if value is not None else None


def _integer(payload, key, default=0):
    return int(_number(payload, key, default))


def _text(payload, key, default=""):
    value = payload.get(key, default)
    return str(value) if value is not None else default


def _boolean(payload, key, default=False):
    value = payload.get(key, default)
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "y"}
    return bool(value)


def main():
    raw_input = sys.stdin.read()
    payload = json.loads(raw_input or "{}")

    profile = UserProfile(
        name=_text(payload, "name", "User"),
        age=_integer(payload, "age", 30),
        gender=_text(payload, "gender", "male"),
        monthly_salary=_number(payload, "monthly_salary", 0),
        savings_rate=_number(payload, "savings_rate", 0.2),
        retirement_age=_integer(payload, "retirement_age", 55),
        risk_profile=_text(payload, "risk_profile", "moderate"),
        sector=_text(payload, "sector", "Rata-rata"),
        include_pandemic_risk=_boolean(payload, "include_pandemic_risk", False),
        custom_deposit_rate=_optional_number(payload, "custom_deposit_rate"),
        custom_planning_age=_optional_integer(payload, "custom_planning_age"),
        current_assets=_number(payload, "current_assets", 0),
        annual_bonus_months=_number(payload, "annual_bonus_months", 1.0),
        replacement_ratio=_number(payload, "replacement_ratio", 0.7),
        has_health_insurance=_boolean(payload, "has_health_insurance", False),
        monthly_expense=_optional_number(payload, "monthly_expense"),
    )

    calculator = RetirementCalculator()
    result = calculator.calculate(profile)
    print(result.to_json())


if __name__ == "__main__":
    main()
