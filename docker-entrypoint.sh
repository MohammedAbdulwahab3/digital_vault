#!/bin/sh
set -e

# First boot: create schema and seed demo data
if [ ! -f /app/data/prod.db ]; then
  echo "▸ First boot — creating database schema…"
  ./node_modules/.bin/prisma db push --skip-generate
  echo "▸ Seeding demo data…"
  ./node_modules/.bin/tsx prisma/seed.ts || echo "⚠ Seed failed (continuing)"
else
  # Apply any schema changes on upgrade
  ./node_modules/.bin/prisma db push --skip-generate
fi

exec node server.js
