#!/usr/bin/env bash
# One-shot local setup. Safe to re-run.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▸ Node $(node -v), npm $(npm -v)"
if [ ! -f .env ]; then
  cp env.example .env
  echo "▸ Created .env from env.example — fill in Supabase values (see ENVIRONMENTS.md)"
fi

echo "▸ Installing workspaces"
npm install

echo "▸ Typecheck + lint"
npm run typecheck
npm run lint

echo
echo "Done. Next:"
echo "  npm run dev:api      # http://localhost:4000/health"
echo "  npm run dev:web      # http://localhost:3000"
echo "  npm run dev:mobile   # Expo dev server"
