#!/usr/bin/env bash
# Back up a directory with a timestamp.
set -euo pipefail

readonly SRC="${1:-$HOME/projects}"
DEST="/tmp/backup-$(date +%Y%m%d)"
count=0

log() { printf '[%s] %s\n' "$(date +%T)" "$*" >&2; }

if [[ ! -d "$SRC" ]]; then
  log "missing: $SRC"
  exit 1
fi

mkdir -p "$DEST"
for f in "$SRC"/*.txt; do
  cp -- "$f" "$DEST/" && count=$((count + 1))
done

case "$count" in
  0) log "nothing copied" ;;
  *) log "copied $count files to $DEST" ;;
esac
export LAST_BACKUP="$DEST"
