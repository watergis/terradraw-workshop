import * as Cesium from 'cesium';
import {
	TerraDraw,
	TerraDrawPointMode,
	TerraDrawLineStringMode,
	TerraDrawPolygonMode,
	TerraDrawSelectMode
} from 'terra-draw';
import { TerraDrawCesiumAdapter } from '@watergis/terra-draw-cesium-adapter';

// ---- Library-specific part 1: create the viewer -----------------------
// Cesium's imagery and terrain come from Cesium ion, which requires an
// access token. In this live editor the token is injected at build time;
// in your own app, set your own token here.
Cesium.Ion.defaultAccessToken = '__CESIUM_ION_ACCESS_TOKEN__';

const viewer = new Cesium.Viewer('map', {
	// ion world imagery is the default base layer; ion also provides the
	// global 3D terrain, which is what makes this a real 3D globe.
	terrain: Cesium.Terrain.fromWorldTerrain(),
	// Cesium's built-in widgets are all on by default. Two are turned off
	// because they fight with drawing: the info box and the selection
	// indicator both react to clicking a feature. The geocoder is off too,
	// since searching needs a token with the `geocode` scope.
	infoBox: false,
	selectionIndicator: false,
	geocoder: false
});

// Cesium has no zoom level: the camera is placed in 3D space, at a height
// in metres, and tilted with `pitch` so the terrain is visible.
viewer.camera.setView({
	destination: Cesium.Cartesian3.fromDegrees(132.4553, 34.28, 25000), // [lng, lat, height]
	orientation: {
		heading: 0, // looking north, towards Hiroshima
		pitch: Cesium.Math.toRadians(-50),
		roll: 0
	}
});

// ---- Terra Draw: identical for every mapping library ------------------
const draw = new TerraDraw({
	// ---- Library-specific part 2: the adapter --------------------------
	// The adapter never imports Cesium itself: the whole namespace is
	// injected via `lib`, and `map` is the Viewer.
	adapter: new TerraDrawCesiumAdapter({
		map: viewer,
		lib: Cesium
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
// A Cesium Viewer is usable as soon as it is constructed, so there is no
// load event to wait for.
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
