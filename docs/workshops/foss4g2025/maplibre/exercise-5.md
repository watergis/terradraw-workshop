# Exercise 5: Complete Application

**Objective**: Build a complete drawing application using maplibre-gl-terradraw.

## Step 1: Install maplibre-gl-terradraw

```bash
npm install maplibre-gl-terradraw
```

## Step 2: Create Complete Application

Replace your `src/main.ts` with:

```typescript
import './style.css'
import maplibregl from 'maplibre-gl';
import { MaplibreTerraDrawControl } from 'maplibre-gl-terradraw';

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [174.7645, -36.8485],
    zoom: 10
});

let drawControl: MaplibreTerraDrawControl;

map.on('load', () => {
    drawControl = new MaplibreTerraDrawControl({
        modes: ['point', 'linestring', 'polygon', 'rectangle', 'select'],
        open: true,
        displayControlsDefault: true
    });
    
    map.addControl(drawControl, 'top-left');
    
    // Add event listeners
    drawControl.on('draw.create', handleCreate);
    drawControl.on('draw.update', handleUpdate);
    drawControl.on('draw.delete', handleDelete);
});

function handleCreate(e: any) {
    console.log('Created:', e.features);
    updateCounter();
}

function handleUpdate(e: any) {
    console.log('Updated:', e.features);
}

function handleDelete(e: any) {
    console.log('Deleted:', e.features);
    updateCounter();
}

function updateCounter() {
    const features = drawControl.getAll();
    const counter = document.getElementById('feature-count');
    if (counter) {
        counter.textContent = `Features: ${features.features.length}`;
    }
}
```

## Step 3: Update HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terra Draw Complete App</title>
    <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
</head>
<body>
    <div id="app">
        <h1>Complete Terra Draw Application</h1>
        <div id="feature-count">Features: 0</div>
        <div id="map"></div>
    </div>
    <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

## Step 4: Test Your Application

1. **Use the built-in controls** in the top-left corner
2. **Draw different types of features**
3. **Edit features** using the select tool
4. **Watch the feature counter** update automatically

## Expected Results

You should have a complete drawing application with:
- Built-in UI controls
- All major drawing modes
- Feature editing capabilities
- Real-time feature counting

**Next:** [Multi-library Support](../multi-library.md)