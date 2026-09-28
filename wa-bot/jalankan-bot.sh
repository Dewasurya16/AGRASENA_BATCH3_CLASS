#!/usr/bin/env bash

# Jalankan script utama dari root project jika ada, atau jalankan langsung dari folder ini
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$DIR/../jalankan-bot.sh" ]; then
  bash "$DIR/../jalankan-bot.sh" "$@"
else
  node index.js "$@"
fi
