# Exercise 1: First Terra Draw Implementation

Let's create a basic Terra Draw setup with MapLibre GL JS — without any UI interaction yet.

## Try it in the live editor

The starter code below contains two TODO comments. Complete them, then click
**Run ▶**. If you get stuck, open the **Answer** tab.

<terra-draw-editor start="../../code/exercise-1/start.ts" answer="../../code/exercise-1/answer.ts" height="480"></terra-draw-editor>

## Walkthrough

First, import Terra Draw and the MapLibre adapter:

```ts
import { TerraDraw, TerraDrawRectangleMode } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
```

Then create a Terra Draw instance, connecting the map through the adapter and
registering the rectangle mode:

```ts
const draw = new TerraDraw({
    // Using the MapLibre Adapter
    adapter: new TerraDrawMapLibreGLAdapter({ map }),

    // Add the Rectangle Mode
    modes: [new TerraDrawRectangleMode()],
});
```

Finally, wait for MapLibre to load the map style, then start drawing:

```ts
// Have to wait for MapLibre to load the map style before starting to draw
map.once('load', () => {
    // Start drawing
    draw.start();
    draw.setMode("rectangle");
});
```

Now you can draw rectangle polygons by clicking on the map: one click starts
the rectangle, a second click finishes it.

## In the local SvelteKit template

Open `src/routes/+page.svelte`, add the imports below the existing ones, and
put the Terra Draw setup at the end of the `onMount()` function, after the
map initialization:

```ts
onMount(() => {
    // ... existing map initialization ...

    const draw = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map }),
        modes: [new TerraDrawRectangleMode()],
    });

    map.once('load', () => {
        draw.start();
        draw.setMode("rectangle");
    });
});
```

### Testing Your Implementation

1. **Save your changes** and the Vite development server should automatically reload
1. **Open your browser** to `http://localhost:5173`
1. **Test drawing** - click on the map to create rectangles

## What's Next?

Now that you have a working Terra Draw implementation without UI, let's add more Terra Draw modes with UI buttons.

[Continue to Exercise 2](./exercise-2.md)
