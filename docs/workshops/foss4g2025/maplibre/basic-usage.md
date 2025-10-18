# Basic Usage

Learn how to use the maplibre-gl-terradraw plugin for enhanced MapLibre integration.

## Installation

```bash
npm install maplibre-gl-terradraw
```

## Basic Setup

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
    const drawControl = new MaplibreTerraDrawControl({
        modes: ['point', 'linestring', 'polygon', 'rectangle', 'select'],
        open: true
    });
    
    map.addControl(drawControl, 'top-left');
});
```

## Configuration Options

```typescript
const drawControl = new MaplibreTerraDrawControl({
    modes: ['point', 'linestring', 'polygon', 'select'],
    open: true,
    displayControlsDefault: true,
    styles: {
        point: {
            pointColor: '#3B82F6',
            pointWidth: 8
        },
        polygon: {
            fillColor: '#10B98140',
            outlineColor: '#10B981'
        }
    }
});
```

## Event Handling

```typescript
drawControl.on('draw.create', (e) => {
    console.log('Feature created:', e.features);
});

drawControl.on('draw.update', (e) => {
    console.log('Feature updated:', e.features);
});

drawControl.on('draw.delete', (e) => {
    console.log('Feature deleted:', e.features);
});
```

**Next:** [Production Practices](production.md)