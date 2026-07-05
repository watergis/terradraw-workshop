import type { Map } from 'maplibre-gl';
import {
	TerraDraw,
	TerraDrawPointMode,
	TerraDrawLineStringMode,
	TerraDrawPolyLineMode,
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
		new TerraDrawPointMode(),
		new TerraDrawLineStringMode(),
		new TerraDrawPolyLineMode(),
		new TerraDrawPolygonMode(),
		// Add select mode with feature and coordinate editing enabled
		new TerraDrawSelectMode({
			// Allow selecting a feature just by clicking it, even while
			// another select interaction is active (added in v1.27)
			allowManualSelection: true,
			flags: {
				point: {
					feature: {
						draggable: true
					}
				},
				linestring: {
					feature: {
						draggable: true,
						rotateable: true,
						coordinates: {
							midpoints: true,
							draggable: true,
							deletable: true
						}
					}
				},
				// Features drawn with polyline mode keep `mode: 'polyline'`,
				// so they need their own flags to be editable
				polyline: {
					feature: {
						draggable: true,
						rotateable: true,
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
						rotateable: true,
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
addButton('Polyline', () => handleModeClick('polyline'));
addButton('Polygon', () => handleModeClick('polygon'));
addButton('Clear', () => draw.clear());
addButton('Select', () => handleModeClick('select'));
