# Exercise 7: Undo / Redo

Undo/redo support was one of the most requested Terra Draw features and was
added in **v1.26**. In this exercise we enable the history and wire it up to
UI buttons and keyboard shortcuts.

## How Terra Draw history works

The history is opt-in and configured through the `undoRedo` option of the
`TerraDraw` constructor. It has two levels:

- **Mode level** (`TerraDrawModeUndoRedo`): tracks the steps *while you are
  drawing a feature* — for example, undoing removes the last coordinate you
  clicked in polygon mode.
- **Session level** (`TerraDrawSessionUndoRedo`): tracks *completed changes* —
  for example, undoing removes the whole feature you just finished drawing.

You can enable either or both. There is also an optional keyboard shortcut
handler (`TerraDrawUndoRedoKeyboardShortcuts`) which by default binds
`Ctrl/Cmd + Z` to undo and `Ctrl/Cmd + Shift + Z` to redo.

```ts
import {
    TerraDraw,
    TerraDrawModeUndoRedo,
    TerraDrawSessionUndoRedo,
    TerraDrawUndoRedoKeyboardShortcuts
} from 'terra-draw';

const draw = new TerraDraw({
    adapter,
    modes,
    undoRedo: {
        modeLevel: new TerraDrawModeUndoRedo({ maxStackSize: 100 }),
        sessionLevel: new TerraDrawSessionUndoRedo({ maxStackSize: 100 }),
        keyboardShortcuts: new TerraDrawUndoRedoKeyboardShortcuts()
    }
});
```

Once enabled, the Terra Draw instance exposes the following methods:

| Method | Description |
| --- | --- |
| `draw.undo()` | Undo the last change; returns `true` if something was undone |
| `draw.redo()` | Redo the last undone change |
| `draw.canUndo()` | Whether there is anything to undo |
| `draw.canRedo()` | Whether there is anything to redo |
| `draw.clearUndoRedoHistory()` | Empty both stacks (features are kept) |

## The `history` event

Whenever the undo/redo stacks change, Terra Draw dispatches a `history`
event. This is the right place to enable or disable your Undo/Redo buttons:

```ts
draw.on('history', (event) => {
    // event.cause is 'push', 'undo' or 'redo'
    // event.stack is 'mode' or 'session'
    undoButton.disabled = !draw.canUndo();
    redoButton.disabled = !draw.canRedo();
});
```

## Try it in the live editor

Complete the three TODOs: enable the history, add **Undo** / **Redo**
buttons, and keep them in sync via the `history` event. Then draw a few
polygons and try `Ctrl/Cmd + Z` while drawing (mode level) and after
finishing a shape (session level).

<terra-draw-editor start="../../code/exercise-7/start.ts" answer="../../code/exercise-7/answer.ts" height="520"></terra-draw-editor>

### Testing Your Implementation

1. **Undo while drawing** - start a polygon, click a few coordinates, then press `Ctrl/Cmd + Z`: the last coordinate is removed
1. **Undo a finished feature** - finish a polygon, then click `Undo`: the whole polygon disappears
1. **Redo** - click `Redo` (or `Ctrl/Cmd + Shift + Z`) to bring it back
1. **Button states** - confirm the buttons are disabled when there is nothing to undo/redo
1. **Clear history** - click `Clear history` and confirm both buttons become disabled while the drawn features remain

### Extra challenge

- Set `maxStackSize` to a small number like `3` and observe what happens to
  older history entries.
- Enable **only** the session level and observe how undo behaves while
  drawing.

## What's Next?

You have now mastered the core functionality of Terra Draw with MapLibre GL JS. Next, let's see how the maplibre-gl-terradraw plugin gives you all of this with just a few lines of code.

[Continue to the MapLibre Terra Draw plugin](../maplibre-gl-terradraw.md)
