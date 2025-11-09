# Event Handling

Terra Draw provides comprehensive event handling following the [official events documentation](https://github.com/JamesLMilner/terra-draw/blob/main/guides/6.EVENTS.md).

## TerraDraw Events

There are four events `change`, `finish`, `select` and `deselect` are dispatched by TerraDraw.

You can listen an event through `on` method like so.

```ts
draw.on("change", () => {
  // Do something
});
```

### `change` event

`change` event returns `ids` and `type`.

- `ids` is the list of TerraDraw feature ID affected for the event
- `type` is the types of change event as described follows.

#### `create` type

```ts
draw.on("change", (ids, type) => {
  //After creating a feature
  if (type === "create") {
    for (const id of ids) {
        const feature = draw.getSnapshotFeature(id)
        // Do something
    }
  }
});
```

#### `update` type

```ts
draw.on("change", (ids, type) => {
  //After updating a feature
  if (type === "update") {
    for (const id of ids) {
        const feature = draw.getSnapshotFeature(id)
        // Do something
    }
  }
});
```

#### `delete` type

```ts
draw.on("change", (ids, type) => {
  //After updating a feature
  if (type === "delete") {
    const snapshot = draw.getSnapshot();
    // Do something
  }
});
```

!!! note
    feature is removed from TerraDraw store, so you cannot fetch deleted features by IDs.

#### `styling` type

```ts
draw.on("change", (ids, type) => {
  //After styling is changed
  if (type === "styling") {
    for (const id of ids) {
        const feature = draw.getSnapshotFeature(id)
        // Do something
    }
  }
});
```

### `finish` event

`finish` event is dispatched when a feature finish drawing, and it returns `id` and `context`.

- `id` is the TerraDraw feature ID affected for the event
- `context` is an object containing the following properties.
  - `mode`: modeName of finished feature
  - `action`: there are four actions supported as described follows.

```ts
draw.on("finish", (id: string, context: { action: string, mode: string }) => {
  if (context.action === 'draw') {
    // Do something for draw finish event for a feature
  } else if (context.action === 'dragFeature') {
    // Do something for a drag finish event for a feature
  } else if (context.action === 'dragCoordinate') {
    // Do something for a drag finish event for a coordinate
  }else if (context.action === 'dragCoordinateResize') {
    // Do something for a drag finish event for resizing a feature
  }
});
```

### `select` event

`select` event is dispatched when a feature is selected by `TerraDrawSelectMode`.

```ts
draw.on("select", (id: string) => {
  // Do something
  //...
});
```

### `deselect` event

`deselect` event is dispatched when a feature is deselected by `TerraDrawSelectMode`.

```ts
draw.on("deselect", () => {
  // Do something
  //...
});
```

### Check TerraDraw events behaviours

We are going to add scripts to listen TerraDraw events to monitor how it behaves.

Firstly, add the below script in script tag section.

```diff
let draw: TerraDraw | undefined = $state();

+let selectedFeature: string = $state('');
```

Secondly, add the following HTML in the last on sidebar class.

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

Lastly, add the below script in the last of `once('load')` function of maplibre.

```ts
map.once('load', () => {
    // Start drawing
    draw?.start();

    // Add codes from here
    draw?.on('change', (ids, type) => {
        if (!draw) return;
        if (type === 'create') {
            // After creating a feature
            for (const id of ids) {
                // Do something
                console.log(`change: Feature created: ${id}`);
            }
        } else if (type === 'update') {
            //After updating a feature
            for (const id of ids) {
                console.log(`change: Feature updated: ${id}`);
            }
        } else if (type === 'delete') {
            //After deleting a feature
            for (const id of ids) {
                console.log(`change: Feature deleted: ${id}`);
            }
        } else if (type === 'styling') {
            //After styling is changed
            for (const id of ids) {
                console.log(`change: Feature styling updated: ${id}`);
            }
        }
    });

    draw?.on(
        'finish',
        (id: TerraDrawExtend.FeatureId, context: { action: string; mode: string }) => {
            if (context.action === 'draw') {
                // Do something for draw finish event for a feature
                console.log(`finish: Feature drawn: ${id} in mode: ${context.mode}`);
            } else if (context.action === 'dragFeature') {
                // Do something for a drag finish event for a feature
                console.log(`finish: Feature dragged: ${id} in mode: ${context.mode}`);
            } else if (context.action === 'dragCoordinate') {
                // Do something for a drag finish event for a coordinate
                console.log(`finish: Coordinate dragged in feature: ${id} in mode: ${context.mode}`);
            } else if (context.action === 'dragCoordinateResize') {
                // Do something for a drag finish event for resizing a feature
                console.log(`finish: Coordinate resized in feature: ${id} in mode: ${context.mode}`);
            }
        }
    );

    draw?.on('select', (id: TerraDrawExtend.FeatureId) => {
        console.log(`selected: ${id}`);
        const feature = draw?.getSnapshotFeature(id);
        selectedFeature = feature ? JSON.stringify(feature, null, 2) : '';
    });

    draw?.on('deselect', () => {
        console.log(`deselected`);
        selectedFeature = '';
    });
```

### Testing Your Implementation

1. **Save your changes** and the Vite development server should automatically reload
1. **Open your browser** to `http://localhost:5173`
1. **Open console in your browser** to minitor what TerraDraw events are dispatched.
1. **Drawing features** to check TerraDraw events logs
1. **Select/Deselect feature** to check how actual GeoJSON looks like in TerraDraw store.

You should be able to events like below screenshot.

![Monitoring TerraDraw events](../assets/advanced/advanced-event-1.png)

### Example code

The above example code is available at [example/terradraw-events](https://github.com/watergis/terradraw-workshop-template/tree/example/terradraw-events) branch.

## What's Next?

Now that you understand events, let's explore Terra Draw's data management capabilities.
