#!/usr/bin/env bash
set -euo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
MAESTRO=${MAESTRO_BIN:-$HOME/.maestro/bin/maestro}

[ -f "$HERE/.env.e2e" ] || "$HERE/setup.sh"
set -a
. "$HERE/.env.e2e"
set +a

"$MAESTRO" test \
  --device "${MAESTRO_DEVICE:-18DCA162-A0B7-4245-B9AA-4340F1B291DD}" \
  -e "MAESTRO_ACCESS_TOKEN=$MAESTRO_ACCESS_TOKEN" \
  -e "MAESTRO_REFRESH_TOKEN=$MAESTRO_REFRESH_TOKEN" \
  "$HERE" "$@"
LATEST=$(ls -td "$HOME"/.maestro/tests/*/ 2>/dev/null | head -1)
if [ -n "$LATEST" ]; then
  DEST="$HERE/output/$(basename "${LATEST%/}")"
  rm -rf "$DEST"
  mkdir -p "$DEST"
  cp -R "$LATEST"/. "$DEST/"
  echo "artifacts -> $DEST"
fi
