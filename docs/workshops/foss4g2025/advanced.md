# Advanced Features

In this section, you'll learn about Terra Draw's advanced capabilities including custom styling, event handling, and data management.

## Custom Styling

Terra Draw provides extensive styling capabilities for all drawing modes. Styling follows the patterns described in the [official styling guide](https://github.com/JamesLMilner/terra-draw/blob/main/guides/5.STYLING.md).

### Static Styling

You can define static styles for each mode:

```typescript
// Point mode with custom styling
const pointMode = new TerraDrawPointMode({
    styles: {
        pointColor: '#FF6B6B',
        pointWidth: 12,
        pointOutlineColor: '#FFFFFF',
        pointOutlineWidth: 3
    }
});

// LineString mode with custom styling
const lineMode = new TerraDrawLineStringMode({
    styles: {
        lineStringColor: '#4ECDC4',
        lineStringWidth: 4,
        closingPointColor: '#45B7AF',
        closingPointWidth: 10,
        closingPointOutlineColor: '#FFFFFF',
        closingPointOutlineWidth: 2
    }
});

// Polygon mode with custom styling
const polygonMode = new TerraDrawPolygonMode({
    styles: {
        fillColor: '#FFE66D80', // Semi-transparent yellow
        outlineColor: '#FF6B6B',
        outlineWidth: 3,
        closingPointColor: '#FF6B6B',
        closingPointWidth: 10
    }
});
```

### Dynamic Styling

You can create dynamic styles based on feature properties or interaction state:

```typescript
const polygonMode = new TerraDrawPolygonMode({
    styles: {
        fillColor: (feature, state) => {
            // Style based on feature properties
            if (feature.properties.type === 'building') {
                return '#8B5CF680';
            }
            if (feature.properties.type === 'park') {
                return '#10B98140';
            }
            // Style based on interaction state
            if (state === 'selected') {
                return '#F59E0B80';
            }
            return '#6B728080';
        },
        outlineColor: (feature, state) => {
            if (state === 'selected') {
                return '#F59E0B';
            }
            return feature.properties.type === 'building' ? '#8B5CF6' : '#10B981';
        },
        outlineWidth: 3
    }
});
```

### Styling Examples from Official Documentation

Here are practical styling examples for each mode:

#### Point Mode Styling
```typescript
const styledPointMode = new TerraDrawPointMode({
    styles: {
        pointColor: (feature) => {
            return feature.properties.urgent ? '#FF0000' : '#0000FF';
        },
        pointWidth: (feature) => {
            return feature.properties.size === 'large' ? 15 : 8;
        },
        pointOutlineColor: '#FFFFFF',
        pointOutlineWidth: 2
    }
});
```

#### LineString Mode Styling
```typescript
const styledLineMode = new TerraDrawLineStringMode({
    styles: {
        lineStringColor: (feature) => {
            const type = feature.properties.roadType;
            switch (type) {
                case 'highway': return '#FF0000';
                case 'arterial': return '#FFA500';
                case 'local': return '#808080';
                default: return '#000000';
            }
        },
        lineStringWidth: (feature) => {
            const type = feature.properties.roadType;
            switch (type) {
                case 'highway': return 6;
                case 'arterial': return 4;
                case 'local': return 2;
                default: return 1;
            }
        }
    }
});
```

#### Rectangle Mode Styling
```typescript
const styledRectangleMode = new TerraDrawRectangleMode({
    styles: {
        fillColor: '#FF000040',
        outlineColor: '#FF0000',
        outlineWidth: 2,
        closingPointColor: '#FF0000',
        closingPointWidth: 8
    }
});
```

## Event Handling

Terra Draw provides comprehensive event handling following the [official events documentation](https://github.com/JamesLMilner/terra-draw/blob/main/guides/6.EVENTS.md).

### Basic Events

```typescript
// Listen for drawing events
draw.on('draw', (event) => {
    console.log('Feature drawn:', event);
    const { feature, mode } = event;
    console.log(`Created a ${feature.geometry.type} using ${mode} mode`);
});

draw.on('change', (event) => {
    console.log('Drawing state changed:', event);
    // Triggered on any change (draw, edit, delete)
    updateFeatureCount();
});

draw.on('select', (event) => {
    console.log('Feature selected:', event);
    const { selectedFeatures } = event;
    console.log(`Selected ${selectedFeatures.length} feature(s)`);
});

draw.on('deselect', (event) => {
    console.log('Feature deselected:', event);
});

// Mode-specific events
draw.on('mode', (event) => {
    console.log('Mode changed to:', event.mode);
    updateActiveButton(event.mode);
});
```

### Practical Event Handling Example

Let's create an application that responds to drawing events:

```typescript
// Feature statistics tracker
interface Stats {
    points: number;
    lines: number;
    polygons: number;
    rectangles: number;
}

let stats: Stats = {
    points: 0,
    lines: 0,
    polygons: 0,
    rectangles: 0
};

function updateStats() {
    const features = draw.getSnapshot();
    
    stats = {
        points: features.filter(f => f.geometry.type === 'Point').length,
        lines: features.filter(f => f.geometry.type === 'LineString').length,
        polygons: features.filter(f => f.geometry.type === 'Polygon' && f.properties.mode === 'polygon').length,
        rectangles: features.filter(f => f.geometry.type === 'Polygon' && f.properties.mode === 'rectangle').length
    };
    
    displayStats();
}

function displayStats() {
    const statsElement = document.getElementById('stats');
    if (statsElement) {
        statsElement.innerHTML = `
            <h3>Statistics</h3>
            <div>Points: ${stats.points}</div>
            <div>Lines: ${stats.lines}</div>
            <div>Polygons: ${stats.polygons}</div>
            <div>Rectangles: ${stats.rectangles}</div>
        `;
    }
}

// Connect events to update stats
draw.on('change', updateStats);
```

Add this to your HTML:

```html
<div id="stats"></div>
```

## Data Management

Terra Draw provides powerful data management capabilities following the [official store documentation](https://github.com/JamesLMilner/terra-draw/blob/main/guides/2.STORE.md).

### Programmatic Feature Creation

You can add features programmatically:

```typescript
// Add a point
const point = {
    type: "Feature" as const,
    geometry: {
        type: "Point" as const,
        coordinates: [174.7645, -36.8485]
    },
    properties: {
        mode: "point"
    }
};

draw.addFeatures([point]);

// Add multiple features
const features = [
    {
        type: "Feature" as const,
        geometry: {
            type: "LineString" as const,
            coordinates: [
                [174.7545, -36.8485],
                [174.7645, -36.8485],
                [174.7745, -36.8585]
            ]
        },
        properties: { 
            mode: "linestring",
            name: "Route 1" 
        }
    }
];

draw.addFeatures(features);
```

### Feature Management Operations

```typescript
// Get all features
const allFeatures = draw.getSnapshot();

// Get selected features
const selectedIds = draw.getSelectedFeatureIds();

// Remove features by ID
draw.removeFeatures(['feature-id-1', 'feature-id-2']);

// Clear everything
draw.clear();

// Get features by mode
const points = allFeatures.filter(f => f.properties.mode === 'point');
const polygons = allFeatures.filter(f => f.properties.mode === 'polygon');
```

## Exercise 3: Advanced Styling

Create a drawing application with property-based styling:

1. **Update your Terra Draw configuration** with dynamic styling
2. **Add a feature type selector** to your HTML:

```html
<div class="feature-controls">
    <label for="feature-type">Feature Type:</label>
    <select id="feature-type">
        <option value="default">Default</option>
        <option value="building">Building</option>
        <option value="park">Park</option>
        <option value="road">Road</option>
    </select>
</div>
```

3. **Implement feature type assignment**:

```typescript
let currentFeatureType = 'default';

const typeSelector = document.getElementById('feature-type') as HTMLSelectElement;
typeSelector?.addEventListener('change', (e) => {
    currentFeatureType = (e.target as HTMLSelectElement).value;
});

// Listen for draw events to assign type
draw.on('draw', (event) => {
    if (currentFeatureType !== 'default') {
        // Update the feature with the selected type
        const features = draw.getSnapshot();
        const newFeature = features[features.length - 1];
        
        if (newFeature && newFeature.id) {
            // Remove and re-add with updated properties
            draw.removeFeatures([newFeature.id]);
            newFeature.properties.type = currentFeatureType;
            draw.addFeatures([newFeature]);
        }
    }
});
```

## Exercise 4: Event-Driven Application

Build an application that responds to drawing events:

1. **Add the statistics display** to your application
2. **Implement feature selection feedback**:

```typescript
draw.on('select', (event) => {
    const infoElement = document.getElementById('selection-info');
    if (infoElement && event.selectedFeatures.length > 0) {
        const feature = event.selectedFeatures[0];
        infoElement.innerHTML = `
            <h4>Selected Feature</h4>
            <div>Type: ${feature.geometry.type}</div>
            <div>Mode: ${feature.properties.mode}</div>
            <div>Properties: ${JSON.stringify(feature.properties, null, 2)}</div>
        `;
    }
});

draw.on('deselect', () => {
    const infoElement = document.getElementById('selection-info');
    if (infoElement) {
        infoElement.innerHTML = '<div>No feature selected</div>';
    }
});
```

3. **Add export/import functionality**:

```typescript
// Export features as GeoJSON
function exportFeatures() {
    const features = draw.getSnapshot();
    const geojson = {
        type: 'FeatureCollection',
        features: features
    };
    
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { 
        type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'terra-draw-features.geojson';
    a.click();
    
    URL.revokeObjectURL(url);
}

// Import features from GeoJSON
function importFeatures(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const geojson = JSON.parse(e.target?.result as string);
                if (geojson.type === 'FeatureCollection') {
                    draw.addFeatures(geojson.features);
                } else if (geojson.type === 'Feature') {
                    draw.addFeatures([geojson]);
                }
            } catch (error) {
                console.error('Error importing GeoJSON:', error);
                alert('Error importing file. Please check the format.');
            }
        };
        reader.readAsText(file);
    }
}
```

## What's Next?

You've learned about Terra Draw's advanced features including styling, events, and data management. Next, we'll explore the maplibre-gl-terradraw plugin for enhanced integration.

**Next:** [MapLibre Integration](maplibre.md)