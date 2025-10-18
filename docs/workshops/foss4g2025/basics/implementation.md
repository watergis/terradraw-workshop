# First Terra Draw Implementation

Let's create a basic Terra Draw setup with MapLibre GL JS. Update your `src/main.ts`:

```typescript
import './style.css'
import maplibregl from 'maplibre-gl';
import { TerraDraw } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
import { 
    TerraDrawPointMode,
    TerraDrawLineStringMode,
    TerraDrawPolygonMode,
    TerraDrawSelectMode
} from 'terra-draw';

// Initialize map
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://demotiles.maplibre.org/style.json',
    center: [174.7645, -36.8485],
    zoom: 10
});

let draw: TerraDraw;

// Wait for map to load
map.on('load', () => {
    // Create Terra Draw instance
    draw = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map }),
        modes: [
            new TerraDrawPointMode(),
            new TerraDrawLineStringMode(),
            new TerraDrawPolygonMode(),
            new TerraDrawSelectMode()
        ]
    });

    // Start Terra Draw
    draw.start();

    // Set initial mode
    draw.setMode('point');

    // Button event listeners
    const pointBtn = document.getElementById('point-mode') as HTMLButtonElement;
    const lineBtn = document.getElementById('line-mode') as HTMLButtonElement;
    const polygonBtn = document.getElementById('polygon-mode') as HTMLButtonElement;
    const selectBtn = document.getElementById('select-mode') as HTMLButtonElement;
    const clearBtn = document.getElementById('clear') as HTMLButtonElement;

    pointBtn?.addEventListener('click', () => {
        draw.setMode('point');
        updateActiveButton('point-mode');
    });

    lineBtn?.addEventListener('click', () => {
        draw.setMode('linestring');
        updateActiveButton('line-mode');
    });

    polygonBtn?.addEventListener('click', () => {
        draw.setMode('polygon');
        updateActiveButton('polygon-mode');
    });

    selectBtn?.addEventListener('click', () => {
        draw.setMode('select');
        updateActiveButton('select-mode');
    });

    clearBtn?.addEventListener('click', () => {
        draw.clear();
    });

    // Set initial active button
    updateActiveButton('point-mode');
});

function updateActiveButton(activeId: string) {
    const buttons = document.querySelectorAll('.controls button');
    buttons.forEach(button => button.classList.remove('active'));
    document.getElementById(activeId)?.classList.add('active');
}
```

## Testing Your Implementation

1. **Save your changes** and the Vite development server should automatically reload
2. **Open your browser** to `http://localhost:5173`
3. **Try clicking the different mode buttons** - you should see them become active
4. **Test drawing** - click on the map to create points, lines, and polygons
5. **Try select mode** - click and drag existing features to modify them

## What's Next?

Now that you have a working Terra Draw implementation, let's understand the different drawing modes in detail.

**Next:** [Understanding Modes](modes.md)