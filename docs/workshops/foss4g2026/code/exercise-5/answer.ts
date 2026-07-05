import type { Map } from 'maplibre-gl';
import {
	TerraDraw,
	TerraDrawPointMode,
	TerraDrawLineStringMode,
	TerraDrawPolygonMode,
	TerraDrawSelectMode,
	type TerraDrawExtend
} from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

// The MapLibre map is already created for you as `map` (see Getting Started).
declare const map: Map;

const sidebar = document.getElementById('sidebar') as HTMLDivElement;
const addButton = (label: string, onClick: () => void): HTMLButtonElement => {
	const button = document.createElement('button');
	button.textContent = label;
	button.addEventListener('click', onClick);
	sidebar.appendChild(button);
	return button;
};

// Read-only textarea showing the GeoJSON of the selected feature.
// (In the local SvelteKit template, bind a <textarea> to a $state
// variable instead.)
const selectedFeatureArea = document.createElement('textarea');
selectedFeatureArea.rows = 14;
selectedFeatureArea.readOnly = true;
sidebar.appendChild(selectedFeatureArea);

const draw = new TerraDraw({
	adapter: new TerraDrawMapLibreGLAdapter({ map }),
	modes: [
		new TerraDrawPointMode(),
		new TerraDrawLineStringMode(),
		new TerraDrawPolygonMode(),
		new TerraDrawSelectMode({
			flags: {
				point: { feature: { draggable: true } },
				linestring: {
					feature: {
						draggable: true,
						coordinates: { midpoints: true, draggable: true, deletable: true }
					}
				},
				polygon: {
					feature: {
						draggable: true,
						coordinates: { midpoints: true, draggable: true, deletable: true }
					}
				}
			}
		})
	]
});

map.once('load', () => {
	draw.start();

	draw.on('change', (ids, type) => {
		if (type === 'create') {
			// After creating a feature
			for (const id of ids) {
				console.log(`change: Feature created: ${id}`);
			}
		} else if (type === 'update') {
			// After updating a feature
			for (const id of ids) {
				console.log(`change: Feature updated: ${id}`);
			}
		} else if (type === 'delete') {
			// After deleting a feature
			for (const id of ids) {
				console.log(`change: Feature deleted: ${id}`);
			}
		} else if (type === 'styling') {
			// After styling is changed
			for (const id of ids) {
				console.log(`change: Feature styling updated: ${id}`);
			}
		}
	});

	draw.on('finish', (id: TerraDrawExtend.FeatureId, context: { action: string; mode: string }) => {
		if (context.action === 'draw') {
			// Draw finish event for a feature
			console.log(`finish: Feature drawn: ${id} in mode: ${context.mode}`);
		} else if (context.action === 'dragFeature') {
			// Drag finish event for a feature
			console.log(`finish: Feature dragged: ${id} in mode: ${context.mode}`);
		} else if (context.action === 'dragCoordinate') {
			// Drag finish event for a coordinate
			console.log(`finish: Coordinate dragged in feature: ${id} in mode: ${context.mode}`);
		} else if (context.action === 'dragCoordinateResize') {
			// Drag finish event for resizing a feature
			console.log(`finish: Coordinate resized in feature: ${id} in mode: ${context.mode}`);
		}
	});

	draw.on('select', (id: TerraDrawExtend.FeatureId) => {
		console.log(`selected: ${id}`);
		const feature = draw.getSnapshotFeature(id);
		selectedFeatureArea.value = feature ? JSON.stringify(feature, null, 2) : '';
	});

	draw.on('deselect', () => {
		console.log('deselected');
		selectedFeatureArea.value = '';
	});
});

const handleModeClick = (mode: string) => {
	draw.setMode(mode);
};

addButton('Point', () => handleModeClick('point'));
addButton('Line', () => handleModeClick('linestring'));
addButton('Polygon', () => handleModeClick('polygon'));
addButton('Clear', () => draw.clear());
addButton('Select', () => handleModeClick('select'));
