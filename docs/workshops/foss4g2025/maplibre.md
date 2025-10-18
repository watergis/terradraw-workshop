# MapLibre Integration

In this section, you'll learn about the maplibre-gl-terradraw plugin and how to create production-ready applications with Terra Draw and MapLibre GL JS.

## Introduction to maplibre-gl-terradraw

[maplibre-gl-terradraw](https://github.com/watergis/maplibre-gl-terradraw) is a specialized plugin that provides enhanced integration between Terra Draw and MapLibre GL JS. It was created to simplify the integration process and provide additional features specifically tailored for MapLibre GL JS applications.

### Why Use maplibre-gl-terradraw?

While you can use Terra Draw directly with the MapLibre adapter, the maplibre-gl-terradraw plugin offers several advantages:

- **Simplified API** - Easier setup and configuration for MapLibre applications
- **Built-in Controls** - Ready-to-use UI controls that integrate with MapLibre's control system
- **Enhanced Styling** - Additional styling options optimized for MapLibre GL JS
- **Better Performance** - Optimizations specific to MapLibre GL JS rendering
- **Production Ready** - Battle-tested in real-world applications

You can find comprehensive documentation at [https://terradraw.water-gis.com](https://terradraw.water-gis.com).

### When to Choose Each Approach

| Approach | Best For | Use Case |
|----------|----------|----------|
| **Direct Terra Draw** | Multi-library support, maximum flexibility | Apps that might switch mapping libraries |
| **maplibre-gl-terradraw** | MapLibre-focused apps, rapid development | Production MapLibre applications |

## Using maplibre-gl-terradraw

### Installation

```bash
npm install maplibre-gl-terradraw
```

### Basic Setup

The plugin provides a control that you can add to your MapLibre map:

```typescript
import maplibregl from 'maplibre-gl';
import { MaplibreTerraDrawControl } from 'maplibre-gl-terradraw';

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [174.7645, -36.8485],
    zoom: 10
});

map.on('load', () => {
    // Add Terra Draw as a control
    const drawControl = new MaplibreTerraDrawControl({
        modes: ['point', 'linestring', 'polygon', 'select'],
        open: true, // Start with control panel open
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

    map.addControl(drawControl, 'top-left');

    // Access the underlying Terra Draw instance
    drawControl.on('draw', (event) => {
        console.log('Feature drawn:', event);
    });
    
    drawControl.on('change', (event) => {
        console.log('Features changed:', event);
    });
});
```

### Advanced Configuration

```typescript
const drawControl = new MaplibreTerraDrawControl({
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
        },
        polygon: {
            fillColor: (feature) => {
                const type = feature.properties.type || 'default';
                const colors = {
                    'building': '#8B5CF680',
                    'park': '#10B98140',
                    'water': '#3B82F680',
                    'default': '#6B728080'
                };
                return colors[type as keyof typeof colors];
            }
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

## Production Best Practices

### 1. Error Handling

Always implement proper error handling for production applications:

```typescript
try {
    const drawControl = new MaplibreTerraDrawControl({
        modes: ['point', 'polygon'],
        validation: {
            polygon: (feature, { updateType }) => {
                if (updateType === 'finish') {
                    // Validate completed polygon
                    const coords = feature.geometry.coordinates[0];
                    if (coords.length < 4) {
                        throw new Error('Polygon must have at least 3 points');
                    }
                }
                return true;
            }
        }
    });
    
    map.addControl(drawControl, 'top-left');
    
} catch (error) {
    console.error('Terra Draw initialization failed:', error);
    // Show user-friendly error message
    showErrorMessage('Drawing tools could not be initialized. Please refresh the page.');
}

function showErrorMessage(message: string) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee;
        color: #c33;
        padding: 10px;
        border: 1px solid #fcc;
        border-radius: 4px;
        z-index: 9999;
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
}
```

### 2. Performance Optimization

For applications with many features, implement performance optimizations:

```typescript
// Debounce change events for better performance
let changeTimeout: number;

drawControl.on('change', () => {
    clearTimeout(changeTimeout);
    changeTimeout = setTimeout(() => {
        // Process changes
        updateUI();
        saveToLocalStorage();
    }, 100);
});

// Optimize for large datasets
const drawControl = new MaplibreTerraDrawControl({
    modes: ['point', 'polygon'],
    coordinatePrecision: 6, // Reduce coordinate precision for better performance
    simplifyOnFinish: true  // Simplify geometries when drawing is completed
});
```

### 3. Data Persistence

Implement auto-save functionality:

```typescript
// Auto-save drawing data
function saveDrawing() {
    const features = drawControl.getAll();
    const drawingData = {
        features,
        timestamp: Date.now(),
        version: '1.0'
    };
    
    localStorage.setItem('terra-draw-data', JSON.stringify(drawingData));
}

// Load drawing data
function loadDrawing() {
    const saved = localStorage.getItem('terra-draw-data');
    if (saved) {
        try {
            const drawingData = JSON.parse(saved);
            drawControl.set(drawingData.features);
        } catch (error) {
            console.error('Failed to load saved drawing:', error);
        }
    }
}

// Auto-save on changes with debounce
const debounce = (func: Function, wait: number) => {
    let timeout: number;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

drawControl.on('change', debounce(saveDrawing, 1000));

// Load data when control is added
map.on('load', () => {
    loadDrawing();
});
```

### 4. Integration with State Management

For applications using state management libraries:

```typescript
// Example integration with a state store
interface DrawingState {
    features: GeoJSON.Feature[];
    selectedFeatures: string[];
    currentMode: string;
}

class DrawingStore {
    private state: DrawingState = {
        features: [],
        selectedFeatures: [],
        currentMode: 'select'
    };
    
    private listeners: Array<(state: DrawingState) => void> = [];

    subscribe(listener: (state: DrawingState) => void) {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) this.listeners.splice(index, 1);
        };
    }

    private notify() {
        this.listeners.forEach(listener => listener({ ...this.state }));
    }

    setFeatures(features: GeoJSON.Feature[]) {
        this.state.features = features;
        this.notify();
    }

    setSelectedFeatures(selectedIds: string[]) {
        this.state.selectedFeatures = selectedIds;
        this.notify();
    }

    setMode(mode: string) {
        this.state.currentMode = mode;
        this.notify();
    }

    getState() {
        return { ...this.state };
    }
}

const drawingStore = new DrawingStore();

// Connect Terra Draw to state management
drawControl.on('change', () => {
    drawingStore.setFeatures(drawControl.getAll());
});

drawControl.on('select', (event) => {
    drawingStore.setSelectedFeatures(event.selectedFeatures.map(f => f.id));
});

drawControl.on('mode', (event) => {
    drawingStore.setMode(event.mode);
});
```

## Exercise 5: Complete MapLibre Application

Let's build a production-ready drawing application. Update your `src/main.ts`:

```typescript
import './style.css';
import maplibregl from 'maplibre-gl';
import { MaplibreTerraDrawControl } from 'maplibre-gl-terradraw';

interface AppState {
    featureCount: number;
    selectedCount: number;
    currentMode: string;
}

class DrawingApp {
    private map: maplibregl.Map;
    private drawControl: MaplibreTerraDrawControl;
    private state: AppState = {
        featureCount: 0,
        selectedCount: 0,
        currentMode: 'select'
    };

    constructor() {
        this.initMap();
        this.setupUI();
    }

    private initMap() {
        this.map = new maplibregl.Map({
            container: 'map',
            style: 'https://demotiles.maplibre.org/style.json',
            center: [174.7645, -36.8485],
            zoom: 10
        });

        this.map.on('load', () => {
            this.initDrawControl();
        });
    }

    private initDrawControl() {
        this.drawControl = new MaplibreTerraDrawControl({
            modes: ['point', 'linestring', 'polygon', 'rectangle', 'select'],
            open: true,
            styling: {
                point: {
                    color: (feature) => feature.properties.urgent ? '#EF4444' : '#3B82F6',
                    size: 8,
                    outlineColor: '#FFFFFF',
                    outlineWidth: 2
                },
                linestring: {
                    color: '#EF4444',
                    width: 3
                },
                polygon: {
                    fillColor: (feature) => {
                        const type = feature.properties.type || 'default';
                        const colors = {
                            'building': '#8B5CF680',
                            'park': '#10B98140',
                            'water': '#3B82F680',
                            'default': '#6B728080'
                        };
                        return colors[type as keyof typeof colors];
                    },
                    outlineColor: '#10B981',
                    outlineWidth: 2
                }
            }
        });

        this.map.addControl(this.drawControl, 'top-left');
        this.setupDrawEvents();
        this.loadSavedData();
    }

    private setupDrawEvents() {
        this.drawControl.on('change', () => {
            this.updateState();
            this.saveData();
        });

        this.drawControl.on('select', (event) => {
            this.state.selectedCount = event.selectedFeatures.length;
            this.updateUI();
        });

        this.drawControl.on('mode', (event) => {
            this.state.currentMode = event.mode;
            this.updateUI();
        });
    }

    private setupUI() {
        // Export button
        const exportBtn = document.getElementById('export-btn') as HTMLButtonElement;
        exportBtn?.addEventListener('click', () => this.exportData());

        // Import button
        const importInput = document.getElementById('import-input') as HTMLInputElement;
        importInput?.addEventListener('change', (e) => this.importData(e));

        // Clear button
        const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;
        clearBtn?.addEventListener('click', () => this.clearAll());

        // Feature type selector
        const typeSelector = document.getElementById('feature-type') as HTMLSelectElement;
        typeSelector?.addEventListener('change', (e) => {
            this.setFeatureType((e.target as HTMLSelectElement).value);
        });
    }

    private updateState() {
        const features = this.drawControl.getAll();
        this.state.featureCount = features.length;
        this.updateUI();
    }

    private updateUI() {
        // Update statistics
        const statsElement = document.getElementById('stats');
        if (statsElement) {
            statsElement.innerHTML = `
                <h3>Statistics</h3>
                <div>Total Features: ${this.state.featureCount}</div>
                <div>Selected: ${this.state.selectedCount}</div>
                <div>Current Mode: ${this.state.currentMode}</div>
            `;
        }
    }

    private saveData() {
        const features = this.drawControl.getAll();
        const data = {
            features,
            timestamp: Date.now()
        };
        localStorage.setItem('terradraw-app-data', JSON.stringify(data));
    }

    private loadSavedData() {
        const saved = localStorage.getItem('terradraw-app-data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.drawControl.set(data.features);
                this.updateState();
            } catch (error) {
                console.error('Failed to load saved data:', error);
            }
        }
    }

    private exportData() {
        const features = this.drawControl.getAll();
        const geojson = {
            type: 'FeatureCollection' as const,
            features
        };
        
        const blob = new Blob([JSON.stringify(geojson, null, 2)], { 
            type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `terradraw-export-${Date.now()}.geojson`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    private importData(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const geojson = JSON.parse(e.target?.result as string);
                    if (geojson.type === 'FeatureCollection') {
                        this.drawControl.set(geojson.features);
                    } else if (geojson.type === 'Feature') {
                        this.drawControl.set([geojson]);
                    }
                    this.updateState();
                } catch (error) {
                    console.error('Error importing file:', error);
                    alert('Error importing file. Please check the format.');
                }
            };
            reader.readAsText(file);
        }
        
        // Clear the input
        input.value = '';
    }

    private clearAll() {
        if (confirm('Are you sure you want to clear all features?')) {
            this.drawControl.deleteAll();
            this.updateState();
        }
    }

    private setFeatureType(type: string) {
        // Implementation would depend on how you want to handle feature types
        // This could involve updating selected features or setting a default type for new features
        console.log('Feature type changed to:', type);
    }
}

// Initialize the application
new DrawingApp();
```

Update your HTML to include the UI elements:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terra Draw Workshop - MapLibre Integration</title>
    <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet">
</head>
<body>
    <div id="app">
        <div class="header">
            <h1>Terra Draw Workshop - MapLibre Integration</h1>
            <div class="controls">
                <button id="export-btn">Export GeoJSON</button>
                <input type="file" id="import-input" accept=".json,.geojson" style="display: none;">
                <button onclick="document.getElementById('import-input').click()">Import GeoJSON</button>
                <button id="clear-btn">Clear All</button>
                
                <select id="feature-type">
                    <option value="default">Default</option>
                    <option value="building">Building</option>
                    <option value="park">Park</option>
                    <option value="water">Water</option>
                </select>
            </div>
        </div>
        
        <div class="app-layout">
            <div class="sidebar">
                <div id="stats"></div>
            </div>
            <div id="map"></div>
        </div>
    </div>
    <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

And update your CSS:

```css
.header {
    padding: 10px 20px;
    background: #f8f9fa;
    border-bottom: 1px solid #dee2e6;
}

.controls {
    margin-top: 10px;
}

.controls button, .controls select {
    margin: 0 5px;
    padding: 8px 12px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
}

.app-layout {
    display: flex;
    height: calc(100vh - 120px);
}

.sidebar {
    width: 250px;
    padding: 20px;
    background: #f8f9fa;
    border-right: 1px solid #dee2e6;
}

#map {
    flex: 1;
}
```

## What's Next?

You've learned how to use the maplibre-gl-terradraw plugin and build production-ready applications. Next, we'll explore Terra Draw's multi-library support and adapter system.

**Next:** [Multi-library Support](multi-library.md)