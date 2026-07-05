import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { Circle, Fill, Icon, Stroke, Style } from 'ol/style.js';
import { fromLonLat, toLonLat, getUserProjection } from 'ol/proj.js';
import Projection from 'ol/proj/Projection.js';
import {
	TerraDraw,
	TerraDrawPointMode,
	TerraDrawLineStringMode,
	TerraDrawPolygonMode,
	TerraDrawSelectMode
} from 'terra-draw';
import { TerraDrawOpenLayersAdapter } from 'terra-draw-openlayers-adapter';

// ---- Library-specific part 1: create the map --------------------------
// OpenLayers works in Web Mercator internally, so [lng, lat] coordinates
// are converted with fromLonLat().
const map = new Map({
	target: 'map',
	layers: [new TileLayer({ source: new OSM() })],
	view: new View({ center: fromLonLat([132.4553, 34.3966]), zoom: 12 })
});

// ---- Terra Draw: identical for every mapping library ------------------
const draw = new TerraDraw({
	// ---- Library-specific part 2: the adapter --------------------------
	// OpenLayers is fully modular, so the adapter receives the ol classes
	// and functions it needs via `lib`.
	adapter: new TerraDrawOpenLayersAdapter({
		lib: {
			Circle,
			Feature,
			GeoJSON,
			Style,
			VectorLayer,
			VectorSource,
			Stroke,
			Fill,
			Icon,
			getUserProjection,
			Projection,
			fromLonLat,
			toLonLat
		},
		map
	}),
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

// ---- Library-specific part 3: when to start ---------------------------
// Wait until OpenLayers has rendered the first frame.
map.once('rendercomplete', () => {
	draw.start();
	draw.setMode('polygon');

	// A default point feature at the Atomic Bomb Dome in Hiroshima
	draw.addFeatures([
		{
			id: '39d86739-6012-40ae-bb8c-3cb0f0694b92',
			type: 'Feature',
			geometry: { type: 'Point', coordinates: [132.45361, 34.39556] },
			properties: { mode: 'point' }
		}
	]);
});

// ---- UI buttons: also identical for every mapping library -------------
const sidebar = document.getElementById('sidebar') as HTMLDivElement;
const addButton = (label: string, onClick: () => void) => {
	const button = document.createElement('button');
	button.textContent = label;
	button.addEventListener('click', onClick);
	sidebar.appendChild(button);
};
addButton('point', () => draw.setMode('point'));
addButton('linestring', () => draw.setMode('linestring'));
addButton('polygon', () => draw.setMode('polygon'));
addButton('select', () => draw.setMode('select'));
addButton('clear', () => draw.clear());
