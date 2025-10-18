# Understanding Drawing Modes

Terra Draw comes with several built-in modes. Let's explore the main ones and how to configure them.

## Basic Mode Configuration

### Point Mode
Creates individual point features:

```typescript
const pointMode = new TerraDrawPointMode({
    styles: {
        pointColor: '#3B82F6',
        pointWidth: 8,
        pointOutlineColor: '#FFFFFF',
        pointOutlineWidth: 2
    }
});
```

### LineString Mode
Creates line features:

```typescript
const lineMode = new TerraDrawLineStringMode({
    styles: {
        lineStringColor: '#EF4444',
        lineStringWidth: 3,
        closingPointColor: '#DC2626',
        closingPointWidth: 8
    }
});
```

### Polygon Mode
Creates polygon features:

```typescript
const polygonMode = new TerraDrawPolygonMode({
    styles: {
        fillColor: '#10B98140',
        outlineColor: '#10B981',
        outlineWidth: 3,
        closingPointColor: '#059669',
        closingPointWidth: 8
    }
});
```

### Select Mode
Allows selection and manipulation of existing features:

```typescript
const selectMode = new TerraDrawSelectMode({
    flags: {
        arbitary: {
            feature: {
                draggable: true,
                rotateable: true,
                scaleable: true,
                coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true
                }
            }
        }
    }
});
```

## Available Drawing Modes

According to the [official Terra Draw documentation](https://github.com/JamesLMilner/terra-draw/blob/main/guides/4.MODES.md), Terra Draw includes these modes:

- **TerraDrawPointMode** - Draw individual points
- **TerraDrawLineStringMode** - Draw lines with multiple vertices
- **TerraDrawPolygonMode** - Draw closed polygons
- **TerraDrawRectangleMode** - Draw rectangles 
- **TerraDrawCircleMode** - Draw circles
- **TerraDrawFreehandMode** - Draw freehand lines
- **TerraDrawSelectMode** - Select and edit existing features
- **TerraDrawRenderMode** - Display features without interaction

## Adding Rectangle Mode

Let's add the rectangle mode to our application:

```typescript
import { TerraDrawRectangleMode } from 'terra-draw';

// In your TerraDraw configuration, add:
modes: [
    new TerraDrawPointMode(),
    new TerraDrawLineStringMode(),
    new TerraDrawPolygonMode(),
    new TerraDrawRectangleMode(), // Add this
    new TerraDrawSelectMode()
]
```

Don't forget to add a button for rectangle mode in your HTML:

```html
<button id="rectangle-mode">Rectangle Mode</button>
```

## What's Next?

Now that you understand the different modes, let's explore how Terra Draw structures the geographic data.

**Next:** [Data Structure](data-structure.md)