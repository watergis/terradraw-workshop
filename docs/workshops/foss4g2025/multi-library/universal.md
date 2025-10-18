# Universal Drawing Component

Create a drawing component that works with any mapping library.

## Universal Drawing Interface

```typescript
interface UniversalDrawingConfig {
    mapInstance: any;
    mapType: 'maplibre' | 'leaflet' | 'openlayers';
    modes?: string[];
}

class UniversalDrawing {
    private draw: TerraDraw;
    
    constructor(config: UniversalDrawingConfig) {
        const adapter = this.createAdapter(config.mapInstance, config.mapType);
        
        this.draw = new TerraDraw({
            adapter,
            modes: this.createModes(config.modes || ['point', 'polygon', 'select'])
        });
    }
    
    private createAdapter(mapInstance: any, mapType: string) {
        switch (mapType) {
            case 'maplibre':
                return new TerraDrawMapLibreGLAdapter({ map: mapInstance });
            case 'leaflet':
                return new TerraDrawLeafletAdapter({ map: mapInstance });
            case 'openlayers':
                return new TerraDrawOpenLayersAdapter({ map: mapInstance });
            default:
                throw new Error(`Unsupported map type: ${mapType}`);
        }
    }
    
    private createModes(modeNames: string[]) {
        const modeMap = {
            'point': TerraDrawPointMode,
            'linestring': TerraDrawLineStringMode,
            'polygon': TerraDrawPolygonMode,
            'rectangle': TerraDrawRectangleMode,
            'select': TerraDrawSelectMode
        };
        
        return modeNames.map(name => new modeMap[name]());
    }
    
    start() {
        this.draw.start();
    }
    
    setMode(mode: string) {
        this.draw.setMode(mode);
    }
    
    getSnapshot() {
        return this.draw.getSnapshot();
    }
    
    on(event: string, callback: Function) {
        this.draw.on(event, callback);
    }
}
```

## Usage with Any Library

```typescript
// MapLibre
const maplibreDrawing = new UniversalDrawing({
    mapInstance: maplibreMap,
    mapType: 'maplibre',
    modes: ['point', 'polygon', 'select']
});

// Leaflet  
const leafletDrawing = new UniversalDrawing({
    mapInstance: leafletMap,
    mapType: 'leaflet',
    modes: ['point', 'polygon', 'select']
});

// OpenLayers
const olDrawing = new UniversalDrawing({
    mapInstance: olMap,
    mapType: 'openlayers',
    modes: ['point', 'polygon', 'select']
});

// Identical API for all!
maplibreDrawing.start();
leafletDrawing.start();
olDrawing.start();
```

**Next:** [Library Comparison](comparison.md)