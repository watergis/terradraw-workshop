# Exercise 4: Event-Driven Application

**Objective**: Build an application that responds to drawing events and provides real-time feedback.

## Step 1: Add Statistics Display

Add statistics tracking to your HTML:

```html
<div id="app-stats">
    <h3>Drawing Statistics</h3>
    <div id="feature-stats"></div>
    <div id="selection-info">No feature selected</div>
</div>
```

## Step 2: Implement Statistics Tracking

```typescript
interface AppStats {
    points: number;
    lines: number;
    polygons: number;
    rectangles: number;
    totalArea: number;
    totalLength: number;
}

let currentStats: AppStats = {
    points: 0,
    lines: 0,
    polygons: 0,
    rectangles: 0,
    totalArea: 0,
    totalLength: 0
};

function updateStatistics() {
    const features = draw.getSnapshot();
    
    currentStats.points = features.filter(f => f.geometry.type === 'Point').length;
    currentStats.lines = features.filter(f => f.geometry.type === 'LineString').length;
    currentStats.polygons = features.filter(f => f.geometry.type === 'Polygon' && f.properties.mode === 'polygon').length;
    currentStats.rectangles = features.filter(f => f.geometry.type === 'Polygon' && f.properties.mode === 'rectangle').length;
    
    displayStatistics();
}

function displayStatistics() {
    const statsElement = document.getElementById('feature-stats');
    if (statsElement) {
        statsElement.innerHTML = `
            <div>Points: ${currentStats.points}</div>
            <div>Lines: ${currentStats.lines}</div>
            <div>Polygons: ${currentStats.polygons}</div>
            <div>Rectangles: ${currentStats.rectangles}</div>
        `;
    }
}
```

## Step 3: Add Selection Feedback

```typescript
draw.on('select', (event) => {
    const infoElement = document.getElementById('selection-info');
    if (infoElement && event.selectedFeatures.length > 0) {
        const feature = event.selectedFeatures[0];
        infoElement.innerHTML = `
            <h4>Selected Feature</h4>
            <div>Type: ${feature.geometry.type}</div>
            <div>Mode: ${feature.properties.mode}</div>
            <div>Feature Type: ${feature.properties.type || 'default'}</div>
        `;
    }
});

draw.on('deselect', () => {
    const infoElement = document.getElementById('selection-info');
    if (infoElement) {
        infoElement.innerHTML = 'No feature selected';
    }
});
```

## Step 4: Real-time Updates

Connect all events for real-time updates:

```typescript
// Update stats on any change
draw.on('change', updateStatistics);

// Log drawing activity
draw.on('draw', (event) => {
    console.log(`New ${event.feature.geometry.type} drawn in ${event.mode} mode`);
    
    // Show temporary notification
    showNotification(`Created ${event.feature.geometry.type}`);
});

function showNotification(message: string) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
        z-index: 1000;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}
```

## Step 5: Add Export with Statistics

```typescript
function exportWithStats() {
    const features = draw.getSnapshot();
    const exportData = {
        type: 'FeatureCollection',
        features: features,
        metadata: {
            exportedAt: new Date().toISOString(),
            statistics: currentStats,
            totalFeatures: features.length
        }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `terra-draw-export-${Date.now()}.geojson`;
    a.click();
    
    URL.revokeObjectURL(url);
}
```

## Step 6: Test Your Application

1. **Draw various features** and watch statistics update in real-time
2. **Select different features** and see the selection information
3. **Watch for notifications** when creating new features
4. **Export the data** and examine the metadata included

## Expected Results

After completing this exercise, your application should:
- Show real-time statistics as you draw
- Display information about selected features
- Show notifications for user actions
- Export data with metadata and statistics

## What's Next?

You've mastered Terra Draw's advanced features! Now let's explore the maplibre-gl-terradraw plugin for enhanced MapLibre integration.

**Next:** [MapLibre Integration](../maplibre.md)