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

const draw = new TerraDraw({
	adapter: new TerraDrawMapLibreGLAdapter({ map }),
	modes: [
		new TerraDrawPointMode({
			styles: {
				pointColor: '#FFFFFF',
				pointWidth: 5,
				pointOutlineColor: '#FF0000',
				pointOutlineWidth: 1
			}
		}),
		new TerraDrawLineStringMode({
			styles: {
				lineStringColor: '#FF0000',
				lineStringWidth: 2,
				// Semi-transparent line (opacity styling, added in v1.24)
				lineStringOpacity: 0.8,
				// Dashed line: 2px dash followed by a 2px gap (added in v1.30)
				lineStringDash: [2, 2],
				closingPointColor: '#FFFFFF',
				closingPointWidth: 3,
				closingPointOutlineColor: '#FF0000',
				closingPointOutlineWidth: 1
			}
		}),
		new TerraDrawPolygonMode({
			styles: {
				fillColor: '#FFFFFF',
				fillOpacity: 0.7,
				outlineColor: '#FF0000',
				outlineWidth: 2,
				closingPointColor: '#FFFFFF',
				closingPointWidth: 3,
				closingPointOutlineColor: '#FF0000',
				closingPointOutlineWidth: 1
			}
		}),
		new TerraDrawSelectMode({
			// Add custom style for select mode
			styles: {
				// Point colour
				selectedPointColor: '#FF0000',
				selectedPointWidth: 7,
				selectedPointOutlineColor: '#FFFF00',
				selectedPointOutlineWidth: 2,
				// LineString colour
				selectedLineStringColor: '#FFFF00',
				selectedLineStringWidth: 4,
				// Polygon colour
				selectedPolygonColor: '#FF0000',
				selectedPolygonFillOpacity: 0.7,
				selectedPolygonOutlineColor: '#FFFF00',
				selectedPolygonOutlineWidth: 4,
				// Selection point colour
				selectionPointColor: '#FF0000',
				selectionPointWidth: 8,
				selectionPointOutlineColor: '#FFFF00',
				selectionPointOutlineWidth: 2,
				// Midpoint colour
				midPointColor: '#FF0000',
				midPointWidth: 6,
				midPointOutlineColor: '#FFFF00',
				midPointOutlineWidth: 2
			},
			flags: {
				point: {
					feature: {
						draggable: true
					}
				},
				linestring: {
					feature: {
						draggable: true,
						coordinates: {
							midpoints: true,
							draggable: true,
							deletable: true
						}
					}
				},
				polygon: {
					feature: {
						draggable: true,
						coordinates: {
							midpoints: true,
							draggable: true,
							deletable: true
						}
					}
				}
			}
		})
	]
});

map.once('load', () => {
	draw.start();
});

const handleModeClick = (mode: string) => {
	draw.setMode(mode);
};

addButton('Point', () => handleModeClick('point'));
addButton('Line', () => handleModeClick('linestring'));
addButton('Polygon', () => handleModeClick('polygon'));
addButton('Clear', () => draw.clear());
addButton('Select', () => handleModeClick('select'));
