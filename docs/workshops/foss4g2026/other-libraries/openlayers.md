# OpenLayers

[OpenLayers](https://openlayers.org/) is a powerful, fully modular mapping
library. This page shows the same drawing app running on OpenLayers — press
**Run ▶** below and compare the code with the MapLibre version: the Terra
Draw part is identical.

To use it locally:

```bash
pnpm install -D ol terra-draw-openlayers-adapter
```

## What changes vs MapLibre

### 1. Imports

OpenLayers is modular, so you import each class you need:

```ts
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { fromLonLat, toLonLat, getUserProjection } from 'ol/proj.js';
// ...plus the style/vector classes the adapter needs (see below)
import { TerraDrawOpenLayersAdapter } from 'terra-draw-openlayers-adapter';
```

### 2. Map creation

```ts
const map = new Map({
	target: 'map',
	layers: [new TileLayer({ source: new OSM() })],
	view: new View({ center: fromLonLat([132.4553, 34.3966]), zoom: 12 })
});
```

!!! warning "Projections"
    OpenLayers works in Web Mercator (EPSG:3857) internally, so `[lng, lat]`
    coordinates are converted with `fromLonLat()`. Terra Draw itself always
    speaks GeoJSON `[lng, lat]` — the adapter converts for you.

### 3. The adapter

Because OpenLayers is modular, the adapter receives the classes it needs via
`lib` instead of importing them itself:

```ts
adapter: new TerraDrawOpenLayersAdapter({
	lib: {
		Circle, Feature, GeoJSON, Style, VectorLayer, VectorSource,
		Stroke, Fill, Icon, getUserProjection, Projection, fromLonLat, toLonLat
	},
	map
})
```

Start drawing once the first frame is rendered:

```ts
map.once('rendercomplete', () => {
	draw.start();
});
```

## Live example

<terra-draw-editor start="../../code/other-libraries/openlayers/start.ts" lib="openlayers" boilerplate="none" height="480"></terra-draw-editor>

## What's Next?

[Mapbox GL JS](./mapbox.md) — the closest relative of MapLibre.
