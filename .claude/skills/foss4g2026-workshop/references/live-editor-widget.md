# Live Editor Widget — Implementation Notes (as built)

`<terra-draw-editor>` is implemented in `docs/assets/live-editor/live-editor.js`
(+ `live-editor.css`, + `vendor/editor-bundle.js`) and wired into Zensical via
`extra_javascript` (with `type = "module"`) and `extra_css` in `zensical.toml`.

## Embedding API

```html
<terra-draw-editor
  start="../../code/exercise-1/start.ts"
  answer="../../code/exercise-1/answer.ts"
  height="480">
</terra-draw-editor>
```

- `start` (required): starter TypeScript, editable in the Exercise tab.
- `answer` (optional): solution shown read-only in the Answer tab, with a
  "Copy answer to editor" button. Omit it and the Answer tab is hidden.
- `height` (optional, px, default 480).

**Path rule (important):** Zensical uses directory URLs, so a page
`basics/exercise-1.md` is served at `.../basics/exercise-1/`. Raw HTML
attributes are NOT rewritten like markdown links, so paths must be relative
to the *output* URL: from `basics/exercise-1.md` use `../../code/...`; from a
top-level page like `maplibre-gl-terradraw.md` use `../code/...`.

## Architecture

- **Editor**: CodeMirror 6 + **Sucrase** (browser TS-stripping, no type
  checking), pre-bundled into a single self-hosted ESM file
  `docs/assets/live-editor/vendor/editor-bundle.js`. Self-hosting avoids two
  real CDN failures found during development: esm.sh returned 500s for
  `@codemirror/view@^6.x` sub-dependency URLs, and loading codemirror +
  lang-javascript as separate jsdelivr `+esm` bundles produced duplicate
  `@codemirror/state` instances ("Unrecognized extension value"). jsdelivr's
  `+esm` build of sucrase is also broken (CJS interop).

  Rebuild the bundle with:

  ```bash
  npm install codemirror@6.0.2 @codemirror/lang-javascript@6.2.5 sucrase@3.35.1 esbuild
  # entry.js:
  #   export { EditorView, basicSetup } from 'codemirror';
  #   export { javascript } from '@codemirror/lang-javascript';
  #   export { transform } from 'sucrase';
  npx esbuild entry.js --bundle --format=esm --minify --outfile=editor-bundle.js
  ```

- **Preview**: sandboxed `<iframe srcdoc>` (`sandbox="allow-scripts"`),
  recreated on every Run. It contains an import map (versions pinned in the
  `PINS` constant at the top of live-editor.js):
  - `maplibre-gl` → esm.sh (maplibre ships UMD only; esm.sh adds named ESM
    exports — jsdelivr `+esm` does NOT export `LngLat` etc. and breaks the
    plugin)
  - `terra-draw` → unpkg `dist/terra-draw.modern.js` (real ESM)
  - `terra-draw-maplibre-gl-adapter` → unpkg `dist/*.modern.js` (imports
    only bare `terra-draw`, resolved by the same import map → single
    instance)
  - `@watergis/maplibre-gl-terradraw` → unpkg `dist/maplibre-gl-terradraw.es.js`
    (imports only bare `maplibre-gl`; terra-draw is bundled inside)
- **Boilerplate**: a module script in the iframe creates the MapLibre map
  (keyless OpenFreeMap `bright` vector style, `MAP_STYLE` constant), centred
  on Hiroshima, adds Navigation + **Fullscreen** + Attribution controls, and
  assigns `window.map`. The user code runs as a second module script and
  accesses `map` as a global (`declare const map: Map;` in the exercise
  files). A `<div id="sidebar">` (hidden when empty) hosts buttons added via
  the exercises' `addButton()` helper. maplibre-gl and the plugin CSS are
  linked from unpkg. The preview iframe carries `allow="fullscreen"`.
- **Console strip**: the iframe hooks `window.onerror`,
  `unhandledrejection`, `console.log/error` and posts them to the parent
  with a per-widget id; they render under the preview.
- **Tabs**: exercise and answer each mount their own CodeMirror view into a
  separate `.tde-editor-pane`; the inactive one gets `.tde-hidden`
  (`display:none !important`). Do NOT stack both views in one scroll host and
  toggle inline `display` — that regressed into both panes showing (answer
  visible when scrolling the exercise). `applyTabVisibility()` is the single
  source of truth for which pane shows.
- **Resizable splitter**: `.tde-splitter` between editor and preview; drag
  sets the editor's `flex-basis` % (clamped 0–100%, so either side can be
  collapsed fully — all-preview or all-editor; the 6px splitter stays
  grabbable at the edge). During drag the preview iframe gets
  `pointer-events:none` so it doesn't swallow mousemove. Works in both row
  (desktop) and column (mobile) layouts via `flex-direction` check. The panes
  have `min-width:0` so the collapse is not blocked.
- **Maximize/fullscreen**: a `.tde-maximize` icon button (top-right of the
  toolbar) toggles `this.requestFullscreen()` / `document.exitFullscreen()` on
  the widget element; `:fullscreen` CSS makes the widget fill the viewport
  with the body flexing to fill. `fullscreenchange` swaps the icon
  (ICON_MAXIMIZE ↔ ICON_MINIMIZE). Note: the embedded preview webview blocks
  the Fullscreen API ("Permissions check failed") — verify this feature in a
  real browser tab, not the preview tool.
- **State**: user edits are saved to `sessionStorage` keyed by the resolved
  start-file URL on each Run. Reset (with confirm) restores the starter code.
- **Lazy init** via IntersectionObserver; multiple widgets per page work.
- The editor pane stays light in both site color schemes (CodeMirror's
  default highlight colors are light-background); the frame chrome follows
  the Material CSS variables.

## Exercise code file conventions

- One directory per exercise: `docs/workshops/foss4g2026/code/<name>/{start.ts,answer.ts}`.
- Files start with `import type { Map } from 'maplibre-gl'; ... declare const map: Map;`
  so they type-read correctly while running as plain stripped TS.
- Anything calling Terra Draw methods that require a started instance
  (`canUndo()` etc.) must run after `draw.start()` inside `map.once('load')`
  — calling before throws "Terra Draw is not enabled".
- Keep code copy-pastable into `template/` (SvelteKit): same variable names,
  DOM helpers replaced by sidebar markup there.

## Known limitations / QA notes

- The preview needs internet for the map libraries (editor itself is
  self-hosted). fetchText() rejects HTML responses so bad embed paths fail
  with "Not a code file" instead of a confusing TS parse error.
- `zensical serve` live-reloads pages on rebuild, which resets widget tab
  state (sessionStorage keeps the code).
- Verified working in Chrome (2026-07): exercises 1–7, plugin page,
  getting-started demo embed.
