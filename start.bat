@echo off
echo Starting Expense Tracker...
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend (React)...
start "React Frontend" cmd /k "cd frontend && npm start"

echo.
echo ================================
echo  Expense Tracker Started!
echo ================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:3000 (will open automatically)
echo.
echo Close this window to continue...
timeout /t 5
