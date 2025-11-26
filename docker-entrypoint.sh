#!/bin/bash
set -e

echo "⏳ Mikkeller RC starting up..."

# Wait for database to be ready
echo "🔄 Waiting for database connection..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
  if nc -z -w5 "${PGHOST:-localhost}" "${PGPORT:-5432}" 2>/dev/null; then
    echo "✅ Database is ready"
    break
  fi
  attempt=$((attempt + 1))
  echo "⏳ Attempt $attempt/$max_attempts - Waiting for database..."
  sleep 2
done

if [ $attempt -eq $max_attempts ]; then
  echo "❌ Database connection timeout"
  exit 1
fi

# Run the Node application
echo "🚀 Starting application..."
exec node dist/index.js
