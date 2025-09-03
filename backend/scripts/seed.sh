#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

DB_URL="${DATABASE_URL:-postgres://postgres:postgres@localhost:5432/store_ratings}"

psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$ROOT_DIR/scripts/seed.sql"
echo "Seed data applied to $DB_URL"

