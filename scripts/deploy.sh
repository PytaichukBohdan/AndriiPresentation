#!/usr/bin/env bash
# Redeploy static build to Hetzner server boys-trip-2026.
# Server: boys-trip-2026 (id 127431167), cax11, fsn1-dc14
# URL:    http://159.69.191.148/
set -euo pipefail

HOST=root@159.69.191.148
KEY=~/.ssh/id_ed25519
REMOTE=/var/www/boys-trip

cd "$(dirname "$0")/.."

pnpm run build
rsync -az --delete -e "ssh -i $KEY" dist/ "$HOST:$REMOTE/"
ssh -i "$KEY" "$HOST" "chown -R www-data:www-data $REMOTE && systemctl reload nginx"

echo "deployed → http://159.69.191.148/"
