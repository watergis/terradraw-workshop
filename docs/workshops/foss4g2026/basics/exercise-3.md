# Exercise 3: TerraDrawSelectMode

Let's add `TerraDrawSelectMode` to allow selecting and modifying features.

## Try it in the live editor

Add the select mode with feature and coordinate editing enabled, plus a
**Select** button.

<terra-draw-editor start="../../code/exercise-3/start.ts" answer="../../code/exercise-3/answer.ts" height="520"></terra-draw-editor>

## Walkthrough

First, import `TerraDrawSelectMode`:

```ts
import {
    TerraDraw,
    TerraDrawPointMode,
    TerraDrawLineStringMode,
    TerraDrawPolyLineMode,
    TerraDrawPolygonMode,
    TerraDrawSelectMode // add here
} from 'terra-draw';
```

Then add `TerraDrawSelectMode` to the `modes` array. The `flags` option
controls what can be edited, per mode name:

```ts
new TerraDrawSelectMode({
    // Allow selecting a feature just by clicking it (added in v1.27)
    allowManualSelection: true,
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
                    deletable: true
                }
            }
        },
        // Features drawn with polyline mode keep `mode: 'polyline'`,
        // so they need their own flags to be editable
        polyline: {
            feature: {
                draggable: true,
                rotateable: true,
                coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true
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
                    deletable: true
                }
            }
        }
    }
})
```

Finally add a **Select** button:

```ts
addButton('Select', () => handleModeClick('select'));
```

or in the SvelteKit sidebar:

```html
<hr>
<button onclick={() => handleModeClick('select')}>Select</button>
```

Now you can select a feature after drawing, then drag or modify it.

### Testing Your Implementation

1. **Test select mode** - click the `Select` button, then drag or modify features you have drawn
1. **Test coordinate editing** - drag the midpoints of a polygon to insert new coordinates
1. **Adjust parameters of select mode** - change the select mode parameters to see how they affect the behaviour

### Extra challenge

The following options are available in the `flags` of `TerraDrawSelectMode`.
Change or add options to see how they affect the Select mode behaviour:

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

## What's Next?

You now know the basics of Terra Draw. Time for a break — then we'll continue with the advanced features.

[Continue to Advanced Features](../advanced/index.md)
