@echo off
chcp 65001 >nul
title Beaulieu Property - Mode Watch

echo.
echo 👀 MODE WATCH - Surveillance des fichiers
echo ===========================================
echo.
echo Modifiez les fichiers dans _sources\ ou _partials\
echo Les pages seront régénérées automatiquement.
echo.
echo Appuyez sur Ctrl+C pour arrêter.
echo.

powershell -ExecutionPolicy Bypass -File "build.ps1" -Watch
