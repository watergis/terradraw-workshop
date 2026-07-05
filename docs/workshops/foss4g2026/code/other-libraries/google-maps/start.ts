import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import {
	TerraDraw,
	TerraDrawPointMode,
	TerraDrawLineStringMode,
	TerraDrawPolygonMode,
	TerraDrawSelectMode
} from 'terra-draw';
import { TerraDrawGoogleMapsAdapter } from 'terra-draw-google-maps-adapter';

// ---- Library-specific part 1: create the map --------------------------
// Google Maps requires an API key. In this live editor the key is injected
// at build time; in your own app, set your own key here.
setOptions({ key: '__GOOGLE_MAPS_API_KEY__', v: 'weekly' });
const { Map } = await importLibrary('maps');

const map = new Map(document.getElementById('map') as HTMLElement, {
	center: { lat: 34.3966, lng: 132.4553 }, // Google uses { lat, lng }
	zoom: 12,
	clickableIcons: false
});

// ---- Terra Draw: identical for every mapping library ------------------
const draw = new TerraDraw({
	// ---- Library-specific part 2: the adapter --------------------------
	// The adapter receives the google.maps namespace via `lib`.
	adapter: new TerraDrawGoogleMapsAdapter({ lib: google.maps, map }),
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
// Google Maps is ready once the projection is available.
map.addListener('projection_changed', () => {
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
