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

// Keep track of the currently selected feature id
let selectedFeatureId: TerraDrawExtend.FeatureId | undefined;

map.once('load', () => {
	draw.start();

	draw.on('select', (id: TerraDrawExtend.FeatureId) => {
		selectedFeatureId = id;
	});
	draw.on('deselect', () => {
		selectedFeatureId = undefined;
	});

	// Add a default point feature at the Atomic Bomb Dome in Hiroshima
	draw.addFeatures([
		{
			id: '39d86739-6012-40ae-bb8c-3cb0f0694b92',
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [132.45361, 34.39556]
			},
			properties: {
				// `mode` must exist in the properties and the corresponding
				// mode must be registered in the Terra Draw instance
				mode: 'point'
			}
		}
	]);
});

const handleModeClick = (mode: string) => {
	draw.setMode(mode);
};

addButton('Point', () => handleModeClick('point'));
addButton('Line', () => handleModeClick('linestring'));
addButton('Polygon', () => handleModeClick('polygon'));
addButton('Clear', () => draw.clear());
addButton('Select', () => handleModeClick('select'));

// Remove the selected feature from the store
addButton('Delete', () => {
	if (selectedFeatureId !== undefined) {
		draw.removeFeatures([selectedFeatureId]);
		selectedFeatureId = undefined;
	}
});
