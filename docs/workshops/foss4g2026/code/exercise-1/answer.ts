import type { Map } from 'maplibre-gl';
import { TerraDraw, TerraDrawRectangleMode } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

// The MapLibre map is already created for you as `map` (see Getting Started).
declare const map: Map;

const draw = new TerraDraw({
	// Using the MapLibre adapter
	adapter: new TerraDrawMapLibreGLAdapter({ map }),

	// Add the rectangle mode
	modes: [new TerraDrawRectangleMode()]
});

// Have to wait for MapLibre to load the map style before starting to draw
map.once('load', () => {
	// Start drawing
	draw.start();
	draw.setMode('rectangle');
});
