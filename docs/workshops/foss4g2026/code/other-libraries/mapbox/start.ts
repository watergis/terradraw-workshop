import mapboxgl from 'mapbox-gl';
import {
	TerraDraw,
	TerraDrawPointMode,
	TerraDrawLineStringMode,
	TerraDrawPolygonMode,
	TerraDrawSelectMode
} from 'terra-draw';
import { TerraDrawMapboxGLAdapter } from 'terra-draw-mapbox-gl-adapter';

// ---- Library-specific part 1: create the map --------------------------
// Mapbox GL JS requires an access token. In this live editor the token is
// injected at build time; in your own app, set your own token here.
mapboxgl.accessToken = '__MAPBOX_ACCESS_TOKEN__';

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v12',
	center: [132.4553, 34.3966], // Mapbox uses [lng, lat], like MapLibre
	zoom: 12
});

// ---- Terra Draw: identical for every mapping library ------------------
const draw = new TerraDraw({
	// ---- Library-specific part 2: the adapter --------------------------
	adapter: new TerraDrawMapboxGLAdapter({ map }),
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
// Just like MapLibre: wait for the `load` event.
map.once('load', () => {
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
