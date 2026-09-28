#!/usr/bin/env bash

# ==============================================================================
# Script Aktivasi WhatsApp Bot Agrasena Batch 4
# Diklat Fungsional Pranata Komputer Kejaksaan RI 2026
# Kompatibel: Git Bash (Windows) / WSL / Linux / macOS
# ==============================================================================

# Warna Terminal
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}============================================================${NC}"
echo -e "${GREEN}${BOLD}  🤖 AKTIVASI BOT WHATSAPP AGRASENA BATCH 4 KEJAKSAAN RI   ${NC}"
echo -e "${CYAN}  Pusdiklat BPS RI x Badan Diklat Kejaksaan RI (2026)      ${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# 1. Tentukan Direktori wa-bot Secara Dinamis
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOT_DIR="$SCRIPT_DIR/wa-bot"

if [ ! -d "$BOT_DIR" ]; then
  if [ -f "$SCRIPT_DIR/index.js" ]; then
    BOT_DIR="$SCRIPT_DIR"
  else
    echo -e "${RED}[ERROR] Folder 'wa-bot' tidak ditemukan di: $SCRIPT_DIR${NC}"
    exit 1
  fi
fi

cd "$BOT_DIR"
echo -e "${GREEN}[OK]${NC} Direktori Bot: ${BOLD}$BOT_DIR${NC}"

# 2. Deteksi Node.js (Mendukung Path Khusus Windows & Git Bash)
if ! command -v node &> /dev/null; then
  # Cek lokasi alternatif Node di Windows
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
  echo -e "${YELLOW}Silakan install Node.js (v18+) dari: https://nodejs.org${NC}"
  exit 1
fi

NODE_VER=$(node -v)
echo -e "${GREEN}[OK]${NC} Node.js terdeteksi: ${BOLD}$NODE_VER${NC}"

# 3. Mode Cek Status Singkat (--status)
if [ "$1" == "--status" ] || [ "$1" == "-s" ]; then
  echo -e "${BLUE}[INFO] Memeriksa status bot di port 5000...${NC}"
  if command -v curl &> /dev/null; then
    curl -s http://localhost:5000/status || echo -e "${YELLOW}Bot offline atau tidak merespons di http://localhost:5000${NC}"
  else
    node -e "const http = require('http'); http.get('http://localhost:5000/status', res => { res.pipe(process.stdout); }).on('error', e => console.log('Bot offline.'));"
  fi
  echo ""
  exit 0
fi

# 4. Mode Stop / Matikan Bot (--stop)
if [ "$1" == "--stop" ] || [ "$1" == "-k" ]; then
  echo -e "${YELLOW}[INFO] Menutup proses bot yang aktif di port 5000...${NC}"
  if command -v taskkill.exe &> /dev/null; then
    # Di lingkungan Windows / Git Bash
    for pid in $(cmd.exe //c "netstat -ano" 2>/dev/null | grep ":5000" | grep "LISTENING" | awk '{print $5}'); do
      if [ -n "$pid" ] && [ "$pid" != "0" ]; then
        echo -e "${YELLOW}[INFO] Menghentikan PID $pid...${NC}"
        taskkill.exe //F //PID "$pid" > /dev/null 2>&1 || true
      fi
    done
  fi
  echo -e "${GREEN}[OK] Proses bot telah dihentikan.${NC}"
  exit 0
fi

# 5. Bebaskan Port 5000 Jika Sedang Terpakai Oleh Proses Bot Lama
echo -e "${BLUE}[INFO] Memeriksa port 5000...${NC}"
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

# 6. Pastikan File .env Tersedia
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  echo -e "${YELLOW}[Info] Membuat file .env dari .env.example...${NC}"
  cp .env.example .env
fi

# 7. Pastikan Dependensi npm Terpasang
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}[Info] Mengunduh dependensi npm (ini hanya berlangsung sekali)...${NC}"
  npm install
fi

# 8. Opsi Background Mode / PM2
if [ "$1" == "--daemon" ] || [ "$1" == "-d" ] || [ "$1" == "--pm2" ]; then
  if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}[PM2] Menjalankan bot di latar belakang...${NC}"
    pm2 delete agrasena-wa-bot > /dev/null 2>&1 || true
    pm2 start index.js --name "agrasena-wa-bot"
    pm2 save
    echo -e "${GREEN}✓ Bot berhasil aktif di latar belakang (PM2)!${NC}"
    echo -e "${CYAN}Gunakan 'pm2 logs agrasena-wa-bot' untuk melihat log.${NC}"
    exit 0
  fi
fi

# 9. Jalankan Bot WhatsApp Secara Interaktif
echo ""
echo -e "${CYAN}============================================================${NC}"
echo -e "${GREEN}[MENJALANKAN] Memulai WhatsApp Engine & API Gateway Port 5000${NC}"
echo -e "${YELLOW}[INFO] Tekan Ctrl + C untuk menghentikan bot kapan saja.${NC}"
echo -e "${CYAN}============================================================${NC}"
echo ""

# Tangani sinyal keluar dengan rapi
trap 'echo -e "\n${YELLOW}[INFO] Bot WhatsApp telah dihentikan.${NC}"; exit 0' SIGINT SIGTERM

exec node index.js
