#!/usr/bin/env bash
set -euo pipefail

# Usage: DATABASE_URL=postgres://user:pass@host:port/db ./scripts/init_db.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

DB_URL="${DATABASE_URL:-postgres://postgres:postgres@localhost:5432/store_ratings}"

psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$ROOT_DIR/src/db/schema.sql"
echo "DB schema applied to $DB_URL"

set -euo pipefail
DB_URL=postgres://postgres:postgres@localhost:5432/store_ratings
psql  -v ON_ERROR_STOP=1 -f /usr/bin/../src/db/schema.sql
echo DB
