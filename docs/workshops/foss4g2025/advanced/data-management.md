# Data Management

Terra Draw provides powerful data management capabilities following the [official store documentation](https://github.com/JamesLMilner/terra-draw/blob/main/guides/2.STORE.md).

## Programmatic Feature Creation

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

## Feature Management Operations

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

## Export/Import Functionality

Add export and import capabilities to your application:

```typescript
// Export features as GeoJSON
function exportFeatures() {
    const features = draw.getSnapshot();
    const geojson = {
        type: 'FeatureCollection' as const,
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

Add these buttons to your HTML:

```html
<div class="data-controls">
    <button onclick="exportFeatures()">Export GeoJSON</button>
    <input type="file" id="import-input" accept=".json,.geojson" onchange="importFeatures(event)" style="display: none;">
    <button onclick="document.getElementById('import-input').click()">Import GeoJSON</button>
</div>
```

## What's Next?

Now let's practice what you've learned with some advanced exercises.

**Next:** [Exercise 3 - Advanced Styling](exercise-3.md)