@echo off
title WhatsApp Bot Agrasena Batch 4 - Kejaksaan RI
color 0A
cls
echo ============================================================
echo   BOT WHATSAPP AGRASENA BATCH 4 - KEJAKSAAN RI 2026
echo ============================================================
echo.

cd /d "%~dp0wa-bot"

echo [1/3] Memeriksa Node.js runtime...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak ditemukan! Silakan install Node.js dari https://nodejs.org
    pause
    exit /b 1
)

echo [2/3] Membebaskan port 5000 jika ada proses lama...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    if not "%%a"=="" (
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo [3/3] Memulai Bot WhatsApp...
echo.
echo ============================================================
echo Tekan Ctrl + C untuk menghentikan bot.
echo ============================================================
echo.

node index.js
pause
