@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo =========================================
echo   PUBLICATION DU SITE SUR GITHUB
echo =========================================
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
