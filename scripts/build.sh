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
# The site is built once per language with a catalog under i18n/. Each build
# runs against a staged single-language docs tree (build/i18n/<lang>/), produced
# by scripts/build_i18n.py — including the default language, whose staging is
# what keeps the `*.<lang>.md` translation sources out of the English site.
# The default language lands at the site root, the rest under site/<lang>/.
#
# Options:
#   --skip-npm   Do not run `npm ci` for the Marp toolchain. Used by ./serve.sh
#                for its rebuilds, where the dependencies are already installed.
#
set -euo pipefail

cd "$(dirname "$0")/.."

skip_npm=0
for arg in "$@"; do
  case "$arg" in
    --skip-npm) skip_npm=1 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

# Two builds at once corrupt each other: they share docs/, the staged trees and
# site/, so one deletes files the other is reading — which surfaces as "page
# does not exist", "directory not empty" or a Zensical panic. This happens
# easily, e.g. running `make build` while `make serve` is watching. `mkdir` is
# atomic, so it makes a usable lock.
lock_dir="build/.build-lock"
mkdir -p build
waited=0
until mkdir "$lock_dir" 2>/dev/null; do
  if [ "$waited" -eq 0 ]; then
    echo "waiting for the build lock held by another build ($lock_dir)…"
  fi
  if [ "$waited" -ge 120 ]; then
    echo "error: gave up waiting for $lock_dir." >&2
    echo "       Stop the other build, or remove that directory if it is stale." >&2
    exit 1
  fi
  sleep 1
  waited=$((waited + 1))
done
trap 'rmdir "$lock_dir" 2>/dev/null || true' EXIT

uv run python scripts/generate_keys.py
if [ "$skip_npm" -eq 0 ]; then
  npm --prefix scripts/slides ci
fi

languages=$(uv run python scripts/build_i18n.py --list)
default_lang=$(uv run python scripts/build_i18n.py --default-lang)

# Build one language and gate on Zensical's link validation.
#
# Zensical 0.0.52 emits its validation report twice per build, and the first one
# is unreliable: it is produced before every page is registered, so it reports
# pages that do exist as missing. (Reproducible with a plain `zensical build` on
# docs/, so the i18n staging does not cause it.) The second report is accurate —
# with a genuinely broken link the two disagree, e.g. "3 issues found" then
# "1 issue found". Only the last report decides, and Zensical's output is shown
# only when that last report is not clean.
build_language() {
  local lang="$1"
  local log verdict
  log=$(mktemp)

  # Zensical cleans site_dir itself, but that has been seen to panic with
  # "directory not empty"; removing it first avoids relying on it.
  rm -rf "build/i18n/$lang/site"

  if ! uv run zensical build -f "build/i18n/$lang/zensical.toml" >"$log" 2>&1; then
    cat "$log" >&2
    rm -f "$log"
    echo "error: zensical build failed for '$lang'" >&2
    return 1
  fi

  # Note the singular: a single problem is reported as "1 issue found".
  verdict=$(sed 's/\x1b\[[0-9;]*m//g' "$log" | grep -aE 'issues? found' | tail -1)
  if [ "$verdict" != "No issues found" ]; then
    cat "$log" >&2
    rm -f "$log"
    echo "error: '$lang' build reported: ${verdict:-no validation report}" >&2
    return 1
  fi

  rm -f "$log"
  echo "built $lang: no issues"
}

for lang in $languages; do
  uv run python scripts/build_i18n.py "$lang"
  uv run python scripts/generate_slides.py --docs-dir "build/i18n/$lang/docs" \
    --lang "$lang"
  build_language "$lang"
done

# Assemble: default language at the root, then the translations beneath it.
rm -rf site
cp -R "build/i18n/$default_lang/site" site
for lang in $languages; do
  [ "$lang" = "$default_lang" ] && continue
  cp -R "build/i18n/$lang/site" "site/$lang"
done
