---
slide_theme: presentation
header_logo: ../assets/images/foss4g2026/foss4g2026-logo-small.svg
title_logo: ../assets/images/foss4g2026/foss4g2026-logo-large.svg
event_date: 3 September 2026, 14:30
event_venue: International Conference Center Hiroshima
event_name: FOSS4G 2026 Hiroshima
presenter_name: Jin Igarashi
presenter_role: Software Engineer, Fracta Inc
profile_image: ../assets/images/jin-igarashi.png
linkedin: jinigarashi
github: JinIgarashi
---

# Terra Draw - Bring drawing feature to all map applications

## What is Terra Draw

An introduction for newcomers

### Drawing on a web map looks simple

Until you have to build it.

- Click to add a vertex, drag to move it, snap it to its neighbour
- Keep the geometry valid while the user is still drawing
- Undo, redo, select, delete
- Then do it all again on the next mapping library

### Every map library had its own answer

![Existing drawing plugins](../workshops/foss4g2026/assets/introduction/existing-drawing-plugins.png)

Leaflet.draw, leaflet-freedraw, mapbox-gl-draw... different APIs, different
behaviour, different bugs — and your drawing code is locked to one map.

### Terra Draw

An open source TypeScript library for drawing on web maps, created by
**James Milner** about four years ago.

One drawing engine, many maps.

```bash
npm install terra-draw
```

### Goals

- Cross map library support
- Custom modes
- Deep styling control
- Zero dependencies

### How it fits together

![Terra Draw architecture](../workshops/foss4g2026/assets/introduction/terra-draw-architecture.png)

**Adapter** talks to the map · **Modes** own the interaction · **Store** holds
the GeoJSON.

### One API, many maps

![Supported map libraries](../workshops/foss4g2026/assets/introduction/supported-map-libraries.png)

Swap the adapter, keep everything else.

### Modes do the drawing

- `point`, `linestring`, `polygon`, `marker`, `polyline`
- `rectangle`, `angled-rectangle`, `circle`, `sector`, `sensor`
- `freehand`, `freehand-linestring`
- `select` — move, rotate, scale, delete
- ...or write your own

## Getting Started

What does TerraDraw help you achieve?

### Set up in a few lines

```ts
import { TerraDraw, TerraDrawPolygonMode } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

const draw = new TerraDraw({
  adapter: new TerraDrawMapLibreGLAdapter({ map }),
  modes: [new TerraDrawPolygonMode({ snapping: true })]
});

draw.start();
draw.setMode('polygon');
```

### The data is just GeoJSON

```ts
draw.on('finish', (id) => {
  const snapshot = draw.getSnapshot();
  const feature = snapshot.find((f) => f.id === id);
  console.log(JSON.stringify(feature));
});
```

`getSnapshot()` / `addFeatures()` — load, save and round-trip your features
with anything that speaks GeoJSON.

## What's new for 2026?

New features to use in your project

### Undo / redo

![Undo and redo buttons](../assets/images/foss4g2026/whats-new/undo-redo.gif)

Common in every drawing application, one of the most requested features — and
hard to get right.

### A two-part system

- **Drawing** undo / redo, which works inside a single mode
- **Session** undo / redo, which works across modes
- Use them together, or either one on its own

```ts
draw.undo();
draw.redo();
```

### Styling improvements

![Per-feature styling](../assets/images/foss4g2026/whats-new/styling.png)

New ways to style your geometries — style callbacks receive the feature, so
colour, width and opacity can depend on your own properties.

---

![Per-feature styling](../assets/images/foss4g2026/whats-new/dashline.png)

line mode now supports dashed lines, with a new `lineStringDash` style property.

### Polyline mode

![Polyline mode](../assets/images/foss4g2026/whats-new/polyline-mode.gif)

Lines that can be closed into polygons: start drawing a line and finish it as
an area, without switching mode.

### Multiple instances of the same mode

![Two polygon modes with different styles](../assets/images/foss4g2026/whats-new/multiple-instances.png)

Register one mode twice with different configurations — for example two polygon
modes with different styling and validation.

### New drawing interactions

![Click and drag drawing](../assets/images/foss4g2026/whats-new/click-and-drag.png)

Click and drag support: drag out a rectangle or a circle in one gesture instead
of clicking corner by corner.

### But you still have to build the UI

Terra Draw gives you the drawing engine — the buttons, the mode switching and
the map controls are yours to write.

## maplibre-gl-terradraw

A MapLibre GL JS plugin: Terra Draw plus a ready-made control.

### One line to add the control

```bash
npm install @watergis/maplibre-gl-terradraw
```

Then, just one line of code to add the control to your MapLibre map:

```ts
import { MaplibreTerradrawControl } from '@watergis/maplibre-gl-terradraw';

map.addControl(
  new MaplibreTerradrawControl({ open: true }),
  'top-left'
);
```

### Measure control

![Measure control](../workshops/foss4g2026/assets/plugin-measure-control.png)

`MaplibreMeasureControl` adds distance and area labels to the geometries as
you draw them.

### Routing with the Valhalla control

![Valhalla control](../workshops/foss4g2026/assets/plugin-valhalla-control.png)

Draw a line, get a route back — the isochrone and routing controls turn drawn
geometry into an API request.

### An example - UNDP's GeoHub

![GeoHub drawing and measuring on a MapLibre map](../assets/images/geohub-terradraw.png)

UNDP's **GeoHub** uses the plugin for drawing and measuring.

## Contribution

How you can get involved with the Terra Draw project

### Contributing

- Lend a star on GitHub
- If you find a bug, post a clear reproducible issue
- Discuss issues on the tracker, and raise pull requests
- Let's chat after the talk if you are interested!

### Links and resources

- Terra Draw — <https://terradraw.io> · <https://github.com/JamesLMilner/terra-draw>
- Plugin — <https://terradraw.water-gis.com>
- Workshop material - <https://workshops.terradraw.water-gis.com>

#### Try it yourself

The FOSS4G 2026 workshop runs through all of this in the browser, with a live
editor on every page:

Terra Draw workshop - <https://workshops.terradraw.water-gis.com/workshops/foss4g2026/>

No install, no build step — edit the code and the map updates.

## Questions?

Thank you for listening
