#!/usr/bin/env bash
# Generate PNG icons for the PWA manifest from icon.svg
# Requires: Inkscape or rsvg-convert (from librsvg) or ImageMagick
#
# Usage:
#   ./scripts/generate-icons.sh
#
# Output:
#   public/icon-192.png  — 192x192 PNG (required by manifest.json)
#   public/icon-512.png  — 512x512 PNG (required by manifest.json, used as maskable)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_DIR="$SCRIPT_DIR/../public"
SVG="$PUBLIC_DIR/icon.svg"

if [ ! -f "$SVG" ]; then
  echo "Error: $SVG not found" >&2
  exit 1
fi

generate() {
  local size="$1"
  local out="$PUBLIC_DIR/icon-${size}.png"

  if command -v rsvg-convert &>/dev/null; then
    rsvg-convert -w "$size" -h "$size" "$SVG" -o "$out"
  elif command -v inkscape &>/dev/null; then
    inkscape "$SVG" --export-png="$out" --export-width="$size" --export-height="$size"
  elif command -v convert &>/dev/null; then
    # ImageMagick — density flag helps with SVG rendering quality
    convert -background none -density 300 "$SVG" -resize "${size}x${size}" "$out"
  else
    echo "Error: no SVG renderer found. Install librsvg (rsvg-convert), Inkscape, or ImageMagick." >&2
    exit 1
  fi

  echo "Generated $out"
}

generate 192
generate 512
