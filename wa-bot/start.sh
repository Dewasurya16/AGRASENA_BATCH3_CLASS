#!/usr/bin/env bash

# Shortcut aktivasi dari dalam folder wa-bot
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/../aktifkan-wa.sh" ]; then
  bash "$SCRIPT_DIR/../aktifkan-wa.sh" "$@"
else
  node index.js "$@"
fi
