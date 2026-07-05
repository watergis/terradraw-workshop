# ArcGIS Maps SDK

The [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/)
is Esri's mapping library. Like OpenLayers it is fully modular, so the Terra
Draw adapter receives the classes it needs via `lib`.

To use it locally:

```bash
pnpm install -D @arcgis/core terra-draw-arcgis-adapter
```

## What changes vs MapLibre

### 1. Imports

```ts
import EsriMap from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
// ...plus the geometry/symbol classes the adapter needs (see below)
import { TerraDrawArcGISMapsSDKAdapter } from 'terra-draw-arcgis-adapter';
```

### 2. Map creation

ArcGIS separates the *map* (data) from the *view* (rendering):

```ts
const map = new EsriMap({ basemap });
const view = new MapView({
	container: 'map',
	map,
	center: [132.4553, 34.3966],
	zoom: 12
});
```

!!! note "Basemaps and API keys"
    Esri's own basemaps (e.g. `basemap: 'topo-vector'`) require an ArcGIS API
    key. The live example below instead builds a keyless basemap from CARTO
    raster tiles with a `WebTileLayer`, so it runs without any key.

### 3. The adapter — and when to start

The adapter wraps the **view**, not the map:

```ts
adapter: new TerraDrawArcGISMapsSDKAdapter({
	lib: {
		GraphicsLayer, Graphic, Point, Polyline, Polygon,
		SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol,
		PictureMarkerSymbol, Color
	},
	map: view
})
```

```ts
view.when(() => {
	draw.start();
});
```

## Live example

<terra-draw-editor start="../../code/other-libraries/arcgis/start.ts" lib="arcgis" boilerplate="none" height="480"></terra-draw-editor>

## What's Next?

That's the end of the hands-on content — six mapping libraries, one Terra
Draw API. Head over to the [Q&A page](../support.md) for how to stay in touch
with the Terra Draw community.
