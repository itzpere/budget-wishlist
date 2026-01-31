#!/bin/sh
set -e

echo "Starting WishtoBudget application..."

# Ensure data directory exists
mkdir -p /app/data

# Always run migrations to ensure schema is up to date
echo "Running database migrations..."
node migrate.js || {
  echo "ERROR: Migration failed!"
  exit 1
}

echo "Starting Next.js server..."
exec "$@"
