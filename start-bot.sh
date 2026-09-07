#!/usr/bin/env bash

# ==============================================================================
# Script Aktivasi Bot WhatsApp Agrasena Batch 3 Kejaksaan RI Tahun 2026
# Kompatibel: Linux / macOS / WSL / Git Bash (Windows)
# ==============================================================================

set -e

# Warna Terminal
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}============================================================${NC}"
echo -e "${GREEN}  🤖 AKTIVASI BOT WHATSAPP DIKLAT PRAKOM AGRASENA BATCH 3  ${NC}"
echo -e "${CYAN}  Kejaksaan Republik Indonesia x Pusdiklat BPS RI (2026)    ${NC}"
echo -e "${CYAN}============================================================${NC}"

# Menentukan path direktori script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOT_DIR="$SCRIPT_DIR/wa-bot"

if [ ! -d "$BOT_DIR" ]; then
  # Jika script dipanggil langsung dari dalam folder wa-bot
  if [ -f "$SCRIPT_DIR/index.js" ]; then
    BOT_DIR="$SCRIPT_DIR"
  else
    echo -e "${RED}[Error] Folder 'wa-bot' tidak ditemukan di: $SCRIPT_DIR${NC}"
    exit 1
  fi
fi

cd "$BOT_DIR"

# 1. Cek ketersediaan Node.js
if ! command -v node &> /dev/null; then
  echo -e "${RED}[Error] Node.js belum terinstall atau belum masuk ke PATH sistem Anda.${NC}"
  echo -e "${YELLOW}Silakan unduh & install Node.js (v18+) dari: https://nodejs.org${NC}"
  exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js terdeteksi:${NC} $NODE_VERSION"

# 2. Cek apakah node_modules sudah terinstall
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}[Info] Folder node_modules belum ada. Menjalankan npm install...${NC}"
  npm install
fi

# 3. Mode Eksekusi: PM2 atau Langsung Node.js
USE_PM2=false
if [ "$1" == "--daemon" ] || [ "$1" == "-d" ] || [ "$1" == "--pm2" ]; then
  USE_PM2=true
fi

if [ "$USE_PM2" = true ]; then
  if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}[PM2] Menjalankan bot di latar belakang (daemon)...${NC}"
    pm2 start index.js --name "agrasena-wa-bot"
    pm2 save
    echo -e "${GREEN}✓ Bot berhasil aktif via PM2! Ketik 'pm2 logs agrasena-wa-bot' untuk melihat log.${NC}"
    exit 0
  else
    echo -e "${YELLOW}[Peringatan] PM2 tidak terpasang secara global. Beralih ke mode interaktif biasa...${NC}"
  fi
fi

# 4. Menjalankan Bot secara langsung (Interactive Console)
echo -e "${GREEN}[Menjalankan] Memulai WhatsApp Engine & API Gateway di port 5000...${NC}"
echo -e "${YELLOW}Tekan Ctrl + C untuk menghentikan bot.${NC}"
echo "------------------------------------------------------------"

exec node index.js
