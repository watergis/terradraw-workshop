import type { Map } from 'maplibre-gl';
import {
	TerraDraw,
	TerraDrawPointMode,
	TerraDrawLineStringMode,
	TerraDrawPolygonMode,
	TerraDrawModeUndoRedo,
	TerraDrawSessionUndoRedo,
	TerraDrawUndoRedoKeyboardShortcuts
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
	modes: [new TerraDrawPointMode(), new TerraDrawLineStringMode(), new TerraDrawPolygonMode()],
	// Enable the undo/redo history (new in Terra Draw v1.26)
	undoRedo: {
		// Mode level: undo/redo single steps while you are drawing a
		// feature (e.g. remove the last clicked coordinate)
		modeLevel: new TerraDrawModeUndoRedo({ maxStackSize: 100 }),
		// Session level: undo/redo completed changes such as finished
		// features
		sessionLevel: new TerraDrawSessionUndoRedo({ maxStackSize: 100 }),
		// Ctrl/Cmd+Z to undo and Ctrl/Cmd+Shift+Z to redo by default
		keyboardShortcuts: new TerraDrawUndoRedoKeyboardShortcuts()
	}
});

const handleModeClick = (mode: string) => {
	draw.setMode(mode);
};

addButton('Point', () => handleModeClick('point'));
addButton('Line', () => handleModeClick('linestring'));
addButton('Polygon', () => handleModeClick('polygon'));
addButton('Clear', () => draw.clear());

const undoButton = addButton('Undo', () => draw.undo());
const redoButton = addButton('Redo', () => draw.redo());
const clearHistoryButton = addButton('Clear history', () => {
	// Empties both undo and redo stacks; drawn features are kept
	draw.clearUndoRedoHistory();
	updateHistoryButtons();
});

// Note: the history methods can only be called after draw.start()
const updateHistoryButtons = () => {
	undoButton.disabled = !draw.canUndo();
	redoButton.disabled = !draw.canRedo();
	clearHistoryButton.disabled = !draw.canUndo() && !draw.canRedo();
};

map.once('load', () => {
	draw.start();
	updateHistoryButtons();

	// The `history` event fires whenever the undo/redo stacks change
	draw.on('history', (event) => {
		console.log(`history: ${event.cause} (${event.stack} stack)`);
		updateHistoryButtons();
	});
});
