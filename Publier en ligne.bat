@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo =========================================
echo   PUBLICATION DU SITE SUR GITHUB
echo =========================================
echo.

rem --- Recupere automatiquement la derniere version d'Abysse ---
rem     (evite de publier un vieux .exe en oubliant de le copier a la main)
set "ABYSSE=%USERPROFILE%\Documents\Abysse\dist\Abysse.exe"
if exist "%ABYSSE%" (
  echo Verification de la version d'Abysse...
  xcopy /D /Y "%ABYSSE%" "%~dp0telechargements\" >nul
  if errorlevel 1 (
    echo    ATTENTION : la copie d'Abysse a echoue.
  ) else (
    echo    Abysse est a jour.
  )
) else (
  echo Abysse introuvable dans Documents\Abysse\dist - ignore.
)
echo.

if not exist ".git" (
  echo Premiere publication : preparation du depot...
  git init -b main
  git remote add origin https://github.com/cruzestef58-create/SItePersoProjet.git
)
git add -A
git commit -m "Mise a jour du site"
if errorlevel 1 echo Rien de nouveau a envoyer, on pousse quand meme...
git push -u origin main
echo.
echo =========================================
echo   Termine !
echo   Ton site : https://cruzestef58-create.github.io/SItePersoProjet/
echo =========================================
echo.
pause
