#!/usr/bin/env bash
# Run Lighthouse against the local dev server (or any URL).
#
# Usage:
#   ./scripts/lighthouse.sh                       # against http://localhost:3000
#   ./scripts/lighthouse.sh http://127.0.0.1:3100 # against the preview port
#   ./scripts/lighthouse.sh https://brain-studio-kappa.vercel.app/  # production
#
# Outputs ./lighthouse.html. Performance budget target: 85+.
set -euo pipefail

URL="${1:-http://localhost:3000}"
echo "→ Lighthouse: $URL"
pnpm dlx lighthouse "$URL" \
  --preset=desktop \
  --output=html \
  --output-path=./lighthouse.html \
  --chrome-flags="--headless=new --no-sandbox" \
  --quiet
echo "✓ wrote ./lighthouse.html"
