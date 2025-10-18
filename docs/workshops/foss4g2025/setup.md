# Environment Setup

Let's set up your development environment for the Terra Draw workshop using modern tooling.

## What is Terra Draw?

Terra Draw is a drawing library that provides a unified API for adding drawing functionality to web mapping applications. Unlike library-specific drawing tools, Terra Draw works consistently across different mapping platforms.

### Key Features

- **Cross-platform compatibility** - Works with 6+ major mapping libraries
- **Unified API** - Same code structure regardless of the underlying map
- **Extensive drawing modes** - Points, lines, polygons, rectangles, circles, and more
- **Customizable styling** - Full control over appearance and behavior
- **Event-driven architecture** - React to drawing events and user interactions
- **TypeScript support** - Built with TypeScript for better developer experience

### Supported Libraries

| Library | Version | Adapter Package |
|---------|---------|----------------|
| MapLibre GL JS | v4, v5 | `terra-draw-maplibre-gl-adapter` |
| Leaflet | v1 | `terra-draw-leaflet-adapter` |
| OpenLayers | v10 | `terra-draw-openlayers-adapter` |
| Mapbox GL JS | v3 | `terra-draw-mapbox-gl-adapter` |
| Google Maps | v3 | `terra-draw-google-maps-adapter` |
| ArcGIS JS API | v4 | `terra-draw-arcgis-adapter` |

## Project Setup with Vite

We'll use [Vite](https://vitejs.dev/) for our development environment as it provides excellent developer experience with fast builds and hot reload.

### 1. Create a New Vite Project

```bash
# Create a new Vite project with vanilla JavaScript and TypeScript
npm create vite@latest terra-draw-workshop -- --template vanilla-ts
cd terra-draw-workshop
npm install
```

### 2. Install Terra Draw Dependencies

```bash
# Core Terra Draw
npm install terra-draw

# Choose your mapping library (we'll use MapLibre for examples)
npm install maplibre-gl

# Install the corresponding adapter
npm install terra-draw-maplibre-gl-adapter

# Optional: For advanced examples
npm install maplibre-gl-terradraw
```

### 3. Update Project Structure

Your project structure should look like this:

```
terra-draw-workshop/
├── src/
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### 4. Basic HTML Setup

Update your `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terra Draw Workshop</title>
    <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
</head>
<body>
    <div id="app">
        <h1>Terra Draw Workshop</h1>
        <div class="controls">
            <button id="point-mode">Point Mode</button>
            <button id="line-mode">Line Mode</button>
            <button id="polygon-mode">Polygon Mode</button>
            <button id="select-mode">Select Mode</button>
            <button id="clear">Clear All</button>
        </div>
        <div id="map"></div>
    </div>
    <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

### 5. Update CSS Styles

Update your `src/style.css`:

```css
body {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
}

#app {
  max-width: 100%;
  text-align: center;
}

#map {
  width: 100%;
  height: 500px;
  border: 1px solid #ccc;
  margin: 20px 0;
}

.controls {
  margin: 20px 0;
}

.controls button {
  margin: 5px;
  padding: 10px 15px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.controls button:hover {
  background: #f0f0f0;
}

.controls button.active {
  background: #007bff;
  color: white;
}
```

### 6. Basic TypeScript Setup

Update your `src/main.ts` to test the setup:

```typescript
import './style.css'
import maplibregl from 'maplibre-gl';

// Initialize map
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [174.7645, -36.8485], // Auckland coordinates
    zoom: 10
});

map.on('load', () => {
    console.log('Map loaded successfully!');
    console.log('Ready to start Terra Draw workshop!');
});
```

### 7. Run the Development Server

```bash
# Start the Vite development server
npm run dev
```

Your development server should start at `http://localhost:5173` with hot reload enabled.

## Verify Your Setup

1. Open your browser and navigate to `http://localhost:5173`
2. You should see a map centered on Auckland
3. Open the browser console and verify you see the success messages
4. The controls should be visible but not functional yet (we'll implement them in the next section)

## What's Next?

With your environment properly set up using Vite and TypeScript, you're ready to start learning Terra Draw fundamentals. 

**Next:** [Terra Draw Basics](basics.md)