# FOSS4G 2025 Auckland - Terra Draw Workshop

Welcome to the comprehensive Terra Draw workshop! This 3.5-hour hands-on session will teach you how to integrate advanced drawing features into your web mapping applications using Terra Draw's unified API.

## Workshop Overview

[Terra Draw](https://github.com/JamesLMilner/terra-draw) is a powerful, cross-platform drawing library that works with all major web mapping libraries including MapLibre, Leaflet, OpenLayers, Mapbox, Google Maps, and ArcGIS. This workshop will take you from basic concepts to advanced implementation.

### What You'll Learn

- Understanding Terra Draw's architecture and unified API
- Setting up Terra Draw with various mapping libraries
- Implementing basic and advanced drawing features
- Customizing styles, handling events, and managing data
- Using the maplibre-gl-terradraw plugin for seamless integration
- Best practices for production applications

### Prerequisites

To participate in this workshop, please ensure you have:

- **Node.js v22 LTS** installed ([download here](https://nodejs.org/))
- **VS Code** or your preferred code editor ([download here](https://code.visualstudio.com/))
- Basic knowledge of JavaScript and web development
- Familiarity with web mapping concepts (helpful but not required)

### Workshop Schedule (3.5 hours)

| Time | Duration | Section |
|------|----------|---------|
| 0:00-0:30 | 30 min | [Introduction & Setup](#introduction--setup) |
| 0:30-1:15 | 45 min | [Part 1: Terra Draw Basics](#part-1-terra-draw-basics) |
| 1:15-1:30 | 15 min | Break |
| 1:30-2:30 | 60 min | [Part 2: Advanced Features](#part-2-advanced-features) |
| 2:30-3:30 | 60 min | [Part 3: MapLibre Integration](#part-3-maplibre-integration) |
| 3:30-3:45 | 15 min | Break |
| 3:45-4:15 | 30 min | [Part 4: Multi-library Support](#part-4-multi-library-support) |

---

## Introduction & Setup

### What is Terra Draw?

Terra Draw is a drawing library that provides a unified API for adding drawing functionality to web mapping applications. Unlike library-specific drawing tools, Terra Draw works consistently across different mapping platforms.

#### Key Features

- **Cross-platform compatibility** - Works with 6+ major mapping libraries
- **Unified API** - Same code structure regardless of the underlying map
- **Extensive drawing modes** - Points, lines, polygons, rectangles, circles, and more
- **Customizable styling** - Full control over appearance and behavior
- **Event-driven architecture** - React to drawing events and user interactions
- **TypeScript support** - Built with TypeScript for better developer experience

#### Supported Libraries

| Library | Version | Adapter Package |
|---------|---------|----------------|
| MapLibre GL JS | v4, v5 | `terra-draw-maplibre-gl-adapter` |
| Leaflet | v1 | `terra-draw-leaflet-adapter` |
| OpenLayers | v10 | `terra-draw-openlayers-adapter` |
| Mapbox GL JS | v3 | `terra-draw-mapbox-gl-adapter` |
| Google Maps | v3 | `terra-draw-google-maps-adapter` |
| ArcGIS JS API | v4 | `terra-draw-arcgis-adapter` |

### Environment Setup

Let's set up your development environment for the workshop.

#### 1. Create a New Project

```bash
mkdir terra-draw-workshop
cd terra-draw-workshop
npm init -y
```

#### 2. Install Dependencies

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

#### 3. Basic HTML Setup

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terra Draw Workshop</title>
    <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        #map { width: 100%; height: 500px; border: 1px solid #ccc; }
        .controls { margin: 20px 0; }
        button { margin: 5px; padding: 10px 15px; }
    </style>
</head>
<body>
    <h1>Terra Draw Workshop</h1>
    <div class="controls">
        <button id="point-mode">Point Mode</button>
        <button id="line-mode">Line Mode</button>
        <button id="polygon-mode">Polygon Mode</button>
        <button id="select-mode">Select Mode</button>
        <button id="clear">Clear All</button>
    </div>
    <div id="map"></div>
    <script type="module" src="main.js"></script>
</body>
</html>
```

#### 4. Verify Setup

Create a simple `main.js` to test your setup:

```javascript
import maplibregl from 'maplibre-gl';

// Initialize map
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [174.7645, -36.8485], // Auckland coordinates
    zoom: 10
});

console.log('Setup complete!');
```

#### 5. Run a Local Server

```bash
# Using Node.js built-in server (Node.js 18+)
npx serve .

# Or using Python
python -m http.server 8000

# Or using VS Code Live Server extension
```

---

## Part 1: Terra Draw Basics

### Core Concepts

Terra Draw is built around several key concepts that make it powerful and flexible:

#### 1. TerraDraw Instance
The main controller that manages all drawing operations.

#### 2. Modes
Different drawing behaviors (point, line, polygon, etc.).

#### 3. Adapters
Bridge between Terra Draw and specific mapping libraries.

#### 4. Store
Manages the geographic data and drawing state.

### Your First Terra Draw Implementation

Let's create a basic Terra Draw setup with MapLibre GL JS:

```javascript
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

// Wait for map to load
map.on('load', () => {
    // Create Terra Draw instance
    const draw = new TerraDraw({
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
    document.getElementById('point-mode').addEventListener('click', () => {
        draw.setMode('point');
    });

    document.getElementById('line-mode').addEventListener('click', () => {
        draw.setMode('linestring');
    });

    document.getElementById('polygon-mode').addEventListener('click', () => {
        draw.setMode('polygon');
    });

    document.getElementById('select-mode').addEventListener('click', () => {
        draw.setMode('select');
    });

    document.getElementById('clear').addEventListener('click', () => {
        draw.clear();
    });
});
```

### Understanding Modes

Each mode provides different drawing capabilities:

#### Point Mode
Creates individual point features:

```javascript
const pointMode = new TerraDrawPointMode({
    styles: {
        pointColor: '#3B82F6',
        pointWidth: 8,
        pointOutlineColor: '#FFFFFF',
        pointOutlineWidth: 2
    }
});
```

#### LineString Mode
Creates line features:

```javascript
const lineMode = new TerraDrawLineStringMode({
    styles: {
        lineStringColor: '#EF4444',
        lineStringWidth: 3,
        closingPointColor: '#DC2626',
        closingPointWidth: 8
    }
});
```

#### Polygon Mode
Creates polygon features:

```javascript
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

#### Select Mode
Allows selection and manipulation of existing features:

```javascript
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

### Exercise 1: Basic Drawing

**Objective**: Create a simple drawing application with multiple modes.

1. **Setup the project** using the code above
2. **Test each drawing mode**:
   - Draw some points around Auckland
   - Create a line connecting the points
   - Draw a polygon representing a building or area
   - Use select mode to modify your drawings

3. **Observe the behavior**:
   - How do the different modes feel?
   - What visual feedback do you get?
   - How does selection and editing work?

### Exercise 2: Accessing Drawing Data

Add this code to see the data structure:

```javascript
// Add after draw.start()
draw.on('change', () => {
    const snapshot = draw.getSnapshot();
    console.log('Current features:', snapshot);
    
    // Display feature count
    document.getElementById('feature-count').textContent = 
        `Features: ${snapshot.length}`;
});

// Add this HTML element to display the count
// <div id="feature-count">Features: 0</div>
```

### Data Structure

Terra Draw uses GeoJSON format for all geographic data:

```javascript
// Example point feature
{
    type: "Feature",
    geometry: {
        type: "Point",
        coordinates: [174.7645, -36.8485]
    },
    properties: {
        mode: "point",
        createdAt: 1698765432000,
        updatedAt: 1698765432000
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
        mode: "polygon",
        createdAt: 1698765432000,
        updatedAt: 1698765432000
    }
}
```

---

## Part 2: Advanced Features

### Custom Styling

Terra Draw provides extensive styling capabilities for all drawing modes.

#### Dynamic Styling

You can style features based on their properties or state:

```javascript
const polygonMode = new TerraDrawPolygonMode({
    styles: {
        fillColor: (feature, state) => {
            // Style based on feature properties
            if (feature.properties.type === 'building') {
                return '#8B5CF680';
            }
            // Style based on interaction state
            if (state === 'selected') {
                return '#F59E0B80';
            }
            return '#10B98140';
        },
        outlineColor: (feature, state) => {
            return state === 'selected' ? '#F59E0B' : '#10B981';
        },
        outlineWidth: 3
    }
});
```

#### State-based Styling

Features can be styled differently based on their interaction state:

- `static` - Default state
- `selected` - When feature is selected
- `midpoint` - For coordinate editing handles
- `closing` - For the closing point of polygons/lines

### Event Handling

Terra Draw provides comprehensive event handling for user interactions:

```javascript
// Listen for drawing events
draw.on('draw', (event) => {
    console.log('Feature drawn:', event);
    // event contains the feature data and mode information
});

draw.on('change', (event) => {
    console.log('Drawing state changed:', event);
    // Triggered on any change (draw, edit, delete)
});

draw.on('select', (event) => {
    console.log('Feature selected:', event);
    // Contains the selected feature(s)
});

draw.on('deselect', (event) => {
    console.log('Feature deselected:', event);
});

// Mode-specific events
draw.on('mode', (event) => {
    console.log('Mode changed to:', event.mode);
});
```

### Data Management

#### Programmatic Feature Creation

You can add features programmatically:

```javascript
// Add a point
draw.addFeatures([
    {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [174.7645, -36.8485]
        },
        properties: {}
    }
]);

// Add multiple features
const features = [
    {
        type: "Feature",
        geometry: {
            type: "LineString", 
            coordinates: [
                [174.7545, -36.8485],
                [174.7645, -36.8485],
                [174.7745, -36.8585]
            ]
        },
        properties: { name: "Route 1" }
    }
];

draw.addFeatures(features);
```

#### Feature Management

```javascript
// Get all features
const allFeatures = draw.getSnapshot();

// Get selected features
const selectedFeatures = draw.getSelectedFeatureIds();

// Remove features by ID
draw.removeFeatures(['feature-id-1', 'feature-id-2']);

// Clear everything
draw.clear();

// Get features by mode
const points = allFeatures.filter(f => f.properties.mode === 'point');
```

### Custom Modes

You can create custom drawing modes for specific use cases:

```javascript
import { TerraDrawBaseDrawMode } from 'terra-draw';

class TerraDrawRectangleMode extends TerraDrawBaseDrawMode {
    constructor(options = {}) {
        super(options);
        this.mode = 'rectangle';
    }

    start() {
        this.setStarted();
    }

    stop() {
        this.setStopped();
    }

    onClick(event) {
        if (this.startCoordinate === null) {
            // First click - set start point
            this.startCoordinate = [event.lng, event.lat];
        } else {
            // Second click - create rectangle
            this.createRectangle(event);
            this.startCoordinate = null;
        }
    }

    createRectangle(event) {
        const [startLng, startLat] = this.startCoordinate;
        const endLng = event.lng;
        const endLat = event.lat;

        const rectangleCoords = [
            [startLng, startLat],
            [endLng, startLat],
            [endLng, endLat],
            [startLng, endLat],
            [startLng, startLat]
        ];

        const feature = {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [rectangleCoords]
            },
            properties: {
                mode: this.mode,
                createdAt: Date.now()
            }
        };

        this.addFeature(feature);
    }
}

// Use the custom mode
const draw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map }),
    modes: [
        new TerraDrawRectangleMode(),
        new TerraDrawSelectMode()
    ]
});
```

### Exercise 3: Advanced Styling

Create a drawing application with custom styling:

```javascript
// Create a property-based styling system
const polygonMode = new TerraDrawPolygonMode({
    styles: {
        fillColor: (feature) => {
            const type = feature.properties.type || 'default';
            const colors = {
                'building': '#8B5CF680',
                'park': '#10B98140',
                'water': '#3B82F680',
                'default': '#6B7280 40'
            };
            return colors[type];
        },
        outlineColor: (feature) => {
            const type = feature.properties.type || 'default';
            const colors = {
                'building': '#8B5CF6',
                'park': '#10B981', 
                'water': '#3B82F6',
                'default': '#6B7280'
            };
            return colors[type];
        }
    }
});

// Add UI for setting feature types
draw.on('draw', (event) => {
    const type = prompt('Feature type (building/park/water):');
    if (type) {
        // Update the feature properties
        const features = draw.getSnapshot();
        const newFeature = features[features.length - 1];
        newFeature.properties.type = type;
        
        // Refresh the feature to apply new styling
        draw.removeFeatures([newFeature.id]);
        draw.addFeatures([newFeature]);
    }
});
```

### Exercise 4: Event-Driven Application

Build an application that responds to drawing events:

```javascript
// Feature statistics tracker
let stats = {
    points: 0,
    lines: 0,
    polygons: 0,
    totalArea: 0,
    totalLength: 0
};

function updateStats() {
    const features = draw.getSnapshot();
    
    stats = {
        points: features.filter(f => f.geometry.type === 'Point').length,
        lines: features.filter(f => f.geometry.type === 'LineString').length,
        polygons: features.filter(f => f.geometry.type === 'Polygon').length,
        totalArea: calculateTotalArea(features),
        totalLength: calculateTotalLength(features)
    };
    
    displayStats();
}

function calculateTotalArea(features) {
    // Implement area calculation using turf.js or similar
    return features
        .filter(f => f.geometry.type === 'Polygon')
        .reduce((total, feature) => {
            // Basic area calculation (you might want to use turf.area for precision)
            return total + Math.abs(feature.geometry.coordinates[0].reduce((sum, coord, i, arr) => {
                const next = arr[(i + 1) % arr.length];
                return sum + (coord[0] * next[1] - next[0] * coord[1]);
            }, 0)) / 2;
        }, 0);
}

draw.on('change', updateStats);
```

---

## Part 3: MapLibre Integration

### Using maplibre-gl-terradraw

The `maplibre-gl-terradraw` plugin provides enhanced integration with MapLibre GL JS:

```bash
npm install maplibre-gl-terradraw
```

#### Basic Setup

```javascript
import maplibregl from 'maplibre-gl';
import MaplibreTerradraw from 'maplibre-gl-terradraw';

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [174.7645, -36.8485],
    zoom: 10
});

map.on('load', () => {
    // Add Terra Draw as a control
    const terradraw = new MaplibreTerradraw({
        modes: ['point', 'linestring', 'polygon', 'select'],
        styling: {
            point: {
                color: '#3B82F6',
                size: 8,
                outlineColor: '#FFFFFF',
                outlineWidth: 2
            },
            linestring: {
                color: '#EF4444',
                width: 3
            },
            polygon: {
                fillColor: '#10B98140',
                outlineColor: '#10B981',
                outlineWidth: 2
            }
        }
    });

    map.addControl(terradraw, 'top-left');

    // Access the underlying Terra Draw instance
    terradraw.on('draw', (event) => {
        console.log('Feature drawn:', event);
    });
});
```

#### Advanced Configuration

```javascript
const terradraw = new MaplibreTerradraw({
    modes: {
        point: {
            validation: (feature) => {
                // Custom validation logic
                return feature.geometry.coordinates[1] > -37; // Only north of this latitude
            }
        },
        polygon: {
            minPoints: 4, // Minimum points for polygon
            maxPoints: 20, // Maximum points for polygon
            allowSelfIntersection: false
        }
    },
    styling: {
        point: {
            color: (feature, state) => {
                if (state === 'selected') return '#F59E0B';
                return feature.properties.urgent ? '#EF4444' : '#3B82F6';
            },
            size: 10
        }
    },
    controls: {
        point: true,
        linestring: true,
        polygon: true,
        rectangle: true,
        circle: true,
        select: true,
        clear: true
    }
});
```

### Production Best Practices

#### 1. Error Handling

```javascript
try {
    const draw = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map }),
        modes: [
            new TerraDrawPointMode(),
            new TerraDrawPolygonMode({
                validation: (feature, { updateType }) => {
                    if (updateType === 'finish') {
                        // Validate completed polygon
                        const coords = feature.geometry.coordinates[0];
                        if (coords.length < 4) {
                            throw new Error('Polygon must have at least 3 points');
                        }
                    }
                    return true;
                }
            })
        ]
    });
    
    draw.start();
} catch (error) {
    console.error('Terra Draw initialization failed:', error);
    // Show user-friendly error message
}
```

#### 2. Performance Optimization

```javascript
// Optimize for large datasets
const draw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ 
        map,
        coordinatePrecision: 6 // Reduce coordinate precision for better performance
    }),
    modes: [
        new TerraDrawPolygonMode({
            pointerDistance: 10, // Minimum distance between points
            simplify: true // Simplify geometry during drawing
        })
    ]
});

// Debounce change events for better performance
let changeTimeout;
draw.on('change', () => {
    clearTimeout(changeTimeout);
    changeTimeout = setTimeout(() => {
        // Process changes
        updateUI();
    }, 100);
});
```

#### 3. Data Persistence

```javascript
// Save drawing data
function saveDrawing() {
    const features = draw.getSnapshot();
    const drawingData = {
        features,
        timestamp: Date.now(),
        version: '1.0'
    };
    
    localStorage.setItem('terra-draw-data', JSON.stringify(drawingData));
    // Or send to server
    // fetch('/api/drawings', { method: 'POST', body: JSON.stringify(drawingData) });
}

// Load drawing data
function loadDrawing() {
    const saved = localStorage.getItem('terra-draw-data');
    if (saved) {
        const drawingData = JSON.parse(saved);
        draw.addFeatures(drawingData.features);
    }
}

// Auto-save on changes
draw.on('change', debounce(saveDrawing, 1000));
```

#### 4. State Management Integration

```javascript
// Redux/Zustand integration example
const drawingSlice = {
    name: 'drawing',
    initialState: {
        features: [],
        selectedFeatures: [],
        currentMode: 'select'
    },
    reducers: {
        setFeatures: (state, action) => {
            state.features = action.payload;
        },
        setSelectedFeatures: (state, action) => {
            state.selectedFeatures = action.payload;
        },
        setMode: (state, action) => {
            state.currentMode = action.payload;
        }
    }
};

// Connect Terra Draw to state management
draw.on('change', () => {
    store.dispatch(drawingSlice.actions.setFeatures(draw.getSnapshot()));
});

draw.on('select', (event) => {
    store.dispatch(drawingSlice.actions.setSelectedFeatures(event.selectedFeatures));
});
```

### Exercise 5: Complete MapLibre Application

Build a production-ready drawing application:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Terra Draw - Complete Application</title>
    <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
    <style>
        .app-container {
            display: flex;
            height: 100vh;
            font-family: Arial, sans-serif;
        }
        
        .sidebar {
            width: 300px;
            background: #f8f9fa;
            padding: 20px;
            overflow-y: auto;
        }
        
        .map-container {
            flex: 1;
            position: relative;
        }
        
        #map {
            width: 100%;
            height: 100%;
        }
        
        .toolbar {
            position: absolute;
            top: 10px;
            left: 10px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .toolbar button {
            display: block;
            width: 40px;
            height: 40px;
            border: none;
            background: none;
            cursor: pointer;
            border-bottom: 1px solid #eee;
        }
        
        .toolbar button:hover {
            background: #f0f0f0;
        }
        
        .toolbar button.active {
            background: #007bff;
            color: white;
        }
        
        .feature-list {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-top: 10px;
        }
        
        .feature-item {
            padding: 10px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
        }
        
        .feature-item:hover {
            background: #f0f0f0;
        }
        
        .feature-item.selected {
            background: #007bff;
            color: white;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <div class="sidebar">
            <h3>Drawing Tools</h3>
            
            <div class="stats">
                <h4>Statistics</h4>
                <div id="stats-content">
                    <div>Points: <span id="point-count">0</span></div>
                    <div>Lines: <span id="line-count">0</span></div>
                    <div>Polygons: <span id="polygon-count">0</span></div>
                </div>
            </div>
            
            <div class="features">
                <h4>Features</h4>
                <div id="feature-list" class="feature-list"></div>
            </div>
            
            <div class="actions">
                <h4>Actions</h4>
                <button onclick="exportGeoJSON()">Export GeoJSON</button>
                <button onclick="clearAll()">Clear All</button>
                <input type="file" id="import-file" accept=".json,.geojson" onchange="importGeoJSON(event)">
                <button onclick="document.getElementById('import-file').click()">Import GeoJSON</button>
            </div>
        </div>
        
        <div class="map-container">
            <div id="map"></div>
            <div class="toolbar">
                <button id="select-btn" title="Select">🔍</button>
                <button id="point-btn" title="Point">📍</button>
                <button id="line-btn" title="Line">📏</button>
                <button id="polygon-btn" title="Polygon">⬛</button>
                <button id="rectangle-btn" title="Rectangle">◻️</button>
            </div>
        </div>
    </div>

    <script type="module">
        import maplibregl from 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js';
        import { TerraDraw } from 'https://unpkg.com/terra-draw@0.0.1-alpha.48/dist/terra-draw.umd.js';
        import { TerraDrawMapLibreGLAdapter } from 'https://unpkg.com/terra-draw-maplibre-gl-adapter@0.0.1-alpha.48/dist/terra-draw-maplibre-gl-adapter.umd.js';

        // Initialize map
        const map = new maplibregl.Map({
            container: 'map',
            style: 'https://demotiles.maplibre.org/style.json',
            center: [174.7645, -36.8485],
            zoom: 10
        });

        let draw;
        let currentMode = 'select';

        map.on('load', () => {
            // Initialize Terra Draw
            draw = new TerraDraw({
                adapter: new TerraDrawMapLibreGLAdapter({ map }),
                modes: [
                    new TerraDraw.TerraDrawSelectMode(),
                    new TerraDraw.TerraDrawPointMode(),
                    new TerraDraw.TerraDrawLineStringMode(),
                    new TerraDraw.TerraDrawPolygonMode(),
                    new TerraDraw.TerraDrawRectangleMode()
                ]
            });

            draw.start();
            draw.setMode('select');

            // Event listeners
            draw.on('change', updateUI);
            draw.on('select', updateSelection);

            // Toolbar events
            document.getElementById('select-btn').addEventListener('click', () => setMode('select'));
            document.getElementById('point-btn').addEventListener('click', () => setMode('point'));
            document.getElementById('line-btn').addEventListener('click', () => setMode('linestring'));
            document.getElementById('polygon-btn').addEventListener('click', () => setMode('polygon'));
            document.getElementById('rectangle-btn').addEventListener('click', () => setMode('rectangle'));

            updateUI();
        });

        function setMode(mode) {
            currentMode = mode;
            draw.setMode(mode);
            
            // Update button states
            document.querySelectorAll('.toolbar button').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`${mode === 'linestring' ? 'line' : mode}-btn`).classList.add('active');
        }

        function updateUI() {
            const features = draw.getSnapshot();
            
            // Update statistics
            const stats = {
                points: features.filter(f => f.geometry.type === 'Point').length,
                lines: features.filter(f => f.geometry.type === 'LineString').length,
                polygons: features.filter(f => f.geometry.type === 'Polygon').length
            };
            
            document.getElementById('point-count').textContent = stats.points;
            document.getElementById('line-count').textContent = stats.lines;
            document.getElementById('polygon-count').textContent = stats.polygons;
            
            // Update feature list
            updateFeatureList(features);
        }

        function updateFeatureList(features) {
            const list = document.getElementById('feature-list');
            list.innerHTML = '';
            
            features.forEach((feature, index) => {
                const item = document.createElement('div');
                item.className = 'feature-item';
                item.innerHTML = `
                    <div><strong>${feature.geometry.type}</strong></div>
                    <div>ID: ${feature.id || index}</div>
                `;
                
                item.addEventListener('click', () => {
                    draw.setMode('select');
                    draw.selectFeature(feature.id);
                });
                
                list.appendChild(item);
            });
        }

        function updateSelection(event) {
            // Update visual selection in feature list
            document.querySelectorAll('.feature-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            if (event.selectedFeatures.length > 0) {
                // Highlight selected features in list
                // Implementation depends on your feature ID strategy
            }
        }

        // Export/Import functionality
        window.exportGeoJSON = function() {
            const features = draw.getSnapshot();
            const geojson = {
                type: 'FeatureCollection',
                features: features
            };
            
            const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'terra-draw-export.geojson';
            a.click();
            URL.revokeObjectURL(url);
        };

        window.importGeoJSON = function(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const geojson = JSON.parse(e.target.result);
                    if (geojson.type === 'FeatureCollection') {
                        draw.addFeatures(geojson.features);
                    } else if (geojson.type === 'Feature') {
                        draw.addFeatures([geojson]);
                    }
                    updateUI();
                } catch (error) {
                    alert('Error importing GeoJSON: ' + error.message);
                }
            };
            reader.readAsText(file);
        };

        window.clearAll = function() {
            if (confirm('Are you sure you want to clear all features?')) {
                draw.clear();
                updateUI();
            }
        };
    </script>
</body>
</html>
```

---

## Part 4: Multi-library Support

### Adapter Pattern

Terra Draw's adapter pattern allows the same drawing code to work across different mapping libraries:

#### Leaflet Example

```javascript
import L from 'leaflet';
import { TerraDraw } from 'terra-draw';
import { TerraDrawLeafletAdapter } from 'terra-draw-leaflet-adapter';

// Create Leaflet map
const map = L.map('map').setView([-36.8485, 174.7645], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Same Terra Draw setup!
const draw = new TerraDraw({
    adapter: new TerraDrawLeafletAdapter({ map }),
    modes: [
        new TerraDrawPointMode(),
        new TerraDrawPolygonMode()
    ]
});

draw.start();
```

#### OpenLayers Example

```javascript
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { TerraDraw } from 'terra-draw';
import { TerraDrawOpenLayersAdapter } from 'terra-draw-openlayers-adapter';

// Create OpenLayers map
const map = new Map({
    target: 'map',
    layers: [new TileLayer({ source: new OSM() })],
    view: new View({
        center: [19441000, -4393000], // Web Mercator coordinates for Auckland
        zoom: 10
    })
});

// Same Terra Draw setup!
const draw = new TerraDraw({
    adapter: new TerraDrawOpenLayersAdapter({ map }),
    modes: [
        new TerraDrawPointMode(),
        new TerraDrawPolygonMode()
    ]
});

draw.start();
```

### Universal Drawing Component

You can create a universal component that works with any supported mapping library:

```javascript
class UniversalDrawingTool {
    constructor(mapInstance, mapType, options = {}) {
        this.mapInstance = mapInstance;
        this.mapType = mapType;
        this.options = options;
        this.draw = null;
        
        this.initializeTerraDrawByLibrary();
    }
    
    initializeTerraDrawByLibrary() {
        let adapter;
        
        switch (this.mapType) {
            case 'maplibre':
                adapter = new TerraDrawMapLibreGLAdapter({ map: this.mapInstance });
                break;
            case 'leaflet':
                adapter = new TerraDrawLeafletAdapter({ map: this.mapInstance });
                break;
            case 'openlayers':
                adapter = new TerraDrawOpenLayersAdapter({ map: this.mapInstance });
                break;
            case 'mapbox':
                adapter = new TerraDrawMapboxGLAdapter({ map: this.mapInstance });
                break;
            case 'google':
                adapter = new TerraDrawGoogleMapsAdapter({ map: this.mapInstance });
                break;
            case 'arcgis':
                adapter = new TerraDrawArcGISAdapter({ map: this.mapInstance });
                break;
            default:
                throw new Error(`Unsupported map type: ${this.mapType}`);
        }
        
        this.draw = new TerraDraw({
            adapter,
            modes: [
                new TerraDrawSelectMode(),
                new TerraDrawPointMode(this.options.pointMode || {}),
                new TerraDrawLineStringMode(this.options.lineMode || {}),
                new TerraDrawPolygonMode(this.options.polygonMode || {})
            ]
        });
        
        this.draw.start();
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        this.draw.on('change', (event) => {
            this.onFeatureChange?.(event);
        });
        
        this.draw.on('draw', (event) => {
            this.onFeatureDraw?.(event);
        });
    }
    
    setMode(mode) {
        this.draw.setMode(mode);
    }
    
    getFeatures() {
        return this.draw.getSnapshot();
    }
    
    addFeatures(features) {
        this.draw.addFeatures(features);
    }
    
    clear() {
        this.draw.clear();
    }
}

// Usage with different libraries
// MapLibre
const maplibreDrawing = new UniversalDrawingTool(maplibreMap, 'maplibre');

// Leaflet  
const leafletDrawing = new UniversalDrawingTool(leafletMap, 'leaflet');

// OpenLayers
const olDrawing = new UniversalDrawingTool(olMap, 'openlayers');
```

### Migration Between Libraries

If you need to switch from one mapping library to another, Terra Draw makes it easy:

```javascript
// Original MapLibre implementation
const maplibreDraw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map: maplibreMap }),
    modes: [new TerraDrawPolygonMode()]
});

// Save your drawing data
const features = maplibreDraw.getSnapshot();

// Switch to Leaflet
const leafletDraw = new TerraDraw({
    adapter: new TerraDrawLeafletAdapter({ map: leafletMap }),
    modes: [new TerraDrawPolygonMode()] // Same mode configuration
});

// Restore your drawing data
leafletDraw.addFeatures(features);
```

### Library-Specific Considerations

#### Performance Characteristics

| Library | Best For | Performance Notes |
|---------|----------|-------------------|
| MapLibre GL JS | Vector tiles, WebGL rendering | Best for large datasets, smooth animations |
| Leaflet | Simple implementations, raster tiles | Lightweight, good for basic use cases |
| OpenLayers | Complex GIS applications | Most features, but can be heavy |
| Mapbox GL JS | Commercial applications | Similar to MapLibre, commercial license |
| Google Maps | Consumer applications | Easy integration, usage limits |
| ArcGIS | Enterprise GIS | Comprehensive GIS features |

#### Styling Differences

Some styling options may behave differently across libraries:

```javascript
// Universal styling that works across libraries
const universalStyles = {
    fillColor: '#10B98140',
    outlineColor: '#10B981',
    outlineWidth: 2,
    pointColor: '#3B82F6',
    pointWidth: 8
};

// Library-specific optimizations
const getOptimizedStyles = (mapType) => {
    const base = { ...universalStyles };
    
    switch (mapType) {
        case 'leaflet':
            // Leaflet prefers certain color formats
            return {
                ...base,
                fillColor: 'rgba(16, 185, 129, 0.25)',
                outlineColor: 'rgb(16, 185, 129)'
            };
        case 'openlayers':
            // OpenLayers uses different property names
            return {
                ...base,
                fill: base.fillColor,
                stroke: base.outlineColor,
                strokeWidth: base.outlineWidth
            };
        default:
            return base;
    }
};
```

### Exercise 6: Multi-Library Comparison

Create a side-by-side comparison of Terra Draw with different mapping libraries:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Terra Draw - Multi-Library Comparison</title>
    <style>
        .comparison-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            height: 100vh;
            padding: 20px;
        }
        
        .map-section {
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .map-header {
            background: #f8f9fa;
            padding: 10px;
            font-weight: bold;
            text-align: center;
        }
        
        .map-container {
            height: calc(100% - 50px);
            position: relative;
        }
        
        .map {
            width: 100%;
            height: 100%;
        }
        
        .controls {
            position: absolute;
            top: 10px;
            left: 10px;
            background: white;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .controls button {
            margin: 2px;
            padding: 5px 10px;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
        }
        
        .controls button.active {
            background: #007bff;
            color: white;
        }
    </style>
    <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
    <link href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" rel="stylesheet">
</head>
<body>
    <div class="comparison-container">
        <div class="map-section">
            <div class="map-header">MapLibre GL JS + Terra Draw</div>
            <div class="map-container">
                <div id="maplibre-map" class="map"></div>
                <div class="controls">
                    <button onclick="setMapLibreMode('select')">Select</button>
                    <button onclick="setMapLibreMode('point')">Point</button>
                    <button onclick="setMapLibreMode('linestring')">Line</button>
                    <button onclick="setMapLibreMode('polygon')">Polygon</button>
                    <button onclick="clearMapLibre()">Clear</button>
                </div>
            </div>
        </div>
        
        <div class="map-section">
            <div class="map-header">Leaflet + Terra Draw</div>
            <div class="map-container">
                <div id="leaflet-map" class="map"></div>
                <div class="controls">
                    <button onclick="setLeafletMode('select')">Select</button>
                    <button onclick="setLeafletMode('point')">Point</button>
                    <button onclick="setLeafletMode('linestring')">Line</button>
                    <button onclick="setLeafletMode('polygon')">Polygon</button>
                    <button onclick="clearLeaflet()">Clear</button>
                </div>
            </div>
        </div>
    </div>

    <script type="module">
        import maplibregl from 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js';
        import L from 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js';
        // Note: In a real application, you'd import Terra Draw adapters properly

        // Auckland coordinates
        const aucklandCoords = [174.7645, -36.8485];
        
        // MapLibre setup
        const maplibreMap = new maplibregl.Map({
            container: 'maplibre-map',
            style: 'https://demotiles.maplibre.org/style.json',
            center: aucklandCoords,
            zoom: 10
        });

        // Leaflet setup
        const leafletMap = L.map('leaflet-map').setView([-36.8485, 174.7645], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(leafletMap);

        let maplibreDraw, leafletDraw;

        // Initialize Terra Draw for both maps when they're ready
        maplibreMap.on('load', () => {
            // Initialize MapLibre Terra Draw
            // maplibreDraw = new TerraDraw({ ... });
            console.log('MapLibre Terra Draw initialized');
        });

        // Leaflet is ready immediately
        // leafletDraw = new TerraDraw({ ... });
        console.log('Leaflet Terra Draw initialized');

        // Global functions for controls
        window.setMapLibreMode = (mode) => {
            // maplibreDraw.setMode(mode);
            console.log('MapLibre mode:', mode);
        };

        window.setLeafletMode = (mode) => {
            // leafletDraw.setMode(mode);
            console.log('Leaflet mode:', mode);
        };

        window.clearMapLibre = () => {
            // maplibreDraw.clear();
            console.log('MapLibre cleared');
        };

        window.clearLeaflet = () => {
            // leafletDraw.clear();
            console.log('Leaflet cleared');
        };
    </script>
</body>
</html>
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Import/Module Issues

**Problem**: Terra Draw modules not importing correctly

**Solution**:
```javascript
// ESM imports
import { TerraDraw } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

// UMD/Browser imports
<script src="https://unpkg.com/terra-draw@latest/dist/terra-draw.umd.js"></script>
<script src="https://unpkg.com/terra-draw-maplibre-gl-adapter@latest/dist/terra-draw-maplibre-gl-adapter.umd.js"></script>
```

#### 2. Map Not Showing Drawings

**Problem**: Features drawn but not visible on map

**Solutions**:
```javascript
// Ensure map is loaded before initializing Terra Draw
map.on('load', () => {
    const draw = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map })
        // ...
    });
    draw.start(); // Don't forget to start!
});

// Check if adapter is correctly configured
console.log('Adapter initialized:', draw.adapter.getId());
```

#### 3. Styling Not Applied

**Problem**: Custom styles not appearing

**Solution**:
```javascript
// Ensure styles are in correct format
const mode = new TerraDrawPolygonMode({
    styles: {
        fillColor: '#FF0000', // Hex format
        // Not: fillColor: 'red' (named colors may not work)
    }
});
```

#### 4. Events Not Firing

**Problem**: Event listeners not triggering

**Solution**:
```javascript
// Add event listeners after draw.start()
draw.start();
draw.on('draw', (event) => {
    // This will now work
});

// Check event names are correct
// ✓ 'draw', 'change', 'select', 'deselect'
// ✗ 'drawn', 'changed', 'selected'
```

#### 5. Performance Issues

**Problem**: Slow performance with many features

**Solutions**:
```javascript
// Use coordinate precision
const adapter = new TerraDrawMapLibreGLAdapter({ 
    map,
    coordinatePrecision: 6 
});

// Debounce change events
let timeout;
draw.on('change', () => {
    clearTimeout(timeout);
    timeout = setTimeout(updateUI, 100);
});

// Clear unused features periodically
if (features.length > 1000) {
    const oldFeatures = features.slice(0, -500);
    draw.removeFeatures(oldFeatures.map(f => f.id));
}
```

### Getting Help

- **Documentation**: [terradraw.io](https://terradraw.io/)
- **GitHub Issues**: [github.com/JamesLMilner/terra-draw/issues](https://github.com/JamesLMilner/terra-draw/issues)
- **Examples**: [github.com/JamesLMilner/terra-draw/tree/main/examples](https://github.com/JamesLMilner/terra-draw/tree/main/examples)

---

## Workshop Wrap-up

### What We've Covered

1. **Introduction to Terra Draw** - Understanding the unified API concept
2. **Basic Implementation** - Setting up Terra Draw with MapLibre GL JS
3. **Advanced Features** - Custom styling, event handling, and data management
4. **Production Ready** - Best practices and real-world considerations
5. **Multi-library Support** - Working with different mapping libraries

### Key Takeaways

- Terra Draw provides a **unified API** across all major web mapping libraries
- The **adapter pattern** makes it easy to switch between mapping libraries
- **Event-driven architecture** enables reactive applications
- **Extensive styling options** allow for complete visual customization
- **Production considerations** include error handling, performance, and state management

### Next Steps

1. **Experiment** with different mapping libraries using Terra Draw
2. **Build** a complete application using the patterns shown
3. **Contribute** to the Terra Draw ecosystem
4. **Stay updated** with new features and improvements

### Resources for Continued Learning

- **Official Documentation**: [terradraw.io](https://terradraw.io/)
- **GitHub Repository**: [github.com/JamesLMilner/terra-draw](https://github.com/JamesLMilner/terra-draw)
- **Examples Repository**: Practical implementations and use cases
- **Community**: Join discussions and get help from other developers

Thank you for participating in the Terra Draw workshop at FOSS4G 2025 Auckland!
