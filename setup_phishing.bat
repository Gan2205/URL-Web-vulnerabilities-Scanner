@echo off
echo 🚀 Setting up Phishing Detection for ThreatLens...
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if CSV file exists
if not exist "Phishing_Legitimate_full.csv" (
    echo ❌ Phishing_Legitimate_full.csv not found!
    echo Please ensure the CSV file is in the same directory
    pause
    exit /b 1
)

echo ✅ Python found
echo ✅ CSV file found
echo.

REM Run the setup script
python setup_phishing_detection.py

pause
