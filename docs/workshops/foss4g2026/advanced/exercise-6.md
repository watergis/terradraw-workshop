# Exercise 6: Data Management

Terra Draw provides powerful data management capabilities following the [official store documentation](https://github.com/JamesLMilner/terra-draw/blob/main/guides/2.STORE.md).

## Add GeoJSON features to the Terra Draw store

You can add features programmatically by using `draw.addFeatures()`.

Let's add a default point at the **Atomic Bomb Dome** in Hiroshima — a
UNESCO World Heritage Site just next to the FOSS4G 2026 venue area — when
the page is initially loaded:

```ts
// Add a default point feature at the Atomic Bomb Dome in Hiroshima
draw.addFeatures([
    {
        id: '39d86739-6012-40ae-bb8c-3cb0f0694b92',
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [132.45361, 34.39556]
        },
        properties: {
            mode: 'point'
        }
    }
]);
```

!!! note
    The `mode` property must exist in the GeoJSON properties and the
    corresponding mode must be registered in the Terra Draw instance in
    advance.

`addFeatures` returns validation results, so you can check whether your
GeoJSON was accepted:

```ts
const results = draw.addFeatures(features);
const invalid = results.filter((result) => !result.valid);
```

## Get features from the Terra Draw store

We already used this in Exercise 5:

```ts
// get all features from store
const features = draw.getSnapshot();

// get feature by ID from store
const feature = draw.getSnapshotFeature(id);
```

## Update features programmatically

Newer Terra Draw versions can also modify stored features directly:

```ts
// Replace the geometry of a feature
draw.updateFeatureGeometry(id, {
    type: 'Point',
    coordinates: [132.4553, 34.3966]
});

// Rotate or scale a feature around an origin
draw.transformFeatureGeometry(id, {
    origin: [132.4553, 34.3966],
    type: 'rotate',
    options: { angle: 45 }
});
```

## Delete a selected feature from the UI

Let's add a **Delete** button that removes the currently selected feature
using `draw.removeFeatures()`.

## Try it in the live editor

Complete the two TODOs: add the initial point and the Delete button.

<terra-draw-editor start="../../code/exercise-6/start.ts" answer="../../code/exercise-6/answer.ts" height="520"></terra-draw-editor>

## In the local SvelteKit template

```ts
const handleDeleteClick = () => {
    const targetFeature = selectedFeature ? JSON.parse(selectedFeature) : null;
    if (targetFeature && targetFeature.id) {
        draw?.removeFeatures([targetFeature.id]);
    }
};
```

```html
<!-- Add delete mode button here -->
<hr />
<button onclick={handleDeleteClick} disabled={!selectedFeature}>Delete</button>
```

### Testing Your Implementation

1. **Check the initial point is on the map** - confirm the point is shown at the Atomic Bomb Dome
1. **Test the Delete button** - select a feature and ensure only the selected feature is deleted from the store

## What's Next?

You can now load, read, update and remove data in Terra Draw. Next, let's try one of the newest features of Terra Draw: undo and redo.

[Continue to Exercise 7](./exercise-7.md)
