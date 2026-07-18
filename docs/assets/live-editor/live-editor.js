/**
 * <terra-draw-editor> — live code editor widget for the Terra Draw workshop.
 *
 * Usage in a markdown page (md_in_html):
 *
 *   <terra-draw-editor
 *     start="./code/exercise-1/start.ts"
 *     answer="./code/exercise-1/answer.ts"
 *     lib="maplibre"
 *     height="480">
 *   </terra-draw-editor>
 *
 * Left pane: editable TypeScript (CodeMirror 6). Right pane: sandboxed iframe
 * running the code against a map. Tabs switch between the exercise starter
 * code and the read-only answer. TypeScript is stripped in the browser with
 * Sucrase — no type checking, no build step.
 *
 * Attributes:
 *   - lib (optional, default "maplibre"): which mapping-library environment
 *     the preview iframe provides — one of the LIBS keys below. Exactly one
 *     library per widget instance; environments are never mixed.
 *   - boilerplate="none" (optional): skip the MapLibre map boilerplate; the
 *     user code creates its own map into the `#map` div. Used by the
 *     "Other mapping libraries" pages where map creation is the lesson.
 *
 * All external dependency versions are pinned here, in one place.
 */

const PINS = {
  maplibre: '5.24.0',
  terraDraw: '1.32.0',
  adapter: '1.4.1', // terra-draw-maplibre-gl-adapter
  plugin: '1.14.4', // @watergis/maplibre-gl-terradraw
  leaflet: '1.9.4',
  leafletAdapter: '1.3.0',
  openlayers: '10.9.0', // ol
  openlayersAdapter: '1.3.0',
  mapbox: '3.25.0', // mapbox-gl
  mapboxAdapter: '1.4.0',
  googleLoader: '2.1.1', // @googlemaps/js-api-loader
  googleAdapter: '1.6.1',
  arcgis: '4.33', // js.arcgis.com ESM CDN version
  arcgisAdapter: '1.3.0',
  sucrase: '3.35.1',
  codemirror: '6.0.2',
  langJavascript: '6.2.5'
};

// Shared by every environment so all adapters resolve the same terra-draw
// instance through the import map.
const TERRA_DRAW_URL = `https://unpkg.com/terra-draw@${PINS.terraDraw}/dist/terra-draw.modern.js`;

// One preview environment per mapping library: import-map entries + CSS.
// UMD-only packages (maplibre-gl, leaflet, mapbox-gl) come from esm.sh which
// adds named ESM exports (jsdelivr `+esm` does NOT — it breaks named imports
// like LngLat). The Terra Draw adapters ship real ESM builds used directly
// from unpkg; their bare imports ('terra-draw', 'leaflet') resolve through
// the same import map, so all modules share single instances.
// `keys` lists the API-key placeholders (see keys.js) the environment needs.
const LIBS = {
  maplibre: {
    imports: {
      'maplibre-gl': `https://esm.sh/maplibre-gl@${PINS.maplibre}`,
      'terra-draw-maplibre-gl-adapter': `https://unpkg.com/terra-draw-maplibre-gl-adapter@${PINS.adapter}/dist/terra-draw-maplibre-gl-adapter.modern.js`,
      '@watergis/maplibre-gl-terradraw': `https://unpkg.com/@watergis/maplibre-gl-terradraw@${PINS.plugin}/dist/maplibre-gl-terradraw.es.js`
    },
    css: [
      `https://unpkg.com/maplibre-gl@${PINS.maplibre}/dist/maplibre-gl.css`,
      `https://unpkg.com/@watergis/maplibre-gl-terradraw@${PINS.plugin}/dist/maplibre-gl-terradraw.css`
    ],
    keys: []
  },
  leaflet: {
    imports: {
      leaflet: `https://esm.sh/leaflet@${PINS.leaflet}`,
      'terra-draw-leaflet-adapter': `https://unpkg.com/terra-draw-leaflet-adapter@${PINS.leafletAdapter}/dist/terra-draw-leaflet-adapter.modern.js`
    },
    css: [`https://unpkg.com/leaflet@${PINS.leaflet}/dist/leaflet.css`],
    keys: []
  },
  openlayers: {
    imports: {
      // Trailing-slash prefix so `import Map from 'ol/Map.js'` resolves too.
      ol: `https://esm.sh/ol@${PINS.openlayers}`,
      'ol/': `https://esm.sh/ol@${PINS.openlayers}/`,
      'terra-draw-openlayers-adapter': `https://unpkg.com/terra-draw-openlayers-adapter@${PINS.openlayersAdapter}/dist/terra-draw-openlayers-adapter.modern.js`
    },
    css: [`https://unpkg.com/ol@${PINS.openlayers}/ol.css`],
    keys: []
  },
  mapbox: {
    imports: {
      'mapbox-gl': `https://esm.sh/mapbox-gl@${PINS.mapbox}`,
      'terra-draw-mapbox-gl-adapter': `https://unpkg.com/terra-draw-mapbox-gl-adapter@${PINS.mapboxAdapter}/dist/terra-draw-mapbox-gl-adapter.modern.js`
    },
    css: [`https://unpkg.com/mapbox-gl@${PINS.mapbox}/dist/mapbox-gl.css`],
    keys: ['MAPBOX_ACCESS_TOKEN']
  },
  google: {
    imports: {
      '@googlemaps/js-api-loader': `https://esm.sh/@googlemaps/js-api-loader@${PINS.googleLoader}`,
      'terra-draw-google-maps-adapter': `https://unpkg.com/terra-draw-google-maps-adapter@${PINS.googleAdapter}/dist/terra-draw-google-maps-adapter.modern.js`
    },
    css: [],
    keys: ['GOOGLE_MAPS_API_KEY']
  },
  arcgis: {
    imports: {
      // Official ArcGIS ESM CDN; prefix so `@arcgis/core/Map.js` etc. resolve.
      '@arcgis/core/': `https://js.arcgis.com/${PINS.arcgis}/@arcgis/core/`,
      'terra-draw-arcgis-adapter': `https://unpkg.com/terra-draw-arcgis-adapter@${PINS.arcgisAdapter}/dist/terra-draw-arcgis-adapter.modern.js`
    },
    css: [`https://js.arcgis.com/${PINS.arcgis}/@arcgis/core/assets/esri/themes/light/main.css`],
    keys: []
  }
};

// FOSS4G 2026 Hiroshima
const MAP_CENTER = [132.4553, 34.3966];
const MAP_ZOOM = 12;
// Keyless OpenFreeMap vector style (mirrors the SvelteKit template)
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/bright';

/** Boilerplate module executed in the iframe before the user code. */
const MAP_BOILERPLATE = `
import maplibregl from 'maplibre-gl';

const map = new maplibregl.Map({
  container: 'map',
  style: '${MAP_STYLE}',
  center: [${MAP_CENTER}],
  zoom: ${MAP_ZOOM},
  attributionControl: false
});
map.addControl(new maplibregl.NavigationControl(), 'top-right');
map.addControl(new maplibregl.FullscreenControl(), 'top-right');
map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

// Expose the map to the user code (mirrors the \`map\` variable in the
// SvelteKit template).
window.map = map;
`;

/* ------------------------------------------------------------------ */
/* Shared lazy-loaded modules (CodeMirror + Sucrase)                    */
/* ------------------------------------------------------------------ */

let toolingPromise = null;
let keysPromise = null;

/**
 * API keys baked at build time: `keys.js` is generated from environment
 * variables (Cloudflare Pages) or `.env` (local) by scripts/generate-keys.mjs
 * and is gitignored. Missing file → no keys, key-using examples show a
 * friendly message.
 */
function loadKeys() {
  if (!keysPromise) {
    keysPromise = import(new URL('./keys.js', import.meta.url).href)
      .then((mod) => mod.default || {})
      .catch(() => ({}));
  }
  return keysPromise;
}

function loadTooling() {
  if (!toolingPromise) {
    // CodeMirror + Sucrase are pre-bundled into a single self-hosted ESM
    // file (see the skill's live-editor-widget.md for how to rebuild it), so
    // the editor itself works without any CDN.
    toolingPromise = import(
      new URL('./vendor/editor-bundle.js', import.meta.url).href
    ).then((bundle) => ({
      EditorView: bundle.EditorView,
      basicSetup: bundle.basicSetup,
      javascript: bundle.javascript,
      transform: bundle.transform
    }));
  }
  return toolingPromise;
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  const text = await res.text();
  // Some dev servers return an HTML fallback page with status 200 for
  // missing files — catch bad embed paths early.
  if (/^\s*<(!doctype|html)/i.test(text)) {
    throw new Error(`Not a code file: ${url}`);
  }
  return text;
}

const ICON_MAXIMIZE =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
const ICON_MINIMIZE =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>';

let instanceCounter = 0;

class TerraDrawEditor extends HTMLElement {
  connectedCallback() {
    if (this.dataset.initialized) return;
    this.dataset.initialized = 'true';
    this.tdeId = `tde-${++instanceCounter}`;
    this.activeTab = 'exercise';
    this.renderShell();
    // Initialize lazily: a page can contain several widgets.
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        this.initialize().catch((err) => this.showFatal(err));
      }
    });
    observer.observe(this);
  }

  get startUrl() {
    return new URL(this.getAttribute('start'), document.baseURI).href;
  }

  get answerUrl() {
    const answer = this.getAttribute('answer');
    return answer ? new URL(answer, document.baseURI).href : null;
  }

  get storageKey() {
    return `terra-draw-editor:${this.startUrl}`;
  }

  // Baseline the saved edits were made against. If the page's starter code
  // changes (e.g. an exercise is rewritten), stale saved edits keyed by the
  // same URL are discarded instead of resurrected.
  get baselineKey() {
    return `terra-draw-editor:baseline:${this.startUrl}`;
  }

  get libConfig() {
    const lib = this.getAttribute('lib') || 'maplibre';
    const config = LIBS[lib];
    if (!config) throw new Error(`Unknown lib="${lib}" (expected one of: ${Object.keys(LIBS).join(', ')})`);
    return config;
  }

  get useBoilerplate() {
    // The MapLibre map boilerplate only makes sense for the default env.
    return this.getAttribute('boilerplate') !== 'none' && (this.getAttribute('lib') || 'maplibre') === 'maplibre';
  }

  renderShell() {
    const height = this.getAttribute('height') || '480';
    this.classList.add('tde');
    this.innerHTML = `
      <div class="tde-toolbar">
        <div class="tde-tabs" role="tablist">
          <button type="button" class="tde-tab tde-tab-active" data-tab="exercise" role="tab">Exercise</button>
          <button type="button" class="tde-tab" data-tab="answer" role="tab" hidden>Answer</button>
        </div>
        <div class="tde-actions">
          <button type="button" class="tde-btn tde-copy-answer" hidden title="Replace the exercise code with the answer">Copy answer to editor</button>
          <button type="button" class="tde-btn tde-reset" title="Restore the starter code">Reset</button>
          <button type="button" class="tde-btn tde-run" title="Run the code (Ctrl/Cmd + Enter)">Run ▶</button>
          <button type="button" class="tde-btn tde-icon-btn tde-maximize" title="Maximize the editor" aria-label="Maximize the editor">${ICON_MAXIMIZE}</button>
        </div>
      </div>
      <div class="tde-body" style="height:${Number(height)}px">
        <div class="tde-editor">
          <div class="tde-editor-pane" data-pane="exercise"><div class="tde-loading">Loading editor…</div></div>
          <div class="tde-editor-pane tde-hidden" data-pane="answer"></div>
        </div>
        <div class="tde-splitter" role="separator" aria-orientation="vertical" title="Drag to resize"></div>
        <div class="tde-preview">
          <div class="tde-frame-host"></div>
        </div>
      </div>
      <pre class="tde-console" hidden aria-live="polite"></pre>`;

    this.querySelector('.tde-run').addEventListener('click', () => this.run());
    this.querySelector('.tde-reset').addEventListener('click', () => this.reset());
    this.querySelector('.tde-copy-answer').addEventListener('click', () => this.copyAnswer());
    this.querySelectorAll('.tde-tab').forEach((btn) =>
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab))
    );
    this.querySelector('.tde-maximize').addEventListener('click', () => this.toggleFullscreen());
    document.addEventListener('fullscreenchange', () => this.syncFullscreenButton());
    this.setupSplitter();

    window.addEventListener('message', (event) => {
      const data = event.data;
      if (data && data.tdeId === this.tdeId) this.appendConsole(data.level, data.text);
    });
  }

  async initialize() {
    const [tooling, keys, startCode, answerCode] = await Promise.all([
      loadTooling(),
      loadKeys(),
      fetchText(this.startUrl),
      this.answerUrl ? fetchText(this.answerUrl) : Promise.resolve(null)
    ]);
    this.tooling = tooling;
    this.keys = keys;
    this.startCode = startCode.trimEnd();
    this.answerCode = answerCode ? answerCode.trimEnd() : null;

    const exercisePane = this.querySelector('.tde-editor-pane[data-pane="exercise"]');
    const answerPane = this.querySelector('.tde-editor-pane[data-pane="answer"]');
    exercisePane.innerHTML = '';

    // Only restore saved edits if they were based on the current starter
    // code; otherwise the exercise has changed and the old code is stale.
    let saved = sessionStorage.getItem(this.storageKey);
    if (saved !== null && sessionStorage.getItem(this.baselineKey) !== this.startCode) {
      sessionStorage.removeItem(this.storageKey);
      sessionStorage.removeItem(this.baselineKey);
      saved = null;
    }
    const extensions = [
      tooling.basicSetup,
      tooling.javascript({ typescript: true }),
      tooling.EditorView.domEventHandlers({
        keydown: (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
            this.run();
            return true;
          }
          return false;
        }
      })
    ];
    this.exerciseView = new tooling.EditorView({
      doc: saved ?? this.startCode,
      extensions,
      parent: exercisePane
    });

    if (this.answerCode !== null) {
      this.answerView = new tooling.EditorView({
        doc: this.answerCode,
        extensions: [
          tooling.basicSetup,
          tooling.javascript({ typescript: true }),
          tooling.EditorView.editable.of(false)
        ],
        parent: answerPane
      });
      this.querySelector('[data-tab="answer"]').hidden = false;
    }

    // Apply the active tab (it may have been clicked before init finished)
    this.applyTabVisibility();
    this.run();
  }

  applyTabVisibility() {
    this.querySelectorAll('.tde-editor-pane').forEach((pane) => {
      const paneName = pane.dataset.pane;
      const shouldShow = paneName === this.activeTab && (paneName !== 'answer' || !!this.answerView);
      pane.classList.toggle('tde-hidden', !shouldShow);
    });
  }

  currentCode() {
    const view = this.activeTab === 'answer' ? this.answerView : this.exerciseView;
    return view.state.doc.toString();
  }

  switchTab(tab) {
    if (tab === this.activeTab) return;
    this.activeTab = tab;
    this.querySelectorAll('.tde-tab').forEach((btn) =>
      btn.classList.toggle('tde-tab-active', btn.dataset.tab === tab)
    );
    const isAnswer = tab === 'answer';
    this.applyTabVisibility();
    this.querySelector('.tde-copy-answer').hidden = !isAnswer;
    this.querySelector('.tde-reset').hidden = isAnswer;
    this.run();
  }

  toggleFullscreen() {
    if (document.fullscreenElement === this) {
      document.exitFullscreen();
    } else if (this.requestFullscreen) {
      this.requestFullscreen();
    }
  }

  syncFullscreenButton() {
    const btn = this.querySelector('.tde-maximize');
    if (!btn) return;
    const isFull = document.fullscreenElement === this;
    btn.innerHTML = isFull ? ICON_MINIMIZE : ICON_MAXIMIZE;
    const label = isFull ? 'Exit fullscreen' : 'Maximize the editor';
    btn.title = label;
    btn.setAttribute('aria-label', label);
  }

  setupSplitter() {
    const splitter = this.querySelector('.tde-splitter');
    const body = this.querySelector('.tde-body');
    const editor = this.querySelector('.tde-editor');
    const preview = this.querySelector('.tde-preview');

    const onDown = (event) => {
      event.preventDefault();
      const column = getComputedStyle(body).flexDirection === 'column';
      const rect = body.getBoundingClientRect();
      // Stop the preview iframe from swallowing pointer events mid-drag.
      const iframe = this.querySelector('.tde-frame');
      if (iframe) iframe.style.pointerEvents = 'none';
      document.body.style.cursor = column ? 'row-resize' : 'col-resize';

      const onMove = (moveEvent) => {
        const point = moveEvent.touches ? moveEvent.touches[0] : moveEvent;
        let pct;
        if (column) {
          pct = ((point.clientY - rect.top) / rect.height) * 100;
        } else {
          pct = ((point.clientX - rect.left) / rect.width) * 100;
        }
        // Keep at least the splitter width available on both sides so the
        // handle never gets pushed outside the container.
        const splitterSizePx = splitter.getBoundingClientRect()[column ? 'height' : 'width'] || 6;
        const axisSizePx = column ? rect.height : rect.width;
        const edgePct = axisSizePx > 0 ? (splitterSizePx / axisSizePx) * 100 : 0;
        pct = Math.min(100 - edgePct, Math.max(edgePct, pct));
        editor.style.flex = `0 0 ${pct}%`;
        preview.style.flex = '1 1 auto';
      };
      const onUp = () => {
        if (iframe) iframe.style.pointerEvents = '';
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    };

    splitter.addEventListener('mousedown', onDown);
    splitter.addEventListener('touchstart', onDown, { passive: false });
  }

  run() {
    if (!this.tooling) return;
    this.clearConsole();
    if (this.activeTab === 'exercise') {
      sessionStorage.setItem(this.storageKey, this.exerciseView.state.doc.toString());
      sessionStorage.setItem(this.baselineKey, this.startCode);
    }
    let js;
    try {
      js = this.tooling.transform(this.currentCode(), {
        transforms: ['typescript'],
        disableESTransforms: true
      }).code;
    } catch (err) {
      this.appendConsole('error', `TypeScript error: ${err.message}`);
      return;
    }
    js = this.injectKeys(js);
    this.renderPreview(js);
  }

  /**
   * Replace `__<NAME>__` API-key placeholders with the build-time keys.
   * Missing keys get an explanatory console message instead of a raw
   * provider error, and are replaced with an empty string.
   */
  injectKeys(js) {
    for (const name of this.libConfig.keys) {
      const placeholder = `__${name}__`;
      if (!js.includes(placeholder)) continue;
      const value = (this.keys && this.keys[name]) || '';
      if (!value) {
        this.appendConsole(
          'error',
          `No ${name} was provided at build time, so the map below cannot load. ` +
            `To run this example locally, set ${name} in .env and rebuild the site ` +
            `(see the instructions on this page).`
        );
      }
      js = js.replaceAll(placeholder, value);
    }
    return js;
  }

  renderPreview(userJs) {
    const host = this.querySelector('.tde-frame-host');
    host.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.className = 'tde-frame';
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.setAttribute('allow', 'fullscreen');
    iframe.srcdoc = this.buildSrcdoc(userJs);
    host.appendChild(iframe);
  }

  buildSrcdoc(userJs) {
    const consoleHook = `
      const tdeId = ${JSON.stringify(this.tdeId)};
      const send = (level, text) => parent.postMessage({ tdeId, level, text }, '*');
      window.addEventListener('error', (e) => send('error', e.message));
      window.addEventListener('unhandledrejection', (e) => send('error', String(e.reason)));
      const origError = console.error.bind(console);
      const origLog = console.log.bind(console);
      console.error = (...a) => { send('error', a.map(String).join(' ')); origError(...a); };
      console.log = (...a) => { send('log', a.map(String).join(' ')); origLog(...a); };
    `;
    // Guard against user code accidentally closing our script tag.
    const safeUserJs = userJs.replaceAll('</script', '<\\/script');
    const config = this.libConfig;
    const importMap = { imports: { 'terra-draw': TERRA_DRAW_URL, ...config.imports } };
    const cssLinks = config.css
      .map((href) => `<link rel="stylesheet" href="${href}">`)
      .join('\n');
    const boilerplate = this.useBoilerplate
      ? `<script type="module">${MAP_BOILERPLATE}</script>`
      : '';
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
${cssLinks}
<style>
  html, body { margin: 0; height: 100%; }
  .tde-wrap { display: flex; height: 100%; }
  #sidebar { display: flex; flex-direction: column; gap: 4px; padding: 8px; background: #f4f4f4; border-right: 1px solid #ddd; min-width: 110px; }
  #sidebar:empty { display: none; }
  #sidebar button { padding: 6px 8px; cursor: pointer; }
  #map { flex: 1; }
</style>
<script type="importmap">${JSON.stringify(importMap)}</script>
<script>${consoleHook}</script>
</head>
<body>
<div class="tde-wrap">
  <div id="sidebar"></div>
  <div id="map"></div>
</div>
${boilerplate}
<script type="module">${safeUserJs}</script>
</body>
</html>`;
  }

  reset() {
    if (!this.exerciseView) return;
    if (!window.confirm('Discard your changes and restore the starter code?')) return;
    this.setExerciseDoc(this.startCode);
    sessionStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.baselineKey);
    this.run();
  }

  copyAnswer() {
    if (!this.answerCode) return;
    if (!window.confirm('Replace your exercise code with the answer?')) return;
    this.setExerciseDoc(this.answerCode);
    this.switchTab('exercise');
  }

  setExerciseDoc(text) {
    this.exerciseView.dispatch({
      changes: { from: 0, to: this.exerciseView.state.doc.length, insert: text }
    });
  }

  clearConsole() {
    const consoleEl = this.querySelector('.tde-console');
    consoleEl.textContent = '';
    consoleEl.hidden = true;
  }

  appendConsole(level, text) {
    if (level !== 'error') return;
    const consoleEl = this.querySelector('.tde-console');
    const line = document.createElement('span');
    line.className = `tde-console-${level}`;
    line.textContent = text + '\n';
    consoleEl.appendChild(line);
    consoleEl.hidden = false;
  }

  showFatal(err) {
    const host = this.querySelector('.tde-editor-pane[data-pane="exercise"]');
    host.innerHTML = `<div class="tde-error">
      Could not load the live editor (${err.message}).<br>
      Check your network connection, or follow the plain code blocks on this
      page with the local template instead.</div>`;
  }
}

customElements.define('terra-draw-editor', TerraDrawEditor);
