# MapLibre GL JS v5 to v6

This workshop uses **MapLibre GL JS v6** together with Terra Draw v1.32.2 and `terra-draw-maplibre-gl-adapter` v1.4.1. The adapter itself needed no change for v6 — it supports v4, v5 and v6 (see [terra-draw#912](https://github.com/JamesLMilner/terra-draw/issues/912)) — but MapLibre v6 changed *how the library is delivered*, and that part is worth knowing before you start writing code.

!!! note
    This page is background information. The live editor on every exercise page already takes care of all of it, so if you are following **Track A** you can jump straight to [Terra Draw Basics](./basics/index.md) and come back later. If you are following **Track B** (the local SvelteKit template), read on — the template contains the exact settings described here.

## ESM only: the UMD bundle is gone

The headline change in v6 is the distribution format. MapLibre GL JS v6 ships as **ES modules only**. The UMD bundle (`maplibre-gl.js`) and the separate CSP bundle (`maplibre-gl-csp.js`) are no longer published.

| | v5 | v6 |
| --- | --- | --- |
| Main bundle | `dist/maplibre-gl.js` (UMD) | `dist/maplibre-gl.mjs` (ESM) |
| CSP build | `dist/maplibre-gl-csp.js` | removed (no longer needed) |
| Worker | inlined / blob | `dist/maplibre-gl-worker.mjs` |
| `package.json` | `main` + `module` | `"type": "module"`, `import` only |

So a classic script tag no longer works:

```html
<!-- v5: UMD, exposes a global `maplibregl` -->
<script src="https://unpkg.com/maplibre-gl@^5/dist/maplibre-gl.js"></script>
```

Use a module script instead:

```html
<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@^6.0.0/dist/maplibre-gl.css" />
<div id="map" style="height: 400px"></div>
<script type="module">
	import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.0.0/dist/maplibre-gl.mjs';

	const map = new maplibregl.Map({
		container: 'map',
		style: 'https://tiles.openfreemap.org/styles/bright',
		center: [132.4553, 34.3966],
		zoom: 12
	});
</script>
```

There is no global `maplibregl` variable any more — you always import it.

## Imports

If you already use **named imports**, nothing changes:

```ts
// works in both v5 and v6
import { Map, NavigationControl } from 'maplibre-gl';
```

Only the **default import** has to be updated, because the ESM build has no default export:

```ts
// before (v5)
import maplibregl from 'maplibre-gl';

// after (v6) — namespace import
import * as maplibregl from 'maplibre-gl';

// or just pull in what you need
import { Map, setWorkerUrl } from 'maplibre-gl';
```

The workshop template (`template/src/routes/+page.svelte`) and the live editor both use named imports, which is the style we follow throughout the exercises.

## The web worker

MapLibre does its tile parsing in a Web Worker. In v6 that worker is a real module file, `dist/maplibre-gl-worker.mjs`, and it imports a sibling file, `dist/maplibre-gl-shared.mjs`, using a *relative* path.

**Loading from a CDN.** The worker URL is derived automatically from `import.meta.url`, so no setup is required. But because the worker resolves its sibling relatively, the whole `dist/` directory has to stay reachable — point at the full file path:

```js
// good: sibling files (worker + shared chunk) are reachable
import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.5.0/dist/maplibre-gl.mjs';
```

CDNs that re-bundle and rewrite module paths break this: the main module loads, but the worker request 404s and the map hangs without an error. This is why the live editor in this workshop pins the plain unpkg `dist/maplibre-gl.mjs` URL.

**Content Security Policy.** When MapLibre is loaded cross-origin from a CDN, the worker is constructed from a same-origin blob URL, so your CSP needs:

```
worker-src 'self' blob: ;
img-src data: blob: 'self' ;
```

If you self-host the worker (any bundler setup, including our template), the worker URL is same-origin and `blob:` is not required.

## Using MapLibre v6 with Vite

Inside a bundler, `import.meta.url` does not reliably resolve to the worker file, so each project needs a one-time `setWorkerUrl()` call. With Vite, use the `?worker&url` query to get a bundled, self-contained worker URL:

```ts
import { Map, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

setWorkerUrl(workerUrl);

const map = new Map({
	/* … */
});
```

Use `?worker&url` rather than a plain `?url`: the dist worker imports its sibling `maplibre-gl-shared.mjs`, and `?url` emits the worker file verbatim in production builds without that sibling — the worker then fails on its first import and no vector tiles load. `?worker&url` routes the file through Vite's worker pipeline and emits a self-contained chunk.

In addition, the workshop template excludes MapLibre from Vite's dependency pre-bundling, because the worker can fail to bundle during that step:

```ts
// template/vite.config.ts
export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		// MapLibre v6 worker bundling can fail during dependency pre-bundling.
		exclude: ['maplibre-gl']
	}
});
```

This one is our own workaround for this template rather than an upstream requirement — if your project works without it, you do not need it.

!!! tip "Other bundlers"
    webpack 5+, rspack and rsbuild use the same `setWorkerUrl()` call with a plain URL: `setWorkerUrl(new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url).toString());` See the [v5 to v6 migration guide](https://github.com/maplibre/maplibre-gl-js/blob/main/docs/guides/v5-to-v6-migration-guide.md) for the full list of changes.

## What's Next?

Now that you know what is different about MapLibre v6, let's learn the Terra Draw fundamentals.

[Continue to Terra Draw Basics](./basics/index.md)
