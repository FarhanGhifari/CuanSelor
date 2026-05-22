import sys
import os
import json
import io

# Force stdout and stderr to UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Ensure this script can import from src/
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.calculator import RetirementCalculator, UserProfile

def main():
    try:
        # Read JSON string from standard input
        input_data = json.load(sys.stdin)
        
        # Construct UserProfile dataclass from JSON input
        profile = UserProfile(
            name=input_data.get("name", "User"),
            age=int(input_data["age"]),
            gender=input_data["gender"],
            monthly_salary=float(input_data["monthly_salary"]),
            savings_rate=float(input_data["savings_rate"]),
            retirement_age=int(input_data["retirement_age"]),
            risk_profile=input_data["risk_profile"],
            sector=input_data.get("sector"),
            include_pandemic_risk=bool(input_data.get("include_pandemic_risk", False)),
            custom_deposit_rate=float(input_data["custom_deposit_rate"]) if input_data.get("custom_deposit_rate") is not None else None,
            custom_planning_age=int(input_data["custom_planning_age"]) if input_data.get("custom_planning_age") is not None else None,
            current_assets=float(input_data.get("current_assets", 0.0)),
            annual_bonus_months=float(input_data.get("annual_bonus_months", 1.0)),
            replacement_ratio=float(input_data.get("replacement_ratio", 0.70)),
            has_health_insurance=bool(input_data.get("has_health_insurance", False)),
            monthly_expense=float(input_data["monthly_expense"]) if input_data.get("monthly_expense") is not None else None
        )
        
        # Initialize and run Monte Carlo simulation
        calculator = RetirementCalculator(n_simulations=10000)
        output = calculator.calculate(profile)
        
        # Write JSON response to standard output
        print(output.to_json())
        sys.exit(0)
        
    except Exception as e:
        # Handle exceptions and write error JSON to stderr
        error_response = {
            "success": False,
            "error": str(e)
        }
        print(json.dumps(error_response), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
