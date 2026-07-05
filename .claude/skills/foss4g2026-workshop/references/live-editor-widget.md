# Live Editor Widget — Design Spec

A reusable widget for Zensical pages: TypeScript editor (left) + live map
preview (right) + tabs, so attendees see code and result side by side without
leaving the docs.

## UX

```
┌─ Tabs: [Exercise] [Answer] ────────────────── [Run ▶] [Reset ↺] ┐
│ ┌──────────────────────────┐ ┌──────────────────────────────┐ │
│ │  Code editor (TS)        │ │  Map preview (iframe)        │ │
│ │  starter code, editable  │ │  re-runs on Run / Cmd+Enter  │ │
│ └──────────────────────────┘ └──────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

- **Exercise tab**: editable starter code + live preview.
- **Answer tab**: read-only solution with its own preview, plus a
  "Copy answer to editor" button (confirm before overwriting user edits).
- **Run** re-executes; **Reset** restores the starter code.
- Errors (transpile or runtime) render in a console strip under the preview.

## Embedding API

`md_in_html` is enabled, so pages can use raw HTML. Custom superfences hooks
are Python-only and may not exist in Zensical — use a **web component**, not a
custom fence:

```html
<terra-draw-editor
  start="./code/exercise-1/start.ts"
  answer="./code/exercise-1/answer.ts"
  height="480">
</terra-draw-editor>
```

Paths are relative to the page. Zensical (like MkDocs) copies non-markdown
files from `docs/` into `site/` — **verify `.ts` files are copied on the first
build; if not, use `.ts.txt` extensions or move code under `docs/assets/`.**

## Architecture

All client-side; no build step for the widget itself.

1. **Editor**: CodeMirror 6 via ESM CDN (small, no worker requirement).
   Monaco is the fallback if TS syntax support in CM6 proves lacking, but
   Monaco is heavy — prefer CM6.
2. **Transpile**: [Sucrase](https://github.com/alangpierce/sucrase) in the
   browser (~100 KB, fast, strips TS types). No type-checking — that's fine
   for a workshop.
3. **Preview**: sandboxed `<iframe srcdoc>` regenerated on each Run:
   - `<script type="importmap">` mapping `terra-draw`,
     `terra-draw-maplibre-gl-adapter`, `maplibre-gl` to **pinned** esm.sh (or
     jsdelivr `+esm`) URLs. Keep pins in ONE constant in live-editor.js.
   - maplibre-gl CSS link, full-size `#map` div.
   - Boilerplate creates the MapLibre `map` instance; the user code module
     imports what it needs and receives/creates the map. Keep the contract
     identical to the SvelteKit template code (same variable names) so
     copy-paste between editor and local project works.
4. **State**: keep user edits per exercise in `sessionStorage`
   (key = page path + start file) so tab switches / reloads don't lose work.

## Zensical integration

- Files: `docs/assets/live-editor/live-editor.js`, `live-editor.css`.
- Wire in via Zensical's extra assets config. **Verify the exact key** in the
  Zensical docs (https://zensical.org) — expected to mirror MkDocs:

```toml
[project]
extra_javascript = ["assets/live-editor/live-editor.js"]
extra_css = ["assets/live-editor/live-editor.css"]
```

  If Zensical lacks these keys, fall back to a theme template override or an
  inline `<script type="module" src=…>` in each page (md_in_html allows it).
- The JS must be an ES module, idempotent (define the custom element once),
  and lazy: only initialize editors when scrolled into view
  (`IntersectionObserver`), since a page may embed several.
- Respect the Material light/dark palette: read
  `[data-md-color-scheme]` / Zensical's equivalent attribute and pick the
  CodeMirror theme accordingly.

## Failure modes to handle

- CDN unreachable (venue Wi-Fi): show a clear message in the preview pane and
  point to the plain code blocks + local template path.
- Infinite loops / runaway code: iframe is sandboxed and recreated per Run, so
  a stuck iframe is discarded on next Run; add a "Reload preview" button.
- Basemap: use a keyless style (e.g. demotiles or the style already used in
  2025 exercises) — no API keys in docs.

## Acceptance checklist

- [ ] One `<terra-draw-editor>` renders and runs on a scratch page.
- [ ] Two widgets on one page don't conflict.
- [ ] Answer tab shows solution and its preview.
- [ ] Reset and Copy-answer work with confirmation.
- [ ] Dark mode readable.
- [ ] Built site (`uv run zensical build`) serves widget correctly from `site/`.
