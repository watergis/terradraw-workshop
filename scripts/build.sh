#!/usr/bin/env bash
#
# Full documentation build.
#
# This is the command the Cloudflare Pages project should run — it produces the
# generated files zensical expects to find under docs/ before building the site:
#
#   * docs/assets/live-editor/keys.js  (API keys for the live editor)
#   * docs/**/*_slide.html             (Marp decks behind the presentation button)
#
set -euo pipefail

cd "$(dirname "$0")/.."

uv run python scripts/generate_keys.py
npm --prefix scripts/slides ci
uv run python scripts/generate_slides.py
uv run zensical build
