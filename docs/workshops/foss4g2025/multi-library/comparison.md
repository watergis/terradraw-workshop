# Library Comparison

Understanding the differences and similarities when using Terra Draw across mapping libraries.

## Implementation Comparison

| Aspect | MapLibre | Leaflet | OpenLayers |
|--------|----------|---------|-------------|
| **Map Setup** | `new maplibregl.Map()` | `L.map()` | `new Map()` |
| **Adapter** | `TerraDrawMapLibreGLAdapter` | `TerraDrawLeafletAdapter` | `TerraDrawOpenLayersAdapter` |
| **Terra Draw API** | Identical | Identical | Identical |
| **Styling** | Universal | Universal | Universal |
| **Events** | Universal | Universal | Universal |

## Key Benefits of Terra Draw

### 1. Consistent API
```typescript
// Same code works across all libraries
draw.setMode('polygon');
draw.on('draw', handleDraw);
const features = draw.getSnapshot();
```

### 2. Universal Styling
```typescript
// Identical styling configuration
const polygonMode = new TerraDrawPolygonMode({
    styles: {
        fillColor: '#10B98140',
        outlineColor: '#10B981'
    }
});
```

### 3. Same Event System
```typescript
// Events work identically across libraries
draw.on('draw', (event) => {
    console.log('Feature created:', event.feature);
});
```

## When to Choose Each Library

### MapLibre GL JS
- **Best for**: High-performance vector maps, WebGL rendering
- **Use when**: Need smooth pan/zoom, large datasets, custom styling

### Leaflet
- **Best for**: Simple maps, broad compatibility, quick setup
- **Use when**: Need wide browser support, simple requirements

### OpenLayers
- **Best for**: Complex GIS applications, advanced projections
- **Use when**: Need advanced mapping features, projection support

## Migration Between Libraries

Thanks to Terra Draw's adapter pattern, switching between libraries requires only:

1. **Change the map initialization code**
2. **Switch the adapter import**
3. **Update adapter instantiation**
4. **Keep all Terra Draw code unchanged!**

**Next:** [Exercise 6 - Multi-library](exercise-6.md)