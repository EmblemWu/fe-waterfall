#!/usr/bin/env bash
set -euo pipefail

PORT="${E2E_PORT:-4501}"
HOST="127.0.0.1"

pnpm build >/tmp/fe-waterfall-e2e-build.log 2>&1
pnpm preview --host "$HOST" --port "$PORT" --strictPort >/tmp/fe-waterfall-e2e-preview.log 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT

for _ in $(seq 1 60); do
  if curl -fsS "http://$HOST:$PORT" >/tmp/fe-waterfall-e2e-index.html 2>/dev/null; then
    if grep -q '<div id="root"></div>' /tmp/fe-waterfall-e2e-index.html; then
      break
    fi
  fi
  sleep 0.5
done

pnpm exec playwright test --config playwright.config.ts
