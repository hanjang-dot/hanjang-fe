#!/usr/bin/env bash
# Android E2E: seeds BE, mints JWTs, runs maestro flows on the emulator.
# Prereqs: emulator booted, dev client installed, Metro on :8081,
#          hanjang-be on :5500.
set -euo pipefail
cd "$(dirname "$0")"

ADB="${ADB:-/opt/homebrew/share/android-commandlinetools/platform-tools/adb}"
MAESTRO="${MAESTRO:-$HOME/.maestro/bin/maestro}"
OUT=output-android
mkdir -p "$OUT"

eval "$(bash seed.sh)"
eval "$(node mint-token.js "$E2E_USER_ID")"

"$ADB" reverse tcp:8091 tcp:8091 || true

rm -rf "$HOME/.maestro/tests" "$OUT"/*.png

UDID_ARGS=()
if [ -n "${EMULATOR_UDID:-}" ]; then
  UDID_ARGS=(--udid "$EMULATOR_UDID")
fi

"$MAESTRO" "${UDID_ARGS[@]}" test flows/ \
  -e E2E_ACCESS_TOKEN="$E2E_ACCESS_TOKEN" \
  -e E2E_REFRESH_TOKEN="$E2E_REFRESH_TOKEN" \
  --format junit --output "$OUT/report.xml"

find "$HOME/.maestro/tests" -name '*.png' -exec cp {} "$OUT/" \; 2>/dev/null || true
echo "screenshots: $OUT"
