@echo off
chcp 65001 >nul
title Beaulieu Property - Generation des pages

echo.
echo ====================================
echo  BEAULIEU PROPERTY - BUILD SYSTEM
echo ====================================
echo.

REM Verifier que les dossiers existent
if not exist "_partials\" (
    echo ERREUR: Dossier _partials non trouve
    pause
    exit /b 1
)

if not exist "_sources\" (
    echo ERREUR: Dossier _sources non trouve
    pause
    exit /b 1
)

echo Generation des pages en cours...
echo.

REM Pour chaque fichier source
for %%f in (_sources\*.html) do (
    echo Generation de: %%~nf.html
    
    REM Creer le fichier en assemblant les partials
    copy /Y "_partials\head-start.html" "%%~nf.html" >nul
    
    REM Ajouter les meta specifiques (a completer manuellement pour l'instant)
    echo ^<title^>%%~nf^</title^> >> "%%~nf.html"
    
    REM Ajouter les meta communs
    type "_partials\head-meta.html" >> "%%~nf.html"
    
    REM Fermer le head
    type "_partials\head-end.html" >> "%%~nf.html"
    
    REM Ajouter le header
    type "_partials\header.html" >> "%%~nf.html"
    
    REM Ajouter le contenu source
    type "%%f" >> "%%~nf.html"
    
    REM Ajouter le footer
    type "_partials\footer.html" >> "%%~nf.html"
    
    echo [OK] %%~nf.html genere
)

echo.
echo ====================================
echo  Generation terminee avec succes
echo ====================================
echo.
pause
