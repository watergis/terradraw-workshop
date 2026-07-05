import type { Map } from 'maplibre-gl';
import {
	TerraDraw,
	TerraDrawPointMode,
	TerraDrawLineStringMode,
	TerraDrawPolygonMode
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
	modes: [new TerraDrawPointMode(), new TerraDrawLineStringMode(), new TerraDrawPolygonMode()]
	// 1. Enable the undo/redo history (new in Terra Draw v1.26) by
	//    passing the `undoRedo` option with mode level, session level
	//    and keyboard shortcut handlers.
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

// 2. Add "Undo" and "Redo" buttons calling draw.undo() / draw.redo().

// 3. Listen to the `history` event and disable the buttons when
//    draw.canUndo() / draw.canRedo() return false.
