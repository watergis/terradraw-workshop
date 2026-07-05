# Mapbox GL JS

[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) is the commercial
library that MapLibre was originally forked from, so this is the easiest
migration of all — the API is almost identical.

To use it locally:

```bash
pnpm install -D mapbox-gl terra-draw-mapbox-gl-adapter
```

## What changes vs MapLibre

### 1. Imports and access token

Mapbox requires an access token
([create a free one here](https://console.mapbox.com/)):

```diff
-import { Map } from 'maplibre-gl';
-import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
+import mapboxgl from 'mapbox-gl';
+import { TerraDrawMapboxGLAdapter } from 'terra-draw-mapbox-gl-adapter';
+
+mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
```

!!! info "About the token in this live editor"
    The example below expects a token to be baked in when this site is
    built (locally: set `MAPBOX_ACCESS_TOKEN` in `.env` and run
    `uv run python scripts/generate_keys.py`; on Cloudflare Pages it comes
    from a build environment variable). If no token was provided, the
    preview shows a notice instead of a map.

### 2. Map creation

Same shape as MapLibre — only the style URL scheme differs:

```ts
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v12',
	center: [132.4553, 34.3966], // [lng, lat], like MapLibre
	zoom: 12
});
```

### 3. The adapter

```diff
-    adapter: new TerraDrawMapLibreGLAdapter({ map }),
+    adapter: new TerraDrawMapboxGLAdapter({ map }),
```

Starting is also the same: wait for the `load` event.

## Live example

<terra-draw-editor start="../../code/other-libraries/mapbox/start.ts" lib="mapbox" boilerplate="none" height="480"></terra-draw-editor>

## What's Next?

[Google Maps](./google-maps.md).
