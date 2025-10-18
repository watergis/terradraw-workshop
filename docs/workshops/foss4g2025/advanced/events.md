# Event Handling

Terra Draw provides comprehensive event handling following the [official events documentation](https://github.com/JamesLMilner/terra-draw/blob/main/guides/6.EVENTS.md).

## Basic Events

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

## Practical Event Handling Example

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

## What's Next?

Now that you understand events, let's explore Terra Draw's data management capabilities.

**Next:** [Data Management](data-management.md)