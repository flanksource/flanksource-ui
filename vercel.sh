#!/bin/sh
set -eu

make skills.download

if [ "${VERCEL_ENV:-}" = "production" ]; then
  npm run build:clerk
else
  npm run build
fi
