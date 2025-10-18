# Multi-library Support

In this section, you'll learn about Terra Draw's adapter pattern and how to use the same drawing code across different mapping libraries.

## Understanding Adapters

Terra Draw's adapter pattern allows the same drawing code to work across different mapping libraries. This follows the official [adapters documentation](https://github.com/JamesLMilner/terra-draw/blob/main/guides/3.ADAPTERS.md).

### What are Adapters?

Adapters are bridge components that translate Terra Draw's unified API calls into library-specific operations. Each supported mapping library has its own adapter that handles:

- **Rendering** - How features are displayed on the map
- **Event handling** - How user interactions are processed
- **Coordinate systems** - How geographic coordinates are managed
- **Layer management** - How drawing layers are added/removed

### Available Adapters

| Library | Adapter Package | Import |
|---------|----------------|---------|
| MapLibre GL JS | `terra-draw-maplibre-gl-adapter` | `TerraDrawMapLibreGLAdapter` |
| Leaflet | `terra-draw-leaflet-adapter` | `TerraDrawLeafletAdapter` |
| OpenLayers | `terra-draw-openlayers-adapter` | `TerraDrawOpenLayersAdapter` |
| Mapbox GL JS | `terra-draw-mapbox-gl-adapter` | `TerraDrawMapboxGLAdapter` |
| Google Maps | `terra-draw-google-maps-adapter` | `TerraDrawGoogleMapsAdapter` |
| ArcGIS JS API | `terra-draw-arcgis-adapter` | `TerraDrawArcGISAdapter` |

## Leaflet Example

Here's how to use Terra Draw with Leaflet:

```typescript
import L from 'leaflet';
import { TerraDraw } from 'terra-draw';
import { TerraDrawLeafletAdapter } from 'terra-draw-leaflet-adapter';
import { 
    TerraDrawPointMode,
    TerraDrawPolygonMode,
    TerraDrawSelectMode
} from 'terra-draw';

// Create Leaflet map
const map = L.map('map').setView([-36.8485, 174.7645], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Same Terra Draw setup as MapLibre!
const draw = new TerraDraw({
    adapter: new TerraDrawLeafletAdapter({ map }),
    modes: [
        new TerraDrawPointMode(),
        new TerraDrawPolygonMode(),
        new TerraDrawSelectMode()
    ]
});

draw.start();
```

## OpenLayers Example

Here's how to use Terra Draw with OpenLayers:

```typescript
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { TerraDraw } from 'terra-draw';
import { TerraDrawOpenLayersAdapter } from 'terra-draw-openlayers-adapter';
import { 
    TerraDrawPointMode,
    TerraDrawPolygonMode,
    TerraDrawSelectMode
} from 'terra-draw';

// Create OpenLayers map
const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat([174.7645, -36.8485]), // Auckland coordinates
        zoom: 10
    })
});

// Same Terra Draw setup!
const draw = new TerraDraw({
    adapter: new TerraDrawOpenLayersAdapter({ map }),
    modes: [
        new TerraDrawPointMode(),
        new TerraDrawPolygonMode(),
        new TerraDrawSelectMode()
    ]
});

draw.start();
```

## Universal Drawing Component

You can create a universal component that works with any supported mapping library:

```typescript
import { TerraDraw } from 'terra-draw';
import { 
    TerraDrawPointMode,
    TerraDrawLineStringMode,
    TerraDrawPolygonMode,
    TerraDrawSelectMode
} from 'terra-draw';

// Import all adapters
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
import { TerraDrawLeafletAdapter } from 'terra-draw-leaflet-adapter';
import { TerraDrawOpenLayersAdapter } from 'terra-draw-openlayers-adapter';
import { TerraDrawMapboxGLAdapter } from 'terra-draw-mapbox-gl-adapter';
import { TerraDrawGoogleMapsAdapter } from 'terra-draw-google-maps-adapter';
import { TerraDrawArcGISAdapter } from 'terra-draw-arcgis-adapter';

type MapLibrary = 'maplibre' | 'leaflet' | 'openlayers' | 'mapbox' | 'google' | 'arcgis';

interface DrawingOptions {
    pointMode?: any;
    lineMode?: any;
    polygonMode?: any;
    selectMode?: any;
}

class UniversalDrawingTool {
    private mapInstance: any;
    private mapType: MapLibrary;
    private options: DrawingOptions;
    private draw: TerraDraw | null = null;
    
    // Event callbacks
    public onFeatureChange?: (features: any[]) => void;
    public onFeatureDraw?: (event: any) => void;
    public onFeatureSelect?: (event: any) => void;

    constructor(mapInstance: any, mapType: MapLibrary, options: DrawingOptions = {}) {
        this.mapInstance = mapInstance;
        this.mapType = mapType;
        this.options = options;
        
        this.initializeTerraDrawByLibrary();
    }
    
    private initializeTerraDrawByLibrary() {
        let adapter: any;
        
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
                new TerraDrawSelectMode(this.options.selectMode || {}),
                new TerraDrawPointMode(this.options.pointMode || {}),
                new TerraDrawLineStringMode(this.options.lineMode || {}),
                new TerraDrawPolygonMode(this.options.polygonMode || {})
            ]
        });
        
        this.draw.start();
        this.setupEventHandlers();
    }
    
    private setupEventHandlers() {
        if (!this.draw) return;
        
        this.draw.on('change', (event) => {
            this.onFeatureChange?.(this.draw!.getSnapshot());
        });
        
        this.draw.on('draw', (event) => {
            this.onFeatureDraw?.(event);
        });
        
        this.draw.on('select', (event) => {
            this.onFeatureSelect?.(event);
        });
    }
    
    // Public API methods
    setMode(mode: string) {
        this.draw?.setMode(mode);
    }
    
    getFeatures() {
        return this.draw?.getSnapshot() || [];
    }
    
    addFeatures(features: any[]) {
        this.draw?.addFeatures(features);
    }
    
    clear() {
        this.draw?.clear();
    }
    
    destroy() {
        this.draw?.stop();
        this.draw = null;
    }
}
```

### Usage Examples

```typescript
// MapLibre
const maplibreDrawing = new UniversalDrawingTool(maplibreMap, 'maplibre', {
    pointMode: { styles: { pointColor: '#FF0000' } }
});

// Leaflet  
const leafletDrawing = new UniversalDrawingTool(leafletMap, 'leaflet', {
    polygonMode: { styles: { fillColor: '#00FF0040' } }
});

// OpenLayers
const olDrawing = new UniversalDrawingTool(olMap, 'openlayers');

// Set up event handlers
maplibreDrawing.onFeatureChange = (features) => {
    console.log(`MapLibre has ${features.length} features`);
};

leafletDrawing.onFeatureDraw = (event) => {
    console.log('Leaflet feature drawn:', event);
};
```

## Migration Between Libraries

Terra Draw makes it easy to switch from one mapping library to another because the core drawing logic remains the same:

```typescript
// Save data from MapLibre implementation
const maplibreDraw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map: maplibreMap }),
    modes: [new TerraDrawPolygonMode()]
});

// Export your drawing data
const features = maplibreDraw.getSnapshot();

// Switch to Leaflet
const leafletDraw = new TerraDraw({
    adapter: new TerraDrawLeafletAdapter({ map: leafletMap }),
    modes: [new TerraDrawPolygonMode()] // Same mode configuration
});

// Restore your drawing data
leafletDraw.addFeatures(features);
```

## Library Comparison

### Performance Characteristics

| Library | Best For | Performance Notes |
|---------|----------|-------------------|
| MapLibre GL JS | Vector tiles, WebGL rendering | Best for large datasets, smooth animations |
| Leaflet | Simple implementations, raster tiles | Lightweight, good for basic use cases |
| OpenLayers | Complex GIS applications | Most features, comprehensive but can be heavy |
| Mapbox GL JS | Commercial applications | Similar to MapLibre, requires API key |
| Google Maps | Consumer applications | Easy integration, usage limits apply |
| ArcGIS | Enterprise GIS | Comprehensive GIS features, enterprise focused |

### When to Use Each Library

- **MapLibre GL JS**: Choose for modern web applications with vector tiles, WebGL rendering, and smooth user experience
- **Leaflet**: Choose for simple applications, quick prototypes, or when you need maximum compatibility
- **OpenLayers**: Choose for complex GIS applications that need advanced spatial analysis features
- **Mapbox GL JS**: Choose when you need MapLibre-like features but prefer commercial support
- **Google Maps**: Choose for consumer-facing applications where familiarity is important
- **ArcGIS**: Choose for enterprise applications that integrate with Esri ecosystem

## Styling Consistency

One of Terra Draw's strengths is that styling works the same way across all libraries:

```typescript
// This styling configuration works identically across all adapters
const commonStyles = {
    fillColor: '#10B98140',
    outlineColor: '#10B981',
    outlineWidth: 2,
    pointColor: '#3B82F6',
    pointWidth: 8
};

// Works with MapLibre
const maplibreMode = new TerraDrawPolygonMode({ styles: commonStyles });

// Works with Leaflet
const leafletMode = new TerraDrawPolygonMode({ styles: commonStyles });

// Works with OpenLayers  
const olMode = new TerraDrawPolygonMode({ styles: commonStyles });
```

Terra Draw handles the translation of these universal styles to library-specific styling APIs automatically.

## Exercise 6: Multi-Library Comparison

Create a side-by-side comparison to see Terra Draw working with different libraries. This example shows MapLibre and Leaflet:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Terra Draw - Multi-Library Comparison</title>
    <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
    <link href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" rel="stylesheet">
    <style>
        .comparison-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            height: 100vh;
            padding: 20px;
            font-family: Arial, sans-serif;
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
            border-bottom: 1px solid #ddd;
        }
        
        .map-container {
            height: calc(100% - 100px);
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
            z-index: 1000;
        }
        
        .controls button {
            margin: 2px;
            padding: 5px 10px;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
            border-radius: 3px;
            font-size: 12px;
        }
        
        .controls button:hover {
            background: #f0f0f0;
        }
        
        .controls button.active {
            background: #007bff;
            color: white;
        }
        
        .feature-count {
            background: #f8f9fa;
            padding: 10px;
            text-align: center;
            border-top: 1px solid #ddd;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="comparison-container">
        <div class="map-section">
            <div class="map-header">MapLibre GL JS + Terra Draw</div>
            <div class="map-container">
                <div id="maplibre-map" class="map"></div>
                <div class="controls" id="maplibre-controls">
                    <button onclick="setMapLibreMode('point')">Point</button>
                    <button onclick="setMapLibreMode('linestring')">Line</button>
                    <button onclick="setMapLibreMode('polygon')">Polygon</button>
                    <button onclick="setMapLibreMode('select')">Select</button>
                    <button onclick="clearMapLibre()">Clear</button>
                </div>
            </div>
            <div class="feature-count" id="maplibre-count">Features: 0</div>
        </div>
        
        <div class="map-section">
            <div class="map-header">Leaflet + Terra Draw</div>
            <div class="map-container">
                <div id="leaflet-map" class="map"></div>
                <div class="controls" id="leaflet-controls">
                    <button onclick="setLeafletMode('point')">Point</button>
                    <button onclick="setLeafletMode('linestring')">Line</button>
                    <button onclick="setLeafletMode('polygon')">Polygon</button>
                    <button onclick="setLeafletMode('select')">Select</button>
                    <button onclick="clearLeaflet()">Clear</button>
                </div>
            </div>
            <div class="feature-count" id="leaflet-count">Features: 0</div>
        </div>
    </div>

    <script type="module">
        import maplibregl from 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js';
        import L from 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js';
        // Note: In a real application, you'd properly import Terra Draw and adapters
        
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
        let maplibreFeatureCount = 0;
        let leafletFeatureCount = 0;

        // Mock Terra Draw instances for demonstration
        console.log('MapLibre map initialized');
        console.log('Leaflet map initialized');
        
        // Global functions for controls (would be replaced with actual Terra Draw calls)
        window.setMapLibreMode = (mode) => {
            console.log('MapLibre mode:', mode);
            updateActiveButtons('maplibre-controls', mode);
        };

        window.setLeafletMode = (mode) => {
            console.log('Leaflet mode:', mode);
            updateActiveButtons('leaflet-controls', mode);
        };

        window.clearMapLibre = () => {
            console.log('MapLibre cleared');
            maplibreFeatureCount = 0;
            updateFeatureCount('maplibre-count', maplibreFeatureCount);
        };

        window.clearLeaflet = () => {
            console.log('Leaflet cleared');
            leafletFeatureCount = 0;
            updateFeatureCount('leaflet-count', leafletFeatureCount);
        };
        
        function updateActiveButtons(containerId, activeMode) {
            const container = document.getElementById(containerId);
            const buttons = container.querySelectorAll('button');
            buttons.forEach(btn => btn.classList.remove('active'));
            
            const modeMap = {
                'point': 0,
                'linestring': 1, 
                'polygon': 2,
                'select': 3
            };
            
            const activeIndex = modeMap[activeMode];
            if (activeIndex !== undefined && buttons[activeIndex]) {
                buttons[activeIndex].classList.add('active');
            }
        }
        
        function updateFeatureCount(elementId, count) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = `Features: ${count}`;
            }
        }

        // Initialize with point mode
        setMapLibreMode('point');
        setLeafletMode('point');
    </script>
</body>
</html>
```

This example demonstrates how Terra Draw can provide identical functionality across different mapping libraries with the same API.

## What's Next?

You've learned about Terra Draw's multi-library support and adapter pattern. This knowledge allows you to choose the right mapping library for your needs while maintaining consistent drawing functionality.

**Next:** [Troubleshooting](troubleshooting.md)