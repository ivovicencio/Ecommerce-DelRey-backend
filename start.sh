#!/bin/sh
echo "Running seed script..."
node scripts/seed-admin.js || echo "Seed failed (may be transient), continuing..."
echo "Starting server..."
node index.js