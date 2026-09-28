#!/usr/bin/env bash

# ==============================================================================
# Script Menjalankan WhatsApp Bot Agrasena Batch 4
# Diklat Fungsional Pranata Komputer Kejaksaan RI 2026
# Kompatibel: Git Bash (Windows) / WSL / Linux / macOS
# ==============================================================================

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

clear 2>/dev/null || true

echo -e "${CYAN}============================================================${NC}"
echo -e "${GREEN}${BOLD}  🤖 JALANKAN BOT WHATSAPP AGRASENA BATCH 4 KEJAKSAAN RI   ${NC}"
echo -e "${CYAN}  Pusdiklat BPS RI x Badan Diklat Kejaksaan RI (2026)      ${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# 1. Tentukan Folder wa-bot
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOT_DIR="$ROOT_DIR/wa-bot"

if [ ! -d "$BOT_DIR" ]; then
  if [ -f "$ROOT_DIR/index.js" ]; then
    BOT_DIR="$ROOT_DIR"
  else
    echo -e "${RED}[ERROR] Folder 'wa-bot' tidak ditemukan di: $ROOT_DIR${NC}"
    exit 1
  fi
fi

cd "$BOT_DIR" || exit 1
echo -e "${GREEN}[OK]${NC} Direktori Kerja: ${BOLD}$BOT_DIR${NC}"

# 2. Cek Eksekusi Node.js
if ! command -v node &> /dev/null; then
  if [ -d "$LOCALAPPDATA/hermes/node" ]; then
    export PATH="$LOCALAPPDATA/hermes/node:$PATH"
  elif [ -d "$USERPROFILE/AppData/Local/hermes/node" ]; then
    export PATH="$USERPROFILE/AppData/Local/hermes/node:$PATH"
  elif [ -d "/c/Program Files/nodejs" ]; then
    export PATH="/c/Program Files/nodejs:$PATH"
  elif [ -d "/c/Program Files (x86)/nodejs" ]; then
    export PATH="/c/Program Files (x86)/nodejs:$PATH"
  fi
fi

if ! command -v node &> /dev/null; then
  echo -e "${RED}[ERROR] Node.js tidak ditemukan di sistem Anda!${NC}"
  echo -e "${YELLOW}Silakan pasang Node.js dari https://nodejs.org${NC}"
  exit 1
fi

NODE_VER=$(node -v)
echo -e "${GREEN}[OK]${NC} Node.js Runtime: ${BOLD}$NODE_VER${NC}"

# 3. Bebaskan Port 5000 jika Sedang Digunakan Proses Lama
echo -e "${BLUE}[INFO] Memeriksa ketersediaan port 5000...${NC}"
if command -v taskkill.exe &> /dev/null; then
  # Windows / Git Bash
  PIDS=$(cmd.exe //c "netstat -ano" 2>/dev/null | grep ":5000" | grep "LISTENING" | awk '{print $5}' | sort -u)
  for pid in $PIDS; do
    if [ -n "$pid" ] && [ "$pid" != "0" ]; then
      echo -e "${YELLOW}[INFO] Menutup proses lama di port 5000 (PID: $pid)...${NC}"
      taskkill.exe //F //PID "$pid" > /dev/null 2>&1 || true
    fi
  done
elif command -v lsof &> /dev/null; then
  # Linux / macOS
  PIDS=$(lsof -ti :5000 2>/dev/null || true)
  if [ -n "$PIDS" ]; then
    echo -e "${YELLOW}[INFO] Menutup proses lama di port 5000 (PID: $PIDS)...${NC}"
    kill -9 $PIDS 2>/dev/null || true
  fi
fi

# 4. Sinkronisasi File Environment (.env)
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  echo -e "${YELLOW}[INFO] Membuat file .env dari template...${NC}"
  cp .env.example .env
fi

# 5. Cek Dependensi Node Modules
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}[INFO] Memasang paket dependensi (npm install)...${NC}"
  npm install
fi

# 6. Jalankan Bot WhatsApp
echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${GREEN}🚀 Memulai WhatsApp Engine & API Gateway Server (Port 5000)${NC}"
echo -e "${YELLOW}💡 Tekan Ctrl + C kapan saja untuk menghentikan bot.${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

trap 'echo -e "\n${YELLOW}[INFO] Bot WhatsApp telah dihentikan oleh pengguna.${NC}"; exit 0' SIGINT SIGTERM

# Loop Auto-Restart: Menjaga bot tetap hidup secara persisten
while true; do
  node index.js "$@"
  EXIT_CODE=$?
  if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${YELLOW}[INFO] Bot dihentikan secara normal.${NC}"
    break
  fi
  echo -e "\n${YELLOW}⚠️ Bot berhenti (Exit Code: $EXIT_CODE). Menghubungkan ulang dalam 3 detik... (Tekan Ctrl+C untuk keluar)${NC}\n"
  sleep 3
done
