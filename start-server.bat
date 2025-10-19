@echo off
REM Torah QA Explorer - Simple Server Launcher
REM This is a simple batch file that keeps the server running

setlocal
title Torah QA Explorer - Dev Server

echo ================================================
echo   Torah QA Explorer - Starting Server
echo ================================================
echo.

:CHECK_PORT
echo [1/3] Checking port 8080...
netstat -ano | findstr :8080 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo WARNING: Port 8080 is already in use!
    echo.
    set /p KILL="Kill existing process? (y/n): "
    if /i "%KILL%"=="y" (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
            echo Killing process %%a...
            taskkill /F /PID %%a >nul 2>&1
        )
        timeout /t 2 /nobreak >nul
        goto CHECK_PORT
    )
) else (
    echo OK: Port 8080 is available
)
echo.

:CHECK_DEPS
echo [2/3] Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
) else (
    echo OK: Dependencies installed
)
echo.

:START_SERVER
echo [3/3] Starting server...
echo ================================================
echo.
echo Server URL: http://localhost:8080
echo.
echo IMPORTANT: Keep this window open!
echo Press Ctrl+C to stop the server
echo.
echo ================================================
echo.

REM Run the server and capture exit code
call npm run dev
set EXIT_CODE=%errorlevel%

echo.
echo ================================================
echo Server stopped! (Exit Code: %EXIT_CODE%)
echo ================================================
echo.

if %EXIT_CODE% neq 0 (
    echo ERROR: Server exited with error code %EXIT_CODE%
    echo.
    set /p RESTART="Restart server? (y/n): "
    if /i "%RESTART%"=="y" goto START_SERVER
)

echo.
pause
