# Data Structure

Terra Draw uses GeoJSON format for all geographic data. Understanding this structure is essential for working with the drawing data.

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

## GeoJSON Structure

Terra Draw uses standard GeoJSON format with essential Terra Draw properties:

### Point Feature
```javascript
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
```

### LineString Feature
```javascript
{
    type: "Feature",
    geometry: {
        type: "LineString",
        coordinates: [
            [174.7645, -36.8485],
            [174.7745, -36.8485],
            [174.7745, -36.8585]
        ]
    },
    properties: {
        mode: "linestring"  // Essential mode property
    }
}
```

### Polygon Feature
```javascript
{
    type: "Feature",
    geometry: {
        type: "Polygon",
        coordinates: [[
            [174.7645, -36.8485],
            [174.7745, -36.8485],
            [174.7745, -36.8585],
            [174.7645, -36.8585],
            [174.7645, -36.8485]  // Closed ring
        ]]
    },
    properties: {
        mode: "polygon"  // Essential mode property
    }
}
```

## Essential Mode Property

The `mode` property is essential for Terra Draw to understand which mode created each feature and how to handle it during editing. This property tells Terra Draw:

- Which mode should handle feature editing
- How to render the feature appropriately
- What interaction behaviors are available

## What's Next?

Now that you understand the data structure, let's practice with some hands-on exercises.

**Next:** [Exercise 1 - Basic Drawing](exercise-1.md)