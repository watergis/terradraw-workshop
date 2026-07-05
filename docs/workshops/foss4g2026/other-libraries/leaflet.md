# Switching to Leaflet

[Leaflet](https://leafletjs.com/) is one of the most popular web mapping
libraries. In this exercise we take the drawing app you built in the
exercises and migrate it from MapLibre GL JS to Leaflet — and you will see
that the Terra Draw code does not change at all.

## The starting point: MapLibre

This is the app we are migrating. Unlike the earlier exercises, the code
below also *creates the map* — because that is exactly the part that differs
between libraries. The library-specific parts are marked with comments.

<terra-draw-editor start="../../code/other-libraries/maplibre/start.ts" boilerplate="none" height="480"></terra-draw-editor>

## What changes

To use Terra Draw locally with Leaflet, install Leaflet and its adapter:

```bash
pnpm install -D leaflet @types/leaflet terra-draw-leaflet-adapter
```

Only three things change. Everything else — modes, styles, events, data
management, the UI buttons — stays exactly the same.

### 1. Imports

```diff
-import { Map as MapLibreMap } from 'maplibre-gl';
-import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
+import L from 'leaflet';
+import { TerraDrawLeafletAdapter } from 'terra-draw-leaflet-adapter';
```

(In a local project you also swap the CSS import:
`maplibre-gl/dist/maplibre-gl.css` → `leaflet/dist/leaflet.css`. The live
editor loads the CSS for you.)

### 2. Map creation

```diff
-const map = new MapLibreMap({
-    container: 'map',
-    style: 'https://tiles.openfreemap.org/styles/bright',
-    center: [132.4553, 34.3966],
-    zoom: 12
-});
+const map = L.map('map').setView([34.3966, 132.4553], 12);
+L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
+    maxZoom: 19,
+    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
+}).addTo(map);
```

!!! warning "Coordinate order"
    MapLibre uses `[lng, lat]` while Leaflet uses `[lat, lng]`. This is the
    most common mistake when switching between the two.

### 3. The adapter — and when to start

```diff
 const draw = new TerraDraw({
-    adapter: new TerraDrawMapLibreGLAdapter({ map }),
+    adapter: new TerraDrawLeafletAdapter({ map, lib: L }),
     modes: [ /* unchanged! */ ]
 });

-map.once('load', () => {
-    draw.start();
-});
+// Leaflet is ready synchronously — no `load` event to wait for.
+draw.start();
```

## The result: Leaflet

Here is the same app after applying the three changes above — now running on
**Leaflet**. Compare it with the MapLibre version at the top of the page: the
Terra Draw part is byte-for-byte identical. Edit the code and press
**Run ▶** to experiment.

<terra-draw-editor start="../../code/other-libraries/leaflet/start.ts" lib="leaflet" height="480"></terra-draw-editor>

!!! note "TypeScript with Leaflet v1 + SvelteKit"
    In a local SvelteKit project, Leaflet v1 may raise a TypeScript error by
    default. If so, change `module` and `moduleResolution` to `nodenext` in
    `tsconfig.json`.

## What's Next?

The same three-step recipe works for every other library. Next:
[OpenLayers](./openlayers.md).
