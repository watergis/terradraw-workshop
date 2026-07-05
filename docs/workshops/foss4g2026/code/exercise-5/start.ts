import type { Map } from 'maplibre-gl';
import {
	TerraDraw,
	TerraDrawPointMode,
	TerraDrawLineStringMode,
	TerraDrawPolygonMode,
	TerraDrawSelectMode
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

	// 1. Listen to the `change` event and log created / updated /
	//    deleted feature ids to the console.

	// 2. Listen to the `finish` event and log the finished action
	//    and mode.

	// 3. Listen to the `select` event and show the selected feature's
	//    GeoJSON in `selectedFeatureArea.value`
	//    (hint: draw.getSnapshotFeature(id)).

	// 4. Listen to the `deselect` event and clear the textarea.
});

const handleModeClick = (mode: string) => {
	draw.setMode(mode);
};

addButton('Point', () => handleModeClick('point'));
addButton('Line', () => handleModeClick('linestring'));
addButton('Polygon', () => handleModeClick('polygon'));
addButton('Clear', () => draw.clear());
addButton('Select', () => handleModeClick('select'));
