---
name: multilingual-docs
description: Translate and maintain the Terra Draw workshop site in multiple languages. Covers the `XXX.ja.md` translation convention, the `i18n/<lang>.toml` catalog for nav and UI strings, and the per-language build in scripts/build_i18n.py. Use when adding or updating a translation, adding a new language, or touching anything under i18n/ or the language switcher.
---

# Multilingual workshop site

The site is built once per language. English is the source of truth and lands at
the site root; every other language is generated from a staged copy of `docs/`
and served from `/<lang>/`.

## Context

- Zensical has **no i18n plugin** (`mkdocs-static-i18n` is only "planned"
  upstream), so the per-language build is driven by `scripts/build_i18n.py` in
  this repository. Zensical does supply the per-language UI catalog
  (`theme.language`) and the `extra.alternate` language selector.
- A translation lives next to its English source as `XXX.<lang>.md`. The staging
  step copies the whole `docs/` tree, moves each `XXX.<lang>.md` over `XXX.md`
  and deletes the leftovers. **A page with no translation therefore keeps its
  English content — that is the fallback, and it is automatic.**
- The whole tree is staged, not only translated pages, because the live editor
  embeds reference their exercise sources through depth-sensitive raw HTML
  attributes (`start="../../code/…"`) that Zensical does not rewrite.
- **English is staged too** (`i18n/en.toml`, an identity catalog). Zensical
  cannot exclude files from a build, so building `docs/` directly would publish
  every `*.ja.md` as an extra page in the English site; staging strips them.
  This is also why `uv run zensical serve` shows those stray pages in dev.
- Currently translated: Japanese (`ja`), covering the top-level pages, all of
  `docs/workshops/foss4g2026/**` and all of `docs/presentations/**`. The 2025
  workshop materials are intentionally English-only and fall back.

## Key files

| Path | Purpose |
|------|---------|
| `docs/**/*.ja.md` | Japanese page translations, next to their English source |
| `i18n/ja.toml` | Site name/description, nav titles, palette and UI labels |
| `i18n/en.toml` | Identity catalog for the default language — keeps its build staged too |
| `scripts/build_i18n.py` | Stages `build/i18n/<lang>/{docs,overrides,zensical.toml}` |
| `Makefile` | `make install` / `build` / `serve` / `clean` — the entry points |
| `scripts/build.sh` | Full pipeline: one staged build per language, assembled into `site/` |
| `scripts/preview.py` | Full-site preview with rebuild-on-change (`make serve`) |
| `overrides/partials/alternate.html` | Language switcher that keeps the current page |
| `overrides/partials/actions.html` | Presentation button; label comes from `config.extra.ui.slides` |
| `docs/assets/live-editor/live-editor.js` | Widget UI strings in the `STRINGS` table, keyed on `<html lang>` |

## Rules

1. **English first.** Write or update the English page, then translate it. Never
   let a translation carry content the English page does not have.
2. **Never create a translation that is just the English text.** A missing
   `.ja.md` already falls back to English; an English-content `.ja.md` only adds
   a file to keep in sync.
3. **Cross-page links inside a translation target the English filenames** —
   `[はじめよう](./getting-started.md)`, never `getting-started.ja.md`. Staging
   renames the files, so a `.ja.md` link target would 404.
4. **Keep the non-prose parts byte-for-byte identical to the English page**:
   `<terra-draw-editor>` attributes, image paths, `!!!` admonition types, code
   fences and their contents, front matter keys. Translate prose, headings,
   table cells, admonition titles and link text only. In the slide front matter
   (`docs/presentations/*-slides.md`) the display values — `event_date`,
   `event_venue`, `event_name`, `presenter_role` — are translated, but the keys,
   the `*_logo` / `profile_image` paths, `slide_theme` and the account names are
   not.
5. **Do not translate code.** `docs/workshops/foss4g2026/code/**/*.ts` is shared
   by every language, and comments inside markdown code fences mirror those
   files — leave both in English.
6. **Terra Draw API surface stays in English** inside translated prose: class
   names, mode names (`polygon`, `select`), option keys and event names.
7. Nav titles, `site_name`, `site_description`, the palette toggle labels and
   the presentation-button label live in `i18n/<lang>.toml`, not in the pages.
   Nav entries written in `zensical.toml` as a bare path take their title from
   the page heading and must **not** be listed under `[nav]`.
8. `docs/workshops/foss4g2025/**` stays English-only — it is an archive of a
   past event, so translating it would only create something to keep in sync.
9. Never edit anything under `build/` or `site/` — both are generated.

## Workflow

### Translating or updating a page

1. Read the English `.md` in full.
2. Write the sibling `.ja.md`, following rules 3–6.
3. If the page introduced a new nav title, add it to `i18n/ja.toml` under
   `[nav]` using the exact English string as the key.
4. Rebuild and check the page under `/ja/` (see below).

### Adding a new language

1. Copy `i18n/ja.toml` to `i18n/<lang>.toml` and translate its values. The build
   script discovers languages by globbing `i18n/*.toml`, so nothing else needs
   registering.
2. Add an entry to `alternate` in `zensical.toml` (`{ name, link = "/<lang>/",
   lang }`). It is copied into every language's generated config.
3. Add a `<lang>` block to `STRINGS` in
   `docs/assets/live-editor/live-editor.js`; unlisted languages fall back to
   English.
4. Add `XXX.<lang>.md` files. Untranslated pages fall back to English.

### Previewing

**Never use `uv run zensical serve` for translation work.** It builds `docs/`
directly, so it shows English only and renders the `*.ja.md` files as stray
extra pages.

Full site — every language at its published URL, with auto-rebuild and reload:

```bash
make serve
```

`/` is English, `/ja/` is Japanese; the language switcher and the slide decks
work. Use this whenever the `/ja/` URLs, the switcher or the decks matter.

Single language, faster incremental rebuilds (served at `/`, not `/ja/`):

```bash
uv run python scripts/build_i18n.py ja --serve
```

### Verifying the real output

```bash
make build
```

Every language must print `built <lang>: no issues`. Then check a page with no
translation — `/ja/workshops/foss4g2025/basics/exercise-1/` — to confirm the
English fallback renders inside the Japanese chrome.

Do not run `make build` while `make serve` is watching: concurrent builds
delete files from under each other. `scripts/build.sh` takes a lock
(`build/.build-lock`) so the second one waits, but the Zensical Studio VS Code
extension builds outside that lock.

If you invoke `zensical build` yourself you will see `page does not exist`
warnings for pages that do exist. Zensical 0.0.52 prints its validation report
twice and the first one runs before every page is registered; only the last
report is accurate, which is what `scripts/build.sh` gates on. Do not "fix"
links because of the first report.

## Known limitation

The "Edit this page" button on a translated page links to the English `.md`
source: Zensical derives `edit_url` from the staged filename, which no longer
carries the `.ja` part. Fixing this would need a per-page source manifest.
