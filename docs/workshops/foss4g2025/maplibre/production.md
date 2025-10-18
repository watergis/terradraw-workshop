# Production Practices

Best practices for using maplibre-gl-terradraw in production applications.

## State Management Integration

```typescript
// Example with a simple state manager
class DrawingState {
    private features: any[] = [];
    
    addFeature(feature: any) {
        this.features.push(feature);
        this.notifyChange();
    }
    
    removeFeature(id: string) {
        this.features = this.features.filter(f => f.id !== id);
        this.notifyChange();
    }
    
    private notifyChange() {
        // Emit change events for UI updates
    }
}

const state = new DrawingState();

drawControl.on('draw.create', (e) => {
    e.features.forEach(feature => {
        state.addFeature(feature);
    });
});
```

## Performance Optimization

```typescript
// Optimize for large datasets
const drawControl = new MaplibreTerraDrawControl({
    modes: ['point', 'polygon', 'select'],
    // Reduce render frequency for better performance
    continuousMode: false,
    // Limit maximum features
    maxFeatures: 1000
});
```

## Data Persistence

```typescript
// Save to localStorage
function saveDrawingData() {
    const features = drawControl.getAll();
    localStorage.setItem('drawing-data', JSON.stringify(features));
}

// Load from localStorage
function loadDrawingData() {
    const saved = localStorage.getItem('drawing-data');
    if (saved) {
        const features = JSON.parse(saved);
        drawControl.add(features);
    }
}
```

**Next:** [Exercise 5 - Complete App](exercise-5.md)