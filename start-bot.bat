@echo off
setlocal enabledelayedexpansion
title WhatsApp Bot Agrasena Batch 3

echo ============================================================
echo   AKTIVASI BOT WHATSAPP DIKLAT PRAKOM AGRASENA BATCH 3
echo   Kejaksaan Republik Indonesia x Pusdiklat BPS RI (2026)
echo ============================================================
echo.

rem 1. Deteksi dan Konfigurasi Path Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\hermes\node\node.exe" (
        set "PATH=%LOCALAPPDATA%\hermes\node;%PATH%"
    ) else if exist "%USERPROFILE%\AppData\Local\hermes\node\node.exe" (
        set "PATH=%USERPROFILE%\AppData\Local\hermes\node;%PATH%"
    ) else if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=C:\Program Files\nodejs;%PATH%"
    ) else if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
        set "PATH=%ProgramFiles(x86)%\nodejs;%PATH%"
    )
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak ditemukan di komputer ini!
    echo Silakan unduh dan install Node.js dari https://nodejs.org
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set "NODE_VER=%%v"
echo [OK] Node.js terdeteksi: !NODE_VER!

rem 2. Tentukan Direktori wa-bot secara dinamis
set "BOT_DIR="
if exist "%~dp0wa-bot\index.js" (
    set "BOT_DIR=%~dp0wa-bot"
) else if exist "%~dp0index.js" (
    set "BOT_DIR=%~dp0"
) else if exist "D:\pROJEK\Web Kelas\wa-bot\index.js" (
    set "BOT_DIR=D:\pROJEK\Web Kelas\wa-bot"
)

if "!BOT_DIR!"=="" (
    echo [ERROR] Direktori wa-bot tidak ditemukan!
    echo Pastikan folder D:\pROJEK\Web Kelas\wa-bot tersedia.
    echo.
    pause
    exit /b 1
)

echo [OK] Lokasi Bot: "!BOT_DIR!"
cd /d "!BOT_DIR!"

rem 3. Periksa apakah port 5000 sedang dipakai oleh proses bot lama
netstat -ano | findstr ":5000" | findstr "LISTENING" > "%TEMP%\port5000_check.tmp" 2>nul
if exist "%TEMP%\port5000_check.tmp" (
    for /f "tokens=5" %%p in (%TEMP%\port5000_check.tmp) do (
        echo [INFO] Menutup proses lama di port 5000 PID %%p
        taskkill /F /PID %%p >nul 2>nul
    )
    del "%TEMP%\port5000_check.tmp" >nul 2>nul
)

rem 4. Periksa folder node_modules
if not exist "node_modules\" (
    echo [INFO] Mengunduh dependensi npm install
    call npm install
)

rem 5. Jalankan Bot WhatsApp
echo.
echo ============================================================
echo [MENJALANKAN] Memulai WhatsApp Bot dan API Gateway Port 5000
echo [INFO] Tekan Ctrl + C untuk menghentikan bot
echo ============================================================
echo.

node index.js

echo.
echo ------------------------------------------------------------
echo [INFO] Bot telah berhenti.
pause
