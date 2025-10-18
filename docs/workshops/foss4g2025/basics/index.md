# Core Concepts

In this section, you'll learn Terra Draw's core concepts and create your first drawing application.

Terra Draw is built around several key concepts that make it powerful and flexible:

## Store

The Store is the heart of the library and is responsible for managing the state of all Features that are added to the map. The Store is created when Terra Draw is instantiated:

```ts
// Create a Terra Draw instance and assign it to a variable called `draw`
const draw = new TerraDraw({ adapter, modes });
```

!!! notes
    Throughout the workshop documentation, we will use the variable name `draw` to refer to the Terra Draw instance.

Features are added to the Store when interacting with the Map using a number of available drawing Modes (such as `TerraDrawRectangleMode` or `TerraDrawPolygonMode`).

The Store is exposed via the getSnapshot method, which returns an Array of all given Feature geometries in the Store:

```ts
// Get an Array of all Features in the Store
const features = draw.getSnapshot();
```

## Adapters

Adapters are thin wrappers that contain map library specific logic, for creating and updating layers rendered by the mapping library. Terra Draw supports a series of Adapters out of the box, with a series of packages within this monorepo. Currently supported are: Leaflet, OpenLayers, Mapbox GL JS, MapLibre GL JS, Google Maps JS API and the ArcGIS JS SDK.

In this workshop, we use maplibre as mapping library, you can install the Maplibre adapter (TerraDrawMapLibreGLAdapter) in the following way:

```bash
npm install terra-draw-maplibre-gl-adapter
```

```ts
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

// Create an Adapter for Leaflet
const adapter = new TerraDrawMapLibreGLAdapter({ map, lib });
```

See the [Adapters](https://github.com/JamesLMilner/terra-draw/blob/main/guides/3.ADAPTERS.md) section in the official documentation.

## Modes

Modes represent the logic for a specific drawing tool, for example there are `TerraDrawRectangleMode`, `TerrDrawPolygonMode` and `TerraDrawLineStringMode` Modes which allow you to draw rectangles, polygons and lines on the map respectively.

The `TerraDrawSelectMode` allows for the selection and manipulation of features on the Map, while the `TerraDrawRenderMode` is used to render uneditable features, for example contextual data.

Modes are instantiated like so:

```ts
const polygonMode = new TerraDrawPolygonMode();
const rectangleMode = new TerraDrawRectangleMode();
const renderMode = new TerraDrawRenderMode({
  modeName: "auniquename",
});
```

Currently the following drawing modes are supported by TerraDraw.

| Mode | Class | Mode Name |
| --- | --- | -- |
| Angled Rectangle    | `TerraDrawRectangleMode`    | `angled-rectangle`   |
| Circle       | `TerraDrawCircleMode`          | `circle`      |
| Freehand     | `TerraDrawFreehandMode`      | `freehand`    |
| Freehand LineString     | `TerraDrawFreehandLineStringMode`       | `freehand-linestring`    |
| Line         | `TerraDrawLineStringMode`   | `linestring`  |
| Marker         | `TerraDrawMarkerMode`   | `marker`  |
| Point        | `TerraDrawPointMode`             | `point`       |
| Polygon      | `TerraDrawPolygonMode`         | `polygon`     |
| Rectangle    | `TerraDrawRectangleMode`     | `rectangle`   |
| Sector    | `TerraDrawSector`     | `sector`   |
| Sensor    | `TerraDrawSensor`     | `sensor`   |

See the [Modes](https://github.com/JamesLMilner/terra-draw/blob/main/guides/4.MODES.md) section in official documentation.

## Setup TerraDraw

You can install the TerraDraw into your project like so:

```bash
npm install terra-draw
npm install terra-draw-maplibre-gl-adapter
```

Once installed via NPM you can use Terra Draw in your project like so:

```ts
import { Map } from 'maplibre-gl';
import { TerraDraw, TerraDrawRectangleMode } from 'terra-draw'
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

const map = new MapLibreGL.Map({ container: "map" });

const draw = new TerraDraw({
// Using the MapLibre Adapter
adapter: new TerraDrawMapLibreGLAdapter({ map }),

// Add the Rectangle Mode
modes: [new TerraDrawRectangleMode()],
});

map.once('load', () => {
    // Start drawing
    draw.start();
    draw.setMode("rectangle");
})
```

## What's Next?

Now that you understand the core concepts, let's create your first Terra Draw implementation.
