# Exercise 1: First Terra Draw Implementation

Let's create a basic Terra Draw setup with MapLibre GL JS. Update your `src/routes/+page.svelte`:

## Basic TerraDraw setup

Firstly, we can setup TerraDraw without any UI interaction.

Open `+page.svelte`, add the following codes in the `<script>` tag section.

```ts
import { TerraDraw, TerraDrawRectangleMode } from 'terra-draw'
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

onMount(() => {
    // Add codes in the last section of onMount

    const draw = new TerraDraw({
    // Using the MapLibre Adapter
    adapter: new TerraDrawMapLibreGLAdapter({ map }),

    // Add the Rectangle Mode
    modes: [new TerraDrawRectangleMode()],
    });

    // Have to wait maplibre to load map style before starting to draw
    map.once('load', () => {
        // Start drawing
        draw.start();
        draw.setMode("rectangle");
    })
})
```

You can draw a rectangle polygon on the map like below.

![TerraDraw Rectangle Mode without UI interactions](../assets/basics/basic-setup.png)

### Testing Your Implementation

1. **Save your changes** and the Vite development server should automatically reload
1. **Open your browser** to `http://localhost:5173`
1. **Test drawing** - click on the map to create rectangles

### Example code

The above example code is available at [example/without-ui](https://github.com/watergis/terradraw-workshop-template/tree/example/without-ui) branch.

## What's Next?

Now that you have a working Terra Draw implementation without UI, let's add more TerraDraw modes with UI buttons.
