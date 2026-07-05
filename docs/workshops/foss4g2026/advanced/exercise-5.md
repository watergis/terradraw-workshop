# Exercise 5: Event Handling

Terra Draw provides comprehensive event handling following the [official events documentation](https://github.com/JamesLMilner/terra-draw/blob/main/guides/6.EVENTS.md).

## Terra Draw Events

Terra Draw dispatches the events `change`, `finish`, `select`, `deselect`
and — since the undo/redo feature was added — `history` (covered in
[Exercise 7](./exercise-7.md)).

You can listen to an event through the `on` method like so:

```ts
draw.on("change", () => {
  // Do something
});
```

### `change` event

The `change` event returns `ids` and `type`.

- `ids` is the list of Terra Draw feature IDs affected by the event
- `type` is the type of change event, one of `create`, `update`, `delete` and `styling`

```ts
draw.on("change", (ids, type) => {
  // After creating a feature
  if (type === "create") {
    for (const id of ids) {
        const feature = draw.getSnapshotFeature(id)
        // Do something
    }
  }
});
```

!!! note
    On a `delete` event the feature is already removed from the Terra Draw
    store, so you cannot fetch deleted features by their IDs anymore.

### `finish` event

The `finish` event is dispatched when an interaction with a feature finishes, and it returns `id` and `context`.

- `id` is the Terra Draw feature ID affected by the event
- `context` is an object containing:
  - `mode`: the mode name of the finished feature
  - `action`: one of the four supported actions below

```ts
draw.on("finish", (id: string, context: { action: string, mode: string }) => {
  if (context.action === 'draw') {
    // Do something for draw finish event for a feature
  } else if (context.action === 'dragFeature') {
    // Do something for a drag finish event for a feature
  } else if (context.action === 'dragCoordinate') {
    // Do something for a drag finish event for a coordinate
  } else if (context.action === 'dragCoordinateResize') {
    // Do something for a drag finish event for resizing a feature
  }
});
```

### `select` / `deselect` events

The `select` event is dispatched when a feature is selected by
`TerraDrawSelectMode`, and `deselect` when it is deselected:

```ts
draw.on("select", (id: string) => {
  // Do something
});

draw.on("deselect", () => {
  // Do something
});
```

### Mode state

You can also ask the Terra Draw instance what it is currently doing with
`getModeState()`, which returns states such as `registered`, `started` or
`drawing`. This is useful to make UI decisions based on the current activity:

```ts
console.log(draw.getMode());      // e.g. "polygon"
console.log(draw.getModeState()); // e.g. "drawing"
```

## Try it in the live editor

Complete the four TODOs inside `map.once('load')`: log the `change` and
`finish` events to the console, and show the selected feature's GeoJSON in
the sidebar textarea. Open your browser's developer console (or watch the
console strip under the preview) to see the logs.

<terra-draw-editor start="../../code/exercise-5/start.ts" answer="../../code/exercise-5/answer.ts" height="560"></terra-draw-editor>

## In the local SvelteKit template

In the template, use a reactive `$state` variable bound to a `<textarea>`
instead of setting the textarea value directly:

```diff
let draw: TerraDraw | undefined = $state();

+let selectedFeature: string = $state('');
```

```html
<!-- Add text area for selected feature here -->
<hr />
<label for="selected-feature-geojson">Selected Feature GeoJSON:</label>
<textarea
    id="selected-feature-geojson"
    bind:value={selectedFeature}
    style="width: 100%; resize: vertical;"
    rows="10"
    readonly
></textarea>
```

```ts
draw?.on('select', (id: TerraDrawExtend.FeatureId) => {
    const feature = draw?.getSnapshotFeature(id);
    selectedFeature = feature ? JSON.stringify(feature, null, 2) : '';
});

draw?.on('deselect', () => {
    selectedFeature = '';
});
```

### Testing Your Implementation

1. **Open the console** to monitor which Terra Draw events are dispatched
1. **Draw features** to check the Terra Draw event logs
1. **Select/Deselect a feature** to see the actual GeoJSON stored in the Terra Draw store

## What's Next?

Now that you understand events, let's explore Terra Draw's data management capabilities.

[Continue to Exercise 6](./exercise-6.md)
