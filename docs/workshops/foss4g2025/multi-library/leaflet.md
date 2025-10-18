# Leaflet Example

Learn how to use Terra Draw with Leaflet using the same drawing logic.

## Installation

```bash
npm install leaflet terra-draw terra-draw-leaflet-adapter
npm install --save-dev @types/leaflet
```

## Leaflet Implementation

```typescript
import L from 'leaflet';
import { TerraDraw } from 'terra-draw';
import { TerraDrawLeafletAdapter } from 'terra-draw-leaflet-adapter';
import {
    TerraDrawPointMode,
    TerraDrawLineStringMode,
    TerraDrawPolygonMode,
    TerraDrawSelectMode
} from 'terra-draw';

// Initialize Leaflet map
const map = L.map('map').setView([-36.8485, 174.7645], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create Terra Draw instance with Leaflet adapter
const draw = new TerraDraw({
    adapter: new TerraDrawLeafletAdapter({ map }),
    modes: [
        new TerraDrawPointMode(),
        new TerraDrawLineStringMode(),
        new TerraDrawPolygonMode(),
        new TerraDrawSelectMode()
    ]
});

// Start Terra Draw
draw.start();
```

## Key Differences

- **Map initialization** - Uses Leaflet's `L.map()` instead of MapLibre
- **Tile layers** - Uses Leaflet tile layer syntax
- **Adapter** - Uses `TerraDrawLeafletAdapter` instead of MapLibre adapter
- **Drawing logic** - Identical Terra Draw code!

**Next:** [OpenLayers Example](openlayers.md)