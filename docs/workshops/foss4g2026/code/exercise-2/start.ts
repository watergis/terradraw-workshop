import type { Map } from 'maplibre-gl';
import { TerraDraw, TerraDrawRectangleMode } from 'terra-draw';
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

// 1. Replace the rectangle mode with point, linestring, polyline and
//    polygon modes.
const draw = new TerraDraw({
	adapter: new TerraDrawMapLibreGLAdapter({ map }),
	modes: [new TerraDrawRectangleMode()]
});

map.once('load', () => {
	draw.start();
	draw.setMode('rectangle');
});

// 2. Add a button for each mode using addButton(label, onClick),
//    and a "Clear" button that removes all features.
