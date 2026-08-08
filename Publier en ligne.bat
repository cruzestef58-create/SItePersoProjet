@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo =========================================
echo   PUBLICATION DU SITE SUR GITHUB
echo =========================================
echo.

rem --- Recupere automatiquement les dernieres versions des projets ---
rem     (evite de publier une vieille version en oubliant de la copier a la main)

set "ABYSSE=%USERPROFILE%\Documents\Abysse\dist\Abysse.exe"
if exist "%ABYSSE%" (
  xcopy /D /Y "%ABYSSE%" "%~dp0telechargements\" >nul
  if errorlevel 1 (echo  [!] Abysse : la copie a echoue.) else (echo  [ok] Abysse est a jour.)
) else (
  echo  [-] Abysse introuvable dans Documents\Abysse\dist - ignore.
)

set "TAPEMPIRE=%USERPROFILE%\Documents\Tap Empire"
if exist "%TAPEMPIRE%\index.html" (
  robocopy "%TAPEMPIRE%" "%~dp0jeux\tap-empire" /MIR /XD .claude /NFL /NDL /NJH /NJS /NP >nul
  if errorlevel 8 (echo  [!] Tap Empire : la copie a echoue.) else (echo  [ok] Tap Empire est a jour.)
) else (
  echo  [-] Tap Empire introuvable dans Documents\Tap Empire - ignore.
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
