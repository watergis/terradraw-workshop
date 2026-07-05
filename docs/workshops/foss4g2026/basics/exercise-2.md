# Exercise 2: Drawing Modes with UI Buttons

Let's register more drawing modes and add buttons to switch between them —
including the brand-new **polyline** mode.

## Polyline mode (new in Terra Draw v1.31)

`TerraDrawPolyLineMode` is one of the newest drawing modes. It starts exactly
like the linestring mode, but with a twist:

- keep clicking to draw a line, then double-click (or press Enter) to finish
  it as a **LineString** — same as linestring mode
- **or click the first point of the line again to close the shape into a
  Polygon**

This mimics the drawing behaviour of many desktop GIS tools, where a single
tool can produce either a line or a polygon.

## Try it in the live editor

Replace the rectangle mode with `point`, `linestring`, `polyline` and
`polygon` modes, then wire up the buttons. Try closing a polyline into a
polygon by clicking its first point!

<terra-draw-editor start="../../code/exercise-2/start.ts" answer="../../code/exercise-2/answer.ts" height="520"></terra-draw-editor>

## Walkthrough

Import the mode classes (note that `TerraDrawRectangleMode` is removed):

```ts
import {
    TerraDraw,
    TerraDrawPointMode,
    TerraDrawLineStringMode,
    TerraDrawPolyLineMode,
    TerraDrawPolygonMode
} from 'terra-draw';
```

Update the `modes:` array in the Terra Draw initialization:

```ts
const draw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map }),
    modes: [
        new TerraDrawPointMode(),
        new TerraDrawLineStringMode(),
        new TerraDrawPolyLineMode(),
        new TerraDrawPolygonMode()
    ]
});
```

Remove `draw.setMode("rectangle");` so that we don't automatically start with
any drawing tool:

```diff
map.once('load', () => {
    // Start drawing
    draw.start();
-   draw.setMode("rectangle");
});
```

Add two handler functions:

```ts
const handleModeClick = (mode: string) => {
    draw.setMode(mode);
};

const handleClearClick = () => {
    draw.clear();
};
```

Finally add one button per mode. In the live editor this is done with the
`addButton()` helper:

```ts
addButton('Point', () => handleModeClick('point'));
addButton('Line', () => handleModeClick('linestring'));
addButton('Polyline', () => handleModeClick('polyline'));
addButton('Polygon', () => handleModeClick('polygon'));
addButton('Clear', () => draw.clear());
```

## In the local SvelteKit template

In `+page.svelte`, the handlers go just before the closing `</script>` tag,
and the buttons go into the sidebar `<aside>`:

```html
<aside class="sidebar">
    <button onclick={() => handleModeClick('point')}>Point</button>
    <button onclick={() => handleModeClick('linestring')}>Line</button>
    <button onclick={() => handleModeClick('polyline')}>Polyline</button>
    <button onclick={() => handleModeClick('polygon')}>Polygon</button>
    <button onclick={handleClearClick}>Clear</button>
</aside>
```

### Testing Your Implementation

1. **Test drawing** - click the corresponding buttons to create points, lines and polygons
1. **Test polyline mode** - draw a line and finish it, then draw another one and click its first point to close it into a polygon
1. **Remove features** - click the `Clear` button to remove all features

### Extra challenge

Try adding other Terra Draw modes: `TerraDrawCircleMode`,
`TerraDrawFreehandMode`, `TerraDrawAngledRectangleMode`,
`TerraDrawMarkerMode`... The pattern is always the same: register the mode in
the `modes` array and add a button that calls `draw.setMode('<mode name>')`.

## What's Next?

Now you can add and remove points, lines and polygons. Next, let's learn how to select and modify features.

[Continue to Exercise 3](./exercise-3.md)
