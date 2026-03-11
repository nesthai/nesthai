@echo off
chcp 65001 >nul
title Beaulieu Property - Build System

echo.
echo 🔨 BEAULIEU PROPERTY - BUILD SYSTEM
echo ====================================
echo.

REM Vérifier si PowerShell est disponible
powershell -Command "Get-Host" >nul 2>&1
if errorlevel 1 (
    echo ❌ PowerShell n'est pas disponible sur ce système.
    echo.
    echo Veuillez installer PowerShell ou utiliser une version plus récente de Windows.
    pause
    exit /b 1
)

REM Exécuter le script PowerShell
if "%~1"=="" (
    powershell -ExecutionPolicy Bypass -File "build.ps1"
) else (
    powershell -ExecutionPolicy Bypass -File "build.ps1" %*
)

echo.
pause
