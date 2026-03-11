@echo off
chcp 65001 >nul
title Beaulieu Property - Build System

echo.
echo ====================================
echo  BEAULIEU PROPERTY - BUILD SYSTEM
echo ====================================
echo.

REM Verifier si Python est installe
python --version >nul 2>&1
if errorlevel 1 (
    echo [ER] Python n'est pas installe ou pas dans le PATH
    echo.
    echo Veuillez installer Python depuis:
    echo https://www.python.org/downloads/
    echo.
    echo Ou utilisez la version PowerShell avec BUILD.bat
    pause
    exit /b 1
)

echo [OK] Python detecte
echo.

REM Executer le generateur
if "%~1"=="" (
    python generate.py
) else (
    python generate.py %*
)

echo.
pause
