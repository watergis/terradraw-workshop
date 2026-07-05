import type { Map } from 'maplibre-gl';
import {
	TerraDraw,
	TerraDrawPointMode,
	TerraDrawLineStringMode,
	TerraDrawPolyLineMode,
	TerraDrawPolygonMode
} from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

// The MapLibre map is already created for you as `map` (see Getting Started).
declare const map: Map;

// Helper to add a button to the sidebar on the left of the map.
// (In the local SvelteKit template, add <button> elements to the
// <aside class="sidebar"> instead.)
const sidebar = document.getElementById('sidebar') as HTMLDivElement;
const addButton = (label: string, onClick: () => void): HTMLButtonElement => {
	const button = document.createElement('button');
	button.textContent = label;
	button.addEventListener('click', onClick);
	sidebar.appendChild(button);
	return button;
};

const draw = new TerraDraw({
	adapter: new TerraDrawMapLibreGLAdapter({ map }),
	modes: [
		new TerraDrawPointMode(),
		new TerraDrawLineStringMode(),
		// Polyline mode (new in Terra Draw v1.31): draws a linestring, but
		// clicking its first point closes it off into a polygon.
		new TerraDrawPolyLineMode(),
		new TerraDrawPolygonMode()
	]
});

map.once('load', () => {
	// Start drawing, but without selecting a drawing tool automatically
	draw.start();
});

const handleModeClick = (mode: string) => {
	draw.setMode(mode);
};

addButton('Point', () => handleModeClick('point'));
addButton('Line', () => handleModeClick('linestring'));
addButton('Polyline', () => handleModeClick('polyline'));
addButton('Polygon', () => handleModeClick('polygon'));
addButton('Clear', () => draw.clear());
