# OpenLayers Example

Learn how to use Terra Draw with OpenLayers using the same drawing API.

## Installation

```bash
npm install ol terra-draw terra-draw-openlayers-adapter
```

## OpenLayers Implementation

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
    TerraDrawLineStringMode,
    TerraDrawPolygonMode,
    TerraDrawSelectMode
} from 'terra-draw';

// Initialize OpenLayers map
const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat([174.7645, -36.8485]),
        zoom: 10
    })
});

// Create Terra Draw instance with OpenLayers adapter
const draw = new TerraDraw({
    adapter: new TerraDrawOpenLayersAdapter({ map }),
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

- **Map setup** - Uses OpenLayers Map, View, and Layer classes
- **Coordinate system** - Uses `fromLonLat()` for coordinate transformation
- **Adapter** - Uses `TerraDrawOpenLayersAdapter`
- **Drawing logic** - Identical Terra Draw code!

**Next:** [Universal Component](universal.md)