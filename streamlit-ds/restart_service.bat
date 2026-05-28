@echo off
REM Batch script untuk restart FastAPI service dengan N_SIMULATIONS=10000

echo ========================================
echo Restarting FastAPI Service
echo ========================================
echo.

REM 1. Kill existing service
echo [1/3] Stopping existing service...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8001 ^| findstr LISTENING') do (
    echo Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

REM 2. Verify port is free
echo [2/3] Verifying port 8001 is free...
netstat -ano | findstr :8001 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 8001 still in use. Waiting 5 seconds...
    timeout /t 5 /nobreak >nul
)

REM 3. Start service
echo [3/3] Starting FastAPI service with N_SIMULATIONS=10000...
echo.
echo Service will start in a new window.
echo Check the window for startup logs.
echo.
echo Expected output:
echo   [CONFIG] N_SIMULATIONS: 10000
echo   [FASTAPI] Calculator initialized in X.XXs
echo   [FASTAPI] Ready to accept requests
echo.

start "FastAPI Service" cmd /k "cd /d "%~dp0" && python api_server.py"

timeout /t 3 /nobreak >nul

REM 4. Verify service is running
echo ========================================
echo Verifying service...
echo ========================================
echo.

curl -s http://localhost:8001/health

echo.
echo ========================================
echo Done!
echo ========================================
echo.
echo If n_simulations shows 10000, the service is ready.
echo If not, check the service window for errors.
echo.
pause
