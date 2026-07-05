import EsriMap from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import Basemap from '@arcgis/core/Basemap.js';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import Graphic from '@arcgis/core/Graphic.js';
import Point from '@arcgis/core/geometry/Point.js';
import Polyline from '@arcgis/core/geometry/Polyline.js';
import Polygon from '@arcgis/core/geometry/Polygon.js';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol.js';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol.js';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol.js';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol.js';
import Color from '@arcgis/core/Color.js';
import {
	TerraDraw,
	TerraDrawPointMode,
	TerraDrawLineStringMode,
	TerraDrawPolygonMode,
	TerraDrawSelectMode
} from 'terra-draw';
import { TerraDrawArcGISMapsSDKAdapter } from 'terra-draw-arcgis-adapter';

// ---- Library-specific part 1: create the map --------------------------
// A raster basemap that works without an API key (Esri basemaps need one).
const basemap = new Basemap({
	baseLayers: [
		new WebTileLayer({
			urlTemplate: 'https://basemaps.cartocdn.com/rastertiles/voyager/{level}/{col}/{row}.png',
			copyright: '&copy; OpenStreetMap contributors &copy; CARTO'
		})
	]
});
const map = new EsriMap({ basemap });
const view = new MapView({
	container: 'map',
	map,
	center: [132.4553, 34.3966], // ArcGIS uses [lng, lat]
	zoom: 12
});

// ---- Terra Draw: identical for every mapping library ------------------
const draw = new TerraDraw({
	// ---- Library-specific part 2: the adapter --------------------------
	// ArcGIS is fully modular, so the adapter receives the classes it
	// needs via `lib`. Note that the adapter wraps the *view*, not the map.
	adapter: new TerraDrawArcGISMapsSDKAdapter({
		lib: {
			GraphicsLayer,
			Graphic,
			Point,
			Polyline,
			Polygon,
			SimpleLineSymbol,
			SimpleFillSymbol,
			SimpleMarkerSymbol,
			PictureMarkerSymbol,
			Color
		},
		map: view
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
// Wait until the MapView is ready.
view.when(() => {
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
