@echo off
color 0E
echo =========================================================
echo.
echo           BIENVENIDO A CHESS PRESTIGE 
echo.
echo =========================================================
echo Iniciando los servidores del juego para ti...
echo.

echo [1/2] Configurando Servidor Backend (Matchmaking)...
cd server
call npm install --silent
start "Chess Prestige - Servidor Backend" cmd /k "color 0A && echo Servidor Backend de Chess Prestige && echo ================================== && node index.js"
cd ..

echo [2/2] Configurando Servidor Frontend (Juego Visual)...
call npm install --silent
start "Chess Prestige - Juego Visual" cmd /k "color 0B && echo Servidor Frontend de Chess Prestige && echo ================================== && npm run dev"

echo.
echo =========================================================
echo ¡Listos! Se han abierto dos consolas negras invisibles.
echo. 
echo 1) Minimiza esta ventana.
echo 2) Ve a tu navegador y entra en: http://localhost:5173
echo.
echo Que disfrutes de grandes partidas y ganancias.
echo =========================================================
pause
