# Terra Draw Basics

In this section, you'll learn Terra Draw's core concepts and create your first drawing application.

## Core Concepts

Terra Draw is built around several key concepts that make it powerful and flexible:

### 1. TerraDraw Instance
The main controller that manages all drawing operations and coordinates between different components.

### 2. Modes
Different drawing behaviors (point, line, polygon, etc.). Each mode handles specific user interactions and creates different types of geometric features.

### 3. Adapters
Bridge components between Terra Draw and specific mapping libraries. They handle the library-specific rendering and interaction logic.

### 4. Store
Manages the geographic data and drawing state. The store holds all features and provides methods to query and manipulate them.

## Your First Terra Draw Implementation

Let's create a basic Terra Draw setup with MapLibre GL JS. Update your `src/main.ts`:

```typescript
import './style.css'
import maplibregl from 'maplibre-gl';
import { TerraDraw } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
import { 
    TerraDrawPointMode,
    TerraDrawLineStringMode,
    TerraDrawPolygonMode,
    TerraDrawSelectMode
} from 'terra-draw';

// Initialize map
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [174.7645, -36.8485],
    zoom: 10
});

let draw: TerraDraw;

// Wait for map to load
map.on('load', () => {
    // Create Terra Draw instance
    draw = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map }),
        modes: [
            new TerraDrawPointMode(),
            new TerraDrawLineStringMode(),
            new TerraDrawPolygonMode(),
            new TerraDrawSelectMode()
        ]
    });

    // Start Terra Draw
    draw.start();

    // Set initial mode
    draw.setMode('point');

    // Button event listeners
    const pointBtn = document.getElementById('point-mode') as HTMLButtonElement;
    const lineBtn = document.getElementById('line-mode') as HTMLButtonElement;
    const polygonBtn = document.getElementById('polygon-mode') as HTMLButtonElement;
    const selectBtn = document.getElementById('select-mode') as HTMLButtonElement;
    const clearBtn = document.getElementById('clear') as HTMLButtonElement;

    pointBtn?.addEventListener('click', () => {
        draw.setMode('point');
        updateActiveButton('point-mode');
    });

    lineBtn?.addEventListener('click', () => {
        draw.setMode('linestring');
        updateActiveButton('line-mode');
    });

    polygonBtn?.addEventListener('click', () => {
        draw.setMode('polygon');
        updateActiveButton('polygon-mode');
    });

    selectBtn?.addEventListener('click', () => {
        draw.setMode('select');
        updateActiveButton('select-mode');
    });

    clearBtn?.addEventListener('click', () => {
        draw.clear();
    });

    // Set initial active button
    updateActiveButton('point-mode');
});

function updateActiveButton(activeId: string) {
    const buttons = document.querySelectorAll('.controls button');
    buttons.forEach(button => button.classList.remove('active'));
    document.getElementById(activeId)?.classList.add('active');
}
```

## Understanding Modes

Terra Draw comes with several built-in modes. Let's explore the main ones:

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

### Adding Rectangle Mode

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

## Exercise 1: Basic Drawing

**Objective**: Create a simple drawing application with multiple modes.

1. **Update your code** using the examples above
2. **Test each drawing mode**:
   - Draw some points around Auckland
   - Create a line connecting different locations
   - Draw a polygon representing a building or area
   - Try the rectangle mode for creating rectangular shapes
   - Use select mode to modify your drawings

3. **Observe the behavior**:
   - How do the different modes feel?
   - What visual feedback do you get?
   - How does selection and editing work?

## Accessing Drawing Data

Add this code to see the data structure and track changes:

```typescript
// Add after draw.start()
draw.on('change', () => {
    const snapshot = draw.getSnapshot();
    console.log('Current features:', snapshot);
    
    // Display feature count
    const featureCount = document.getElementById('feature-count');
    if (featureCount) {
        featureCount.textContent = `Features: ${snapshot.length}`;
    }
});
```

Add this HTML element to display the count:

```html
<div id="feature-count">Features: 0</div>
```

## Data Structure

Terra Draw uses GeoJSON format for all geographic data. Each feature has essential properties:

```javascript
// Example point feature
{
    type: "Feature",
    geometry: {
        type: "Point",
        coordinates: [174.7645, -36.8485]
    },
    properties: {
        mode: "point"  // Essential property indicating the Terra Draw mode
    }
}

// Example polygon feature
{
    type: "Feature",
    geometry: {
        type: "Polygon",
        coordinates: [[
            [174.7645, -36.8485],
            [174.7745, -36.8485],
            [174.7745, -36.8585],
            [174.7645, -36.8585],
            [174.7645, -36.8485]
        ]]
    },
    properties: {
        mode: "polygon"  // Essential mode property
    }
}
```

The `mode` property is essential for Terra Draw to understand which mode created each feature and how to handle it during editing.

## Exercise 2: Exploring Data

1. **Add the feature counter** to your application
2. **Draw various features** and watch the console output
3. **Examine the GeoJSON structure** of different feature types
4. **Try editing features** in select mode and see how the data changes

## What's Next?

Now that you understand Terra Draw basics, you're ready to explore advanced features like custom styling and event handling.

**Next:** [Advanced Features](advanced.md)