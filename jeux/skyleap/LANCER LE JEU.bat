@echo off
title SKYLEAP - Parkour
cd /d "%~dp0"
echo Demarrage de SKYLEAP...
start "" "http://localhost:8765"
python -m http.server 8765
pause
