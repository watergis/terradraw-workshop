# terradraw-workshop

## Workshop example codes and template

This workshop example codes and template are available at [watergis/terradraw-workshop-template](https://github.com/watergis/terradraw-workshop-template)

## Development

Everything goes through the `Makefile`:

| Command | What it does |
| --- | --- |
| `make install` | Install the Python (uv) and Marp (npm) toolchains |
| `make build` | Build every language into `site/` |
| `make serve` | Build, then preview `site/` at http://localhost:8000/ with rebuild-on-change |
| `make clean` | Remove `site/`, `build/` and the generated files under `docs/` |
| `make distclean` | Also remove `.venv/` and `node_modules/` |
| `make format` | Format the Python sources with Ruff |
| `make check` | Lint and check formatting, as CI does |

`make serve` takes a port: `PORT=8001 make serve`.

The toolchain targets are stamped against their lockfiles, so `make build` only
reinstalls when `uv.lock` or `scripts/slides/package-lock.json` changes.

```bash
make serve
```

Open http://localhost:8000/ — `/` is English and `/ja/` is Japanese. See
[Languages](#languages) for why `uv run zensical serve` is not what you want.

## Build

```bash
make build
```

This is self-contained — it installs whatever is missing first, so it is also
the only command Cloudflare Pages needs as its **build command**. It runs the
API-key injection, then one staged build per language: Marp slide decks and
`zensical build` for each, assembled into `site/` (see below).

`make build` delegates to `scripts/build.sh`, which can still be run directly if
you want to skip the toolchain checks.

### About the "page does not exist" warnings

Zensical 0.0.52 prints its link-validation report **twice** per build, and the
first one is produced before every page is registered — so it reports pages that
do exist as missing. With a genuinely broken link the two disagree, e.g.
`3 issues found` followed by `1 issue found`. This is not caused by the i18n
staging; a plain `uv run zensical build` on `docs/` shows it too.

`scripts/build.sh` therefore keeps Zensical's output to itself and decides on
the **last** report: a clean build prints one `built <lang>: no issues` line, and
anything else prints the full output and fails. So you should not see those
warnings through `make build` any more — and a real broken link still fails the
build.

Builds also take a lock (`build/.build-lock`). Running two at once — typically
`make build` while `make serve` is watching — makes them delete files from under
each other, which shows up as spurious "page does not exist", "directory not
empty" or a Zensical panic. The second build now waits instead. If you use the
Zensical Studio VS Code extension, note it builds the project on its own and is
outside this lock.

## Languages

The site is published in English (site root) and Japanese (`/ja/`). Zensical has
no i18n plugin, so the per-language build is done by `scripts/build_i18n.py`.

- **Page translations** live next to their English source as `XXX.ja.md`, e.g.
  `docs/workshops/foss4g2026/index.ja.md`. A page **without** a translation
  falls back to its English content automatically — the 2025 workshop materials
  are English-only on purpose.
- **Everything that is not page text** — site name, nav titles, palette toggle
  labels, the presentation-button label — lives in `i18n/ja.toml`.
- **The live-editor widget** carries its own string table (`STRINGS` in
  `docs/assets/live-editor/live-editor.js`), keyed on `<html lang>`.
- The language switcher in the header links to the *same page* in the other
  language (`overrides/partials/alternate.html`).

`scripts/build_i18n.py ja` stages a self-contained single-language project under
`build/i18n/ja/` (a full copy of `docs/` with each `.ja.md` moved over its
English counterpart, plus a generated `zensical.toml`). `scripts/build.sh` does
this for every language that has an `i18n/<lang>.toml`, puts the default
language (`en`) at the site root and each translation under `site/<lang>/`.

English goes through the same staging, which is what keeps the `*.ja.md` source
files from being published as extra pages: Zensical has no way to exclude files
from a build, so `zensical build` against `docs/` directly would render each of
them at its own URL.

### Previewing locally

`uv run zensical serve` can only ever build one configuration, so it shows
**English only** and renders the `*.ja.md` files as stray extra pages. There are
two ways to preview the real thing.

**The whole site** — every language at its published URL:

```bash
make serve
```

This builds all languages, assembles `site/` and serves it on
http://localhost:8000/, so `/` is English, `/ja/` is Japanese, the language
switcher works and the slide decks are in place. It watches `docs/`, `i18n/`,
`overrides/`, `scripts/` and `zensical.toml`; a change rebuilds (a few seconds)
and the open pages reload themselves.

```bash
PORT=8001 make serve                        # serve somewhere else
uv run python scripts/preview.py --no-watch # serve the current site/ as-is
```

**One language, faster** — Zensical's own incremental dev server against the
staged tree:

```bash
uv run python scripts/build_i18n.py ja --serve
```

Rebuilds are near-instant, but the site is served at `/` rather than `/ja/`, and
the other languages are not there. Use `make serve` when the language switcher,
the `/ja/` URLs or the slide decks matter.

Cross-page links inside a `.ja.md` must point at the **English** filenames
(`./getting-started.md`, not `./getting-started.ja.md`) — staging renames the
files. Code and code comments stay in English in every language.

## Presentation mode

Every page carries a projector icon next to *Edit* and *View source* that opens
a Marp slide deck of that page. Decks are generated by
`scripts/generate_slides.py` as `<name>_slide.html` next to the page (gitignored)
and copied into the site by Zensical. `make build` generates them once per
language, into each staged tree, so a Japanese page gets a Japanese deck.

The generator splits slides at `##`, `###` and standalone `---` rules, converts
admonitions to blockquotes, and drops the `<terra-draw-editor>` widget — the
live editor only works on the documentation page itself.

`make serve` regenerates the decks on every rebuild. If you are instead using
`uv run zensical serve`, decks are **not** rebuilt for you — run
`uv run python scripts/generate_slides.py` (no arguments writes into `docs/`)
after editing a page, and `make clean` to remove them again.

There are two deck themes in `scripts/slides/themes/`: `terradraw.css` for
documentation pages (dense prose) and `terradraw-presentation.css` for
conference talks (designed title slide, speaker slide, more air).

### Deck front matter

A talk page configures its own deck through its front matter:

```yaml
---
slide_theme: presentation
header_logo: ../assets/images/foss4g2026/foss4g2026-logo-small.svg
title_logo: ../assets/images/foss4g2026/foss4g2026-logo-large.svg
event_date: 3 September 2026, 14:30
event_venue: Ran1, FOSS4G 2026 Hiroshima
presenter_name: Jin Igarashi
presenter_role: Software Engineer, Fracta Inc
profile_image: ../assets/images/jin-igarashi.png
linkedin: jinigarashi
github: JinIgarashi
---
```

| Key | Effect |
| --- | --- |
| `slide_theme` | `presentation` selects the talk theme; omit it for the documentation theme |
| `header_logo` | Logo in the top-right corner of every slide |
| `title_logo` | Larger logo on the title slide |
| `event_date`, `event_venue` | Shown together at the bottom of the title slide |
| `profile_image` | Adds a generated speaker slide after the title slide, with the image cropped to a circle on the right |
| `presenter_name`, `presenter_role` | Name and position on that speaker slide |
| `linkedin`, `github` | Account names — rendered as a brand icon plus the profile URL |

Image paths are relative to the page, like Markdown image paths. Pages without
these keys are unaffected. Size and position come from the `.td-header-logo`,
`.td-title-logo`, `.td-event` and `.td-profile-*` rules in the deck theme; only
the image URLs and the text are injected per deck.
See `docs/presentations/foss4g-2026-slides.md` for a working example.

### Live-editor API keys

Some live-editor examples (Mapbox GL JS, Google Maps, CesiumJS) need API keys,
which
are baked into the site at build time by `scripts/generate_keys.py`:

- **Locally**: copy `.env.example` to `.env` and fill in the keys. `make build`
  and `make serve` pick them up and write the gitignored
  `docs/assets/live-editor/keys.js`.
- **Cloudflare Pages**: set `MAPBOX_ACCESS_TOKEN`, `GOOGLE_MAPS_API_KEY` and
  `CESIUM_ION_ACCESS_TOKEN` as build environment variables in the Pages project settings, and set the
  build command to `make build` (the script prefers environment variables over
  `.env`).

Restrict the keys by HTTP referrer — the built site is public. If a key is
missing, the affected example shows a notice instead of a map; everything
else works.
