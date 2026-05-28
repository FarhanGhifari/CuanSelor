"""
FastAPI server untuk kalkulasi proyeksi pensiun.
Wrapper untuk RetirementCalculator yang sudah ada di src/calculator.py
TIDAK mengubah logika calculator sama sekali.
"""
import os
import sys
import time
from pathlib import Path
from contextlib import asynccontextmanager
from dataclasses import asdict
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add src to path untuk import calculator
sys.path.insert(0, str(Path(__file__).parent / "src"))

from calculator import RetirementCalculator, UserProfile

# Configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8001"))
N_SIMULATIONS = int(os.getenv("N_SIMULATIONS", "10000"))
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5000").split(",")

print(f"[CONFIG] N_SIMULATIONS: {N_SIMULATIONS}")
print(f"[CONFIG] PORT: {PORT}")


# Pydantic models untuk API validation
class UserProfileInput(BaseModel):
    """Input model untuk kalkulasi proyeksi pensiun"""
    name: str = Field(..., description="Nama user")
    age: int = Field(..., ge=17, le=80, description="Usia saat ini")
    gender: str = Field(..., pattern="^(male|female)$", description="Jenis kelamin")
    monthly_salary: float = Field(..., ge=0, description="Gaji bulanan")
    savings_rate: float = Field(..., ge=0, le=1, description="Persentase tabungan (0-1)")
    retirement_age: int = Field(..., ge=18, le=80, description="Usia pensiun target")
    risk_profile: str = Field(
        ..., pattern="^(conservative|moderate|aggressive)$", description="Profil risiko"
    )
    sector: Optional[str] = Field(None, description="Sektor pekerjaan (BPS category)")
    include_pandemic_risk: bool = Field(default=False, description="Include pandemic risk")
    custom_deposit_rate: Optional[float] = Field(
        None, ge=0, le=1, description="Custom deposit rate (0-1)"
    )
    custom_planning_age: Optional[int] = Field(None, ge=18, le=100, description="Custom planning age")
    current_assets: float = Field(default=0, ge=0, description="Aset saat ini")
    annual_bonus_months: float = Field(default=1.0, ge=0, description="Bonus tahunan dalam bulan")
    replacement_ratio: float = Field(
        default=0.7, ge=0, le=2, description="Replacement ratio (0-2)"
    )
    has_health_insurance: bool = Field(default=False, description="Punya asuransi kesehatan")
    monthly_expense: Optional[float] = Field(None, ge=0, description="Pengeluaran bulanan")


class CalculationResponse(BaseModel):
    """Response model untuk hasil kalkulasi"""
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None
    computation_time: Optional[float] = None


# Global calculator instance (singleton)
calculator = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager untuk startup/shutdown"""
    global calculator
    
    # Startup: Load calculator sekali
    print("[FASTAPI] Starting up...")
    print(f"[FASTAPI] Initializing calculator with {N_SIMULATIONS} simulations...")
    start_time = time.time()
    
    calculator = RetirementCalculator(n_simulations=N_SIMULATIONS)
    
    init_time = time.time() - start_time
    print(f"[FASTAPI] Calculator initialized in {init_time:.2f}s")
    print("[FASTAPI] Ready to accept requests")
    
    yield
    
    # Shutdown
    print("[FASTAPI] Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="CuanSelor Projection Calculator API",
    description="FastAPI wrapper untuk RetirementCalculator - TIDAK mengubah logika calculator",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "CuanSelor Projection Calculator",
        "status": "running",
        "n_simulations": N_SIMULATIONS,
    }


@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "calculator_loaded": calculator is not None,
        "n_simulations": N_SIMULATIONS,
    }


@app.post("/calculate", response_model=CalculationResponse)
async def calculate_projection(input_data: UserProfileInput):
    """
    Endpoint untuk kalkulasi proyeksi pensiun.
    Wrapper untuk RetirementCalculator.calculate() - TIDAK mengubah logika.
    
    Args:
        input_data: Data profil user
        
    Returns:
        Hasil kalkulasi proyeksi pensiun
    """
    if calculator is None:
        raise HTTPException(
            status_code=503,
            detail="Calculator not initialized"
        )
    
    try:
        start_time = time.time()
        
        print(f"[CALCULATOR] Starting calculation for {input_data.name}")
        
        # Create UserProfile object (dataclass dari calculator.py)
        profile = UserProfile(
            name=input_data.name,
            age=input_data.age,
            gender=input_data.gender,
            monthly_salary=input_data.monthly_salary,
            savings_rate=input_data.savings_rate,
            retirement_age=input_data.retirement_age,
            risk_profile=input_data.risk_profile,
            sector=input_data.sector,
            include_pandemic_risk=input_data.include_pandemic_risk,
            custom_deposit_rate=input_data.custom_deposit_rate,
            custom_planning_age=input_data.custom_planning_age,
            current_assets=input_data.current_assets,
            annual_bonus_months=input_data.annual_bonus_months,
            replacement_ratio=input_data.replacement_ratio,
            has_health_insurance=input_data.has_health_insurance,
            monthly_expense=input_data.monthly_expense,
        )
        
        # Call calculator.calculate() - TIDAK diubah logikanya
        result = calculator.calculate(profile)
        
        computation_time = time.time() - start_time
        print(f"[CALCULATOR] Completed in {computation_time:.2f}s")
        
        # Convert dataclass to dict
        result_dict = asdict(result)
        
        return CalculationResponse(
            success=True,
            data={
                **result_dict,
                "computation_time": computation_time,
            },
            computation_time=computation_time
        )
        
    except Exception as e:
        print(f"[ERROR] Calculation failed: {str(e)}")
        import traceback
        traceback.print_exc()
        
        raise HTTPException(
            status_code=500,
            detail=f"Calculation failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    
    print(f"[FASTAPI] Starting server on {HOST}:{PORT}")
    uvicorn.run(
        app,
        host=HOST,
        port=PORT,
        log_level="info",
    )
