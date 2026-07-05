# One API, Many Mapping Libraries

Everything you learned in this workshop was written against MapLibre GL JS —
but Terra Draw's biggest strength is that the very same code works with all
major web mapping libraries. Only the **adapter** changes.

| Library | Adapter package | Adapter class |
| --- | --- | --- |
| MapLibre GL JS | `terra-draw-maplibre-gl-adapter` | `TerraDrawMapLibreGLAdapter` |
| Leaflet | `terra-draw-leaflet-adapter` | `TerraDrawLeafletAdapter` |
| OpenLayers | `terra-draw-openlayers-adapter` | `TerraDrawOpenLayersAdapter` |
| Mapbox GL JS | `terra-draw-mapbox-gl-adapter` | `TerraDrawMapboxGlAdapter` |
| Google Maps JS API | `terra-draw-google-maps-adapter` | `TerraDrawGoogleMapsAdapter` |
| ArcGIS JS SDK | `terra-draw-arcgis-adapter` | `TerraDrawArcGISMapsSDKAdapter` |

## Example: switching to Leaflet

Take the Exercise 6 code and swap MapLibre for
[Leaflet](https://leafletjs.com/). Three things change:

### 1. Imports

```diff
-import { Map } from 'maplibre-gl';
-import 'maplibre-gl/dist/maplibre-gl.css';
-import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
+import L from 'leaflet';
+import 'leaflet/dist/leaflet.css';
+import { TerraDrawLeafletAdapter } from 'terra-draw-leaflet-adapter';
```

```bash
pnpm install -D leaflet @types/leaflet terra-draw-leaflet-adapter
```

### 2. Map creation

```diff
-map = new Map({
-    container: mapContainer,
-    style: { ... },
-    center: [132.4553, 34.3966],
-    zoom: 12
-});
+map = L.map(mapContainer).setView([34.3966, 132.4553], 12);
+
+L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
+    maxZoom: 19,
+    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
+}).addTo(map);
```

!!! warning
    Watch the coordinate order: MapLibre uses `[lng, lat]` while Leaflet uses
    `[lat, lng]`.

### 3. The adapter

```diff
 draw = new TerraDraw({
-    adapter: new TerraDrawMapLibreGLAdapter({ map }),
+    adapter: new TerraDrawLeafletAdapter({ map, lib: L }),
     modes: [ /* unchanged! */ ]
 });

-map.once('load', () => {
-    draw.start();
-});
+// Leaflet does not need to wait for a `load` event
+draw.start();
```

**Everything else — modes, styles, events, data management, undo/redo — stays
exactly the same.** That is the value of Terra Draw's unified API.

![Leaflet running the exercise 6 code](./assets/leaflet.png)

!!! note "TypeScript with Leaflet v1 + SvelteKit"
    Leaflet v1 with SvelteKit may raise a TypeScript error by default. If so,
    change `module` and `moduleResolution` to `nodenext` in `tsconfig.json`.

## What's Next?

That's the end of the hands-on content — head over to the [Q&A page](./support.md) for how to stay in touch with the Terra Draw community.
