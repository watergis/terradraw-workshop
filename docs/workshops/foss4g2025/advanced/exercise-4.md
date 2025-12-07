# Custom Styling

In this section, you'll learn about Terra Draw's advanced styling capabilities.

Terra Draw provides extensive styling capabilities for all drawing modes. Styling follows the patterns described in the [official styling guide](https://github.com/JamesLMilner/terra-draw/blob/main/guides/5.STYLING.md).

## Point style

The `TerraDrawPointMode` is styled using the following properties:

| Property            | Type      | Example Value | Description                    |
| ------------------- | --------- | ------------- | ------------------------------ |
| `pointColor`        | Hex Color | `#00FFFF`     | The fill color of the point    |
| `pointWidth`        | Integer   | `2`           | The width of the point         |
| `pointOutlineColor` | Hex Color | `#00FFFF`     | The outline color of the point |
| `pointOutlineWidth` | Integer   | `2`           | The outline width of the point |

## LineString style

The `TerraDrawLineStringMode` is styled using the following properties:

| Property                   | Type         | Example Value | Description                            |
| -------------------------- | ------------ | ------------- | -------------------------------------- |
| `lineStringColor`          | Hex Color    | `#00FFFF`     | The color of the linestring.           |
| `lineStringWidth`          | Number (0-1) | `0.7`         | The fill opacity of the polygon        |
| `closingPointColor`        | Hex Color    | `#00FFFF`     | The fill color of the closing point    |
| `closingPointWidth`        | Integer      | `1`           | The width of the closing point         |
| `closingPointOutlineColor` | Hex Color    | `#00FF00`     | The outline color of the closing point |
| `closingPointOutlineWidth` | Integer      | `2`           | The outline width of the closing point |

`TerraDrawFreehandLineStringMode` also has the same properties for styling.

## Polygon style

The `TerraDrawPolygonMode` is styled using the following properties:

| Property                   | Type         | Example Value | Description                            |
| -------------------------- | ------------ | ------------- | -------------------------------------- |
| `fillColor`                | Hex Color    | `#00FFFF`     | The fill color of the polygon          |
| `fillOpacity`              | Number (0-1) | `0.7`         | The fill opacity of the polygon        |
| `outlineColor`             | Hex Color    | `#00FFFF`     | The outline color of the polygon       |
| `outlineWidth`             | Integer      | `2`           | The outline width of the polygon       |
| `closingPointColor`        | Hex Color    | `#00FFFF`     | The fill color of the closing point    |
| `closingPointWidth`        | Integer      | `1`           | The width of the closing point         |
| `closingPointOutlineColor` | Hex Color    | `#00FF00`     | The outline color of the closing point |
| `closingPointOutlineWidth` | Integer      | `2`           | The outline width of the closing point |

Other polygon drawing modes such as `TerraDrawFreehandMode`, `TerraDrawCircleMode`, etc also follows same properties to customise style.

## Change colors

Use the last exercise 3's source code, we are going to add custom style for point, line and polygon mode.

Add styles option for `TerraDrawPointMode`, `TerraDrawLineStringMode` and `TerraDrawPolygonMode`.

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

This style setting will change point, line and polygon ourtline color to red.

![Change color to red for point, line and polygon mode](../assets/advanced/advanced-custom-style-1.png)

## Custom style for Select mode

However, styles when selecting features with `TerraDrawSelectMode` is still using default style.

Add `styles` property to your `TerraDrawSelectMode` like below.

```ts
draw = new TerraDraw({
    modes: [
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
    ]
})
```

This code will change point and polygon outline color for select mode.

![Change color for TerraDrawSelectMode](../assets/advanced/advanced-custom-style-2.png)

### Testing Your Implementation

1. **Save your changes** and the Vite development server should automatically reload
1. **Open your browser** to `http://localhost:5173`
1. **Check drawing style** - draw points, lines and polygons to ensure colours are changed.
1. **Check select mode style** - select point, line and polygon to ensure custom style is applied correctly
1. **Adjust parameters of select mode** - Try to change select mode parameters to change style to your own.

### Extra challenge

Furthermore, you can try to pass styling function instead of fixed value like below.

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

The above example is to change fill color of polygons randomly.

![Assigning random fill color for TerraDrawPolygonMode](../assets/advanced/advanced-custom-style-3.png)

### Example code

The above example code is available at [example/custom-style](https://github.com/watergis/terradraw-workshop-template/tree/example/custom-style) branch.

## What's Next?

Now that you understand custom styling, let's explore Terra Draw's event handling capabilities.
