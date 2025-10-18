# Exercise 3: TerraDrawSelectMode

Let's add TerraDrawSelectMode to allow selecting and modifying features. Update your `src/routes/+page.svelte`:

## Add select mode

Firstly, import `TerraDrawSelectMode` to your +page.svelte`.

```ts
import {
    TerraDraw,
    TerraDrawPointMode,
    TerraDrawLineStringMode,
    TerraDrawPolygonMode,
    TerraDrawSelectMode // add here
} from 'terra-draw';
```

Then, `TerraDrawSelectMode` needs to be added to `modes` through TerraDraw constructor.

```ts
draw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map }),
    modes: [
        new TerraDrawPointMode(),
        new TerraDrawLineStringMode(),
        new TerraDrawPolygonMode(),
        // Add Select mode with feature and coordinate editing enabled
        new TerraDrawSelectMode({
            flags: {
                point: {
                    feature: {
                        draggable: true
                    }
                },
                linestring: {
                    feature: {
                        draggable: true,
                        rotateable: true,
                        coordinates: {
                            midpoints: true,
                            draggable: true,
                            deletable: true,
                        }
                    }
                },
                polygon: {
                    feature: {
                        draggable: true,
                        rotateable: true,
                        coordinates: {
                            midpoints: true,
                            draggable: true,
                            deletable: true,
                        }
                    }
                }
            }
        })
    ]
});
```

## Add buttons

Add a new button for Select mode to HTML section of component

```html
<aside class="sidebar">
    <!-- Use this space for adding additional elements for workshop -->
    <button onclick={() => handleModeClick('point')}>Point</button>
    <button onclick={() => handleModeClick('linestring')}>Line</button>
    <button onclick={() => handleModeClick('polygon')}>Polygon</button>
    <button onclick={handleClearClick}>Clear</button>

    <!-- Add select mode button here -->
    <hr>
    <button onclick={() => handleModeClick('select')}>Select</button>
</aside>
```

Now, you can select a feature after drawing, then can drag or modify it.

![Basic example with Select mode](../assets/basics/basic-setup-with-select.png)

### Testing Your Implementation

1. **Save your changes** and the Vite development server should automatically reload
1. **Open your browser** to `http://localhost:5173`
1. **Test select mode** - click `select` button to drag or modify features you have drawn.
1. **Adjust parameters of select mode** - Try to change select mode parameters to see how parameters will behave on Select mode.

### Extra challenge

The following options are available for `TerraDrawSelectMode`. Change or add options to see how parameters affect Select mode behaviour.

```ts
polygon: {
    feature: {
        draggable: true, // you can drag a polygon
        rotateable: true, // you can rotate with ctrl+r (ctrl+command+r in mac)
        coordinates: {
            midpoints: true,

            // Can be moved
            draggable: true,

            // Can be deleted
            deletable: true,

            // Can snap to other coordinates from geometries _of the same mode_
            snappable: true,
            
            // Allow resizing of the geometry from a given origin. 
            // center will allow resizing of the aspect ratio from the center
            // and opposite allows resizing from the opposite corner of the 
            // bounding box of the geometry. 
            resizable: 'center', // can also be 'opposite', 'center-fixed', 'opposite-fixed'
        }
    }
}
```

### Example code

The above example code is available at [example/with-select-mode](https://github.com/watergis/terradraw-workshop-template/tree/example/with-select-mode) branch.

## What's Next?

Now you can select or modify features and learned basics of TerraDraw implementation. Let's start learning more advanced features in the next step.
