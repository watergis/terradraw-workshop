import type { Map } from 'maplibre-gl';
import { MaplibreTerradrawControl } from '@watergis/maplibre-gl-terradraw';

// The MapLibre map is already created for you as `map` (see Getting Started).
declare const map: Map;

const drawControl = new MaplibreTerradrawControl({
	// Choose which buttons are shown, in order
	modes: [
		'point',
		'linestring',
		'polyline',
		'polygon',
		'rectangle',
		'circle',
		'freehand',
		'text',
		'select',
		'delete-selection',
		'delete',
		'undo',
		'redo',
		'download'
	],
	// Start with the toolbar expanded
	open: true
});
map.addControl(drawControl, 'top-left');

// All Terra Draw APIs are still accessible through the plugin
const draw = drawControl.getTerraDrawInstance();
draw.on('finish', (id) => {
	console.log(`finish: ${id}`);
});
