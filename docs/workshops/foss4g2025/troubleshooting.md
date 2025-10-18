# Troubleshooting

This section covers common issues you might encounter when working with Terra Draw and their solutions.

## Common Issues and Solutions

### 1. Import/Module Issues

**Problem**: Terra Draw modules not importing correctly

**Solution**:
```typescript
// ESM imports (recommended for Vite/modern bundlers)
import { TerraDraw } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
import { TerraDrawPointMode, TerraDrawPolygonMode } from 'terra-draw';

// CommonJS (if needed for older Node.js environments)
const { TerraDraw } = require('terra-draw');
```

### 2. Map Not Showing Drawings

**Problem**: Features drawn but not visible on map

**Solutions**:
```typescript
// Ensure map is loaded before initializing Terra Draw
map.on('load', () => {
    const draw = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map }),
        modes: [new TerraDrawPointMode()]
    });
    draw.start(); // Don't forget to start!
});

// Check if adapter is correctly initialized
if (draw.adapter) {
    console.log('Adapter initialized successfully');
} else {
    console.error('Adapter initialization failed');
}
```

### 3. Styling Not Applied

**Problem**: Custom styles not appearing

**Solution**:
```typescript
// Ensure styles are in correct format
const mode = new TerraDrawPolygonMode({
    styles: {
        fillColor: '#FF0000', // Use hex format
        outlineColor: '#00FF00', // Not CSS color names
        outlineWidth: 2 // Use numbers, not strings
    }
});

// Check for typos in style property names
// ✓ Correct: fillColor, outlineColor, pointColor
// ✗ Wrong: fill-color, outline-color, point-color
```

### 4. Events Not Firing

**Problem**: Event listeners not triggering

**Solution**:
```typescript
// Add event listeners after draw.start()
draw.start();

draw.on('draw', (event) => {
    console.log('Feature drawn:', event);
});

// Check event names are correct
// ✓ Correct: 'draw', 'change', 'select', 'deselect', 'mode'
// ✗ Wrong: 'drawn', 'changed', 'selected', 'deselected'

// Ensure proper TypeScript types if using TypeScript
draw.on('change', (event: any) => {
    // Handle event
});
```

### 5. Performance Issues

**Problem**: Slow performance with many features

**Solutions**:
```typescript
// Use coordinate precision to reduce data size
const adapter = new TerraDrawMapLibreGLAdapter({ 
    map,
    coordinatePrecision: 6 // Default is higher precision
});

// Debounce change events
let timeout: number;
draw.on('change', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        updateUI();
    }, 100);
});

// Clear unused features periodically
const features = draw.getSnapshot();
if (features.length > 1000) {
    // Remove older features
    const oldFeatureIds = features.slice(0, -500).map(f => f.id).filter(Boolean);
    draw.removeFeatures(oldFeatureIds);
}
```

### 6. TypeScript Errors

**Problem**: TypeScript compilation errors

**Solutions**:
```typescript
// Install type definitions
npm install --save-dev @types/geojson

// Use proper type assertions
const features = draw.getSnapshot() as GeoJSON.Feature[];

// Define proper interfaces
interface TerraDrrawFeatureProperties {
    mode: string;
    [key: string]: any;
}

// Handle optional properties
const featureId = feature.id ?? 'unknown';
```

### 7. Vite Build Issues

**Problem**: Build fails with Vite

**Solutions**:
```typescript
// Add to vite.config.ts if needed
export default {
    define: {
        global: 'globalThis',
    },
    optimizeDeps: {
        include: ['terra-draw', 'maplibre-gl']
    }
};

// For Node.js polyfills (if required)
npm install --save-dev @types/node
```

### 8. Mode Not Working

**Problem**: Specific drawing modes not functioning

**Solutions**:
```typescript
// Ensure mode is properly imported and instantiated
import { TerraDrawRectangleMode } from 'terra-draw';

const draw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map }),
    modes: [
        new TerraDrawRectangleMode(), // Create instance with 'new'
        new TerraDrawSelectMode()
    ]
});

// Check mode is available
const availableModes = draw.getMode();
console.log('Available modes:', availableModes);
```

### 9. Feature Selection Issues

**Problem**: Cannot select or edit features

**Solutions**:
```typescript
// Ensure SelectMode is included
const draw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map }),
    modes: [
        new TerraDrawPointMode(),
        new TerraDrawSelectMode() // Required for selection
    ]
});

// Switch to select mode
draw.setMode('select');

// Check if features are selectable
const selectMode = new TerraDrawSelectMode({
    flags: {
        arbitary: {
            feature: {
                draggable: true,
                rotateable: true,
                scaleable: true
            }
        }
    }
});
```

### 10. Map Library Integration Issues

**Problem**: Adapter not working with specific map library version

**Solutions**:
```typescript
// Check compatibility
// MapLibre GL JS: v4, v5 supported
// Leaflet: v1.x supported
// OpenLayers: v10 supported

// Install correct versions
npm install maplibre-gl@^4.7.0
npm install terra-draw-maplibre-gl-adapter

// Verify map is properly initialized before creating adapter
if (map.isStyleLoaded && map.isStyleLoaded()) {
    // Safe to initialize Terra Draw
    const draw = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map })
    });
}
```

## Debugging Tips

### Enable Debug Mode

```typescript
// Enable console logging for debugging
const draw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map }),
    modes: [new TerraDrawPointMode()],
    debug: true // Enable debug mode if available
});

// Log all events for debugging
draw.on('*', (event) => {
    console.log('Terra Draw event:', event);
});
```

### Check Browser Console

Always check the browser console for errors:

1. Open Developer Tools (F12)
2. Check Console tab for errors
3. Look for network errors in Network tab
4. Check if all resources loaded correctly

### Verify Feature Data

```typescript
// Log feature data to understand structure
draw.on('change', () => {
    const features = draw.getSnapshot();
    console.log('Current features:', JSON.stringify(features, null, 2));
});

// Validate GeoJSON structure
const isValidGeoJSON = (feature: any) => {
    return feature.type === 'Feature' 
        && feature.geometry 
        && feature.properties 
        && feature.properties.mode;
};
```

## Getting Help

### Official Resources

- **Documentation**: [Official Terra Draw Docs](https://jameslmilner.github.io/terra-draw/)
- **GitHub Repository**: [terra-draw](https://github.com/JamesLMilner/terra-draw)
- **GitHub Issues**: [Report bugs or ask questions](https://github.com/JamesLMilner/terra-draw/issues)
- **Examples**: [Code examples](https://github.com/JamesLMilner/terra-draw/tree/main/examples)

### maplibre-gl-terradraw Resources

- **Documentation**: [https://terradraw.water-gis.com](https://terradraw.water-gis.com)
- **GitHub Repository**: [maplibre-gl-terradraw](https://github.com/watergis/maplibre-gl-terradraw)

### Community Support

- **Discussions**: Use GitHub Discussions for general questions
- **Stack Overflow**: Tag questions with `terra-draw`
- **MapLibre Community**: [MapLibre Slack](https://slack.maplibre.org/)

### Reporting Issues

When reporting issues, include:

1. **Environment details**: Browser, Node.js version, library versions
2. **Code example**: Minimal reproducible code
3. **Error messages**: Complete error logs from console
4. **Expected vs actual behavior**: Clear description
5. **Screenshots**: If UI-related

Example issue report template:
```
**Environment:**
- Browser: Chrome 120
- Terra Draw: 1.0.0
- MapLibre GL JS: 4.7.1
- Node.js: 22.0.0

**Issue:**
Features are not visible after drawing

**Code:**
[Minimal code example]

**Error:**
[Complete error message]

**Expected:**
Features should be visible on the map

**Actual:**
No features appear after drawing
```

## Workshop Wrap-up

### What We've Covered

1. **Environment Setup** - Modern development with Vite and TypeScript
2. **Terra Draw Basics** - Core concepts and first implementation
3. **Advanced Features** - Custom styling, events, and data management
4. **MapLibre Integration** - Using maplibre-gl-terradraw plugin
5. **Multi-library Support** - Working with different mapping libraries
6. **Troubleshooting** - Common issues and solutions

### Key Takeaways

- Terra Draw provides a **unified API** across all major web mapping libraries
- The **adapter pattern** makes it easy to switch between mapping libraries
- **Modern tooling** like Vite and TypeScript improves developer experience
- **Official documentation** should always be your primary reference
- **Community resources** are available for additional support

### Next Steps

1. **Experiment** with different mapping libraries using Terra Draw
2. **Build** a complete application using the patterns shown
3. **Contribute** to the Terra Draw ecosystem
4. **Stay updated** with new features and improvements

### Resources for Continued Learning

- **Official Documentation**: [jameslmilner.github.io/terra-draw/](https://jameslmilner.github.io/terra-draw/)
- **GitHub Repository**: [github.com/JamesLMilner/terra-draw](https://github.com/JamesLMilner/terra-draw)
- **maplibre-gl-terradraw**: [terradraw.water-gis.com](https://terradraw.water-gis.com)
- **Community**: Join discussions and get help from other developers

Thank you for participating in the Terra Draw workshop at FOSS4G 2025 Auckland!