#!/usr/bin/env sh
# Start the Boys Trip 2026 dev server (Vite)
# Usage: sh scripts/start-system.sh
set -e
cd "$(dirname "$0")/.."
echo "▲ BOYS TRIP 2026 — starting Vite dev server on http://localhost:5173"
exec pnpm run dev --host 127.0.0.1 --port 5173
