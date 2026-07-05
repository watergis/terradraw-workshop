# Exercise 4: Custom Styling

In this section, you'll learn about Terra Draw's advanced styling capabilities.

Terra Draw provides extensive styling capabilities for all drawing modes. Styling follows the patterns described in the [official styling guide](https://github.com/JamesLMilner/terra-draw/blob/main/guides/5.STYLING.md).

## Point style

The `TerraDrawPointMode` is styled using the following properties:

| Property            | Type      | Example Value | Description                    |
| ------------------- | --------- | ------------- | ------------------------------ |
| `pointColor`        | Hex Color | `#00FFFF`     | The fill color of the point    |
| `pointWidth`        | Integer   | `2`           | The width of the point         |
| `pointOpacity`      | Number (0-1) | `0.8`      | The fill opacity of the point (added in v1.24) |
| `pointOutlineColor` | Hex Color | `#00FFFF`     | The outline color of the point |
| `pointOutlineWidth` | Integer   | `2`           | The outline width of the point |

## LineString style

The `TerraDrawLineStringMode` is styled using the following properties:

| Property                   | Type         | Example Value | Description                            |
| -------------------------- | ------------ | ------------- | -------------------------------------- |
| `lineStringColor`          | Hex Color    | `#00FFFF`     | The color of the linestring            |
| `lineStringWidth`          | Integer      | `2`           | The width of the linestring            |
| `lineStringOpacity`        | Number (0-1) | `0.8`         | The opacity of the linestring (added in v1.24) |
| `lineStringDash`           | [dash, gap]  | `[2, 2]`      | Dash pattern in pixels (added in v1.30) |
| `closingPointColor`        | Hex Color    | `#00FFFF`     | The fill color of the closing point    |
| `closingPointWidth`        | Integer      | `1`           | The width of the closing point         |
| `closingPointOutlineColor` | Hex Color    | `#00FF00`     | The outline color of the closing point |
| `closingPointOutlineWidth` | Integer      | `2`           | The outline width of the closing point |

`TerraDrawFreehandLineStringMode` and `TerraDrawPolyLineMode` also share most of these styling properties.

!!! tip "New in Terra Draw v1.30"
    `lineStringDash` takes a tuple `[dashLength, gapLength]` in pixels, so
    `[2, 2]` draws a dashed line and `[1, 3]` draws a dotted-looking one.

## Polygon style

The `TerraDrawPolygonMode` is styled using the following properties:

| Property                   | Type         | Example Value | Description                            |
| -------------------------- | ------------ | ------------- | -------------------------------------- |
| `fillColor`                | Hex Color    | `#00FFFF`     | The fill color of the polygon          |
| `fillOpacity`              | Number (0-1) | `0.7`         | The fill opacity of the polygon        |
| `outlineColor`             | Hex Color    | `#00FFFF`     | The outline color of the polygon       |
| `outlineWidth`             | Integer      | `2`           | The outline width of the polygon       |
| `outlineOpacity`           | Number (0-1) | `0.9`         | The outline opacity of the polygon (added in v1.24) |
| `closingPointColor`        | Hex Color    | `#00FFFF`     | The fill color of the closing point    |
| `closingPointWidth`        | Integer      | `1`           | The width of the closing point         |
| `closingPointOutlineColor` | Hex Color    | `#00FF00`     | The outline color of the closing point |
| `closingPointOutlineWidth` | Integer      | `2`           | The outline width of the closing point |

Other polygon drawing modes such as `TerraDrawFreehandMode`, `TerraDrawCircleMode`, etc. also follow the same properties to customise style.

## Try it in the live editor

Starting from the Exercise 3 code, add a `styles` object to each mode. The
answer makes points white with a red outline, lines red / dashed /
semi-transparent, and polygons white with a red outline — plus a custom
selection style.

<terra-draw-editor start="../../code/exercise-4/start.ts" answer="../../code/exercise-4/answer.ts" height="520"></terra-draw-editor>

## Walkthrough

Add a `styles` option to each drawing mode:

```ts
draw = new TerraDraw({
    modes: [
        new TerraDrawPointMode({
            styles: {
                pointColor: '#FFFFFF',
                pointWidth: 5,
                pointOutlineColor: '#FF0000',
                pointOutlineWidth: 1
            }
        }),
        new TerraDrawLineStringMode({
            styles: {
                lineStringColor: '#FF0000',
                lineStringWidth: 2,
                // Semi-transparent line (added in v1.24)
                lineStringOpacity: 0.8,
                // Dashed line: 2px dash followed by a 2px gap (added in v1.30)
                lineStringDash: [2, 2],
                closingPointColor: '#FFFFFF',
                closingPointWidth: 3,
                closingPointOutlineColor: '#FF0000',
                closingPointOutlineWidth: 1
            }
        }),
        new TerraDrawPolygonMode({
            styles: {
                fillColor: '#FFFFFF',
                fillOpacity: 0.7,
                outlineColor: '#FF0000',
                outlineWidth: 2,
                closingPointColor: '#FFFFFF',
                closingPointWidth: 3,
                closingPointOutlineColor: '#FF0000',
                closingPointOutlineWidth: 1
            }
        }),
    ]
})
```

## Custom style for Select mode

However, styles when selecting features with `TerraDrawSelectMode` still use
the default style. Add a `styles` property to your `TerraDrawSelectMode` like
below:

```ts
new TerraDrawSelectMode({
    // Add custom style for select mode
    styles: {
        // Point colour
        selectedPointColor: "#FF0000",
        selectedPointWidth: 7,
        selectedPointOutlineColor: "#FFFF00",
        selectedPointOutlineWidth: 2,
        // LineString colour
        selectedLineStringColor: "#FFFF00",
        selectedLineStringWidth: 4,
        // Polygon colour
        selectedPolygonColor: "#FF0000",
        selectedPolygonFillOpacity: 0.7,
        selectedPolygonOutlineColor: "#FFFF00",
        selectedPolygonOutlineWidth: 4,
        // Selection point colour
        selectionPointColor: "#FF0000",
        selectionPointWidth: 8,
        selectionPointOutlineColor: "#FFFF00",
        selectionPointOutlineWidth: 2,
        // Midpoint colour
        midPointColor: "#FF0000",
        midPointWidth: 6,
        midPointOutlineColor: "#FFFF00",
        midPointOutlineWidth: 2
    },
    flags: {
        // keep flags settings from previous exercise
    }
})
```

### Testing Your Implementation

1. **Check drawing style** - draw points, lines and polygons to ensure colours are changed
1. **Check the dashed line** - the linestring should be dashed and slightly transparent
1. **Check select mode style** - select a point, line and polygon to ensure the custom style is applied correctly

### Extra challenge

You can pass a styling *function* instead of a fixed value:

```ts
import { TerraDrawExtend } from 'terra-draw';

// Function to generate a random hex color - can adjust as needed
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Cache for each feature id mapped to a hex color string
let colorCache: Record<TerraDrawExtend.FeatureId, string> = {};

new TerraDrawPolygonMode({
    styles: {
        fillColor: ({ id }) => {
            // Get the color from the cache or generate a new one
            colorCache[id] = colorCache[id] || getRandomColor();
            return colorCache[id];
        },
    },
}),
```

The above example changes the fill color of each polygon randomly.

## What's Next?

Now that you understand custom styling, let's explore Terra Draw's event handling capabilities.

[Continue to Exercise 5](./exercise-5.md)
