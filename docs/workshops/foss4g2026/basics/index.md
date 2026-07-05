# Core Concepts

In this section, you'll learn Terra Draw's core concepts and create your first drawing application.

Terra Draw is built around several key concepts that make it powerful and flexible:

## Store

The Store is the heart of the library and is responsible for managing the state of all Features that are added to the map. The Store is created when Terra Draw is instantiated:

```ts
// Create a Terra Draw instance and assign it to a variable called `draw`
const draw = new TerraDraw({ adapter, modes });
```

!!! note
    Throughout the workshop documentation, we will use the variable name `draw` to refer to the Terra Draw instance.

Features are added to the Store when interacting with the Map using a number of available drawing Modes (such as `TerraDrawRectangleMode` or `TerraDrawPolygonMode`).

The Store is exposed via the `getSnapshot` method, which returns an Array of all given Feature geometries in the Store:

```ts
// Get an Array of all Features in the Store
const features = draw.getSnapshot();
```

## Adapters

Adapters are thin wrappers that contain map library specific logic, for creating and updating layers rendered by the mapping library. Terra Draw supports a series of Adapters out of the box, with a series of packages within its monorepo. Currently supported are: Leaflet, OpenLayers, Mapbox GL JS, MapLibre GL JS, Google Maps JS API and the ArcGIS JS SDK.

In this workshop, we use MapLibre GL JS as the mapping library. You can install the MapLibre adapter (`TerraDrawMapLibreGLAdapter`) in the following way:

```bash
npm install terra-draw-maplibre-gl-adapter
```

```ts
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

// Create an Adapter for MapLibre GL JS
const adapter = new TerraDrawMapLibreGLAdapter({ map });
```

See the [Adapters](https://github.com/JamesLMilner/terra-draw/blob/main/guides/3.ADAPTERS.md) section in the official documentation.

## Modes

Modes represent the logic for a specific drawing tool, for example there are `TerraDrawRectangleMode`, `TerraDrawPolygonMode` and `TerraDrawLineStringMode` Modes which allow you to draw rectangles, polygons and lines on the map respectively.

The `TerraDrawSelectMode` allows for the selection and manipulation of features on the Map, while the `TerraDrawRenderMode` is used to render uneditable features, for example contextual data.

Modes are instantiated like so:

```ts
const polygonMode = new TerraDrawPolygonMode();
const rectangleMode = new TerraDrawRectangleMode();
const renderMode = new TerraDrawRenderMode({
  modeName: "auniquename",
});
```

Currently the following drawing modes are supported by Terra Draw (as of v1.31):

| Mode | Class | Mode Name |
| --- | --- | -- |
| Angled Rectangle | `TerraDrawAngledRectangleMode` | `angled-rectangle` |
| Circle | `TerraDrawCircleMode` | `circle` |
| Freehand | `TerraDrawFreehandMode` | `freehand` |
| Freehand LineString | `TerraDrawFreehandLineStringMode` | `freehand-linestring` |
| Line | `TerraDrawLineStringMode` | `linestring` |
| Marker | `TerraDrawMarkerMode` | `marker` |
| Point | `TerraDrawPointMode` | `point` |
| Polygon | `TerraDrawPolygonMode` | `polygon` |
| Polyline | `TerraDrawPolyLineMode` | `polyline` |
| Rectangle | `TerraDrawRectangleMode` | `rectangle` |
| Sector | `TerraDrawSectorMode` | `sector` |
| Sensor | `TerraDrawSensorMode` | `sensor` |

!!! tip "New in Terra Draw v1.31"
    The **Polyline** mode is one of the newest additions: it starts like the
    linestring mode, but clicking the first point again closes the shape into
    a polygon. We will try it in [Exercise 2](./exercise-2.md).

See the [Modes](https://github.com/JamesLMilner/terra-draw/blob/main/guides/4.MODES.md) section in the official documentation.

## Setup Terra Draw

You can install Terra Draw into your local project like so:

```bash
npm install terra-draw terra-draw-maplibre-gl-adapter
```

Once installed via NPM you can use Terra Draw in your project like so:

```ts
import { TerraDraw, TerraDrawRectangleMode } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

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

!!! note
    In the live editors of this workshop, Terra Draw and the adapter are
    already available — the `import` statements at the top of each exercise
    work out of the box, no installation needed.

## What's Next?

Now that you understand the core concepts, let's create your first Terra Draw implementation.

[Start Exercise 1](./exercise-1.md)
