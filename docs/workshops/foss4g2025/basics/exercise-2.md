# Exercise 2: Exploring Data

**Objective**: Learn how to access and examine Terra Draw's geographic data structure.

## Task Overview

In this exercise, you'll add functionality to monitor and display information about the features you draw.

## Step 1: Add Feature Counter

Add a feature counter to your HTML:

```html
<div id="app">
    <h1>Terra Draw Workshop</h1>
    <div id="feature-count">Features: 0</div>
    <div class="controls">
        <!-- your existing buttons -->
    </div>
    <div id="map"></div>
</div>
```

Style the counter in your CSS:

```css
#feature-count {
    margin: 10px 0;
    padding: 10px;
    background: #f0f0f0;
    border-radius: 4px;
    font-weight: bold;
}
```

## Step 2: Add Change Event Listener

Add this code after `draw.start()`:

```typescript
// Listen for changes and update the feature count
draw.on('change', () => {
    const snapshot = draw.getSnapshot();
    console.log('Current features:', snapshot);
    
    // Update feature count display
    const featureCount = document.getElementById('feature-count');
    if (featureCount) {
        featureCount.textContent = `Features: ${snapshot.length}`;
    }
    
    // Log each feature's details
    snapshot.forEach((feature, index) => {
        console.log(`Feature ${index + 1}:`, {
            type: feature.geometry.type,
            mode: feature.properties.mode,
            coordinates: feature.geometry.coordinates
        });
    });
});
```

## Step 3: Add Feature Details Display

Add a details section to your HTML:

```html
<div id="feature-details">
    <h3>Feature Details</h3>
    <pre id="feature-json">No features selected</pre>
</div>
```

Style the details section:

```css
#feature-details {
    margin: 20px 0;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
    text-align: left;
}

#feature-json {
    background: white;
    padding: 10px;
    border-radius: 4px;
    font-size: 12px;
    overflow-x: auto;
}
```

## Step 4: Add Selection Event Handler

Add this code to show selected feature details:

```typescript
// Listen for feature selection
draw.on('select', (event) => {
    console.log('Feature selected:', event);
    const detailsElement = document.getElementById('feature-json');
    
    if (detailsElement && event.selectedFeatures.length > 0) {
        const feature = event.selectedFeatures[0];
        detailsElement.textContent = JSON.stringify(feature, null, 2);
    }
});

// Clear details when nothing is selected
draw.on('deselect', () => {
    const detailsElement = document.getElementById('feature-json');
    if (detailsElement) {
        detailsElement.textContent = 'No features selected';
    }
});
```

## Step 5: Practice and Observe

1. **Draw various features** and watch the counter update
2. **Open the browser console** (F12) and observe the logged feature data
3. **Switch to select mode** and click on features to see their detailed JSON
4. **Edit features** in select mode and watch how the data changes
5. **Clear all features** and see the counter reset

## Step 6: Analyze the Data Structure

Examine the logged data and notice:

- **Feature Type**: How different modes create different geometry types
- **Coordinates**: How coordinates are structured for different geometries
- **Properties**: The essential `mode` property and any other properties
- **IDs**: How Terra Draw assigns unique IDs to features

## Questions to Explore

While working through this exercise, consider:

1. How does the coordinate structure differ between points, lines, and polygons?
2. What happens to the feature ID when you edit a feature?
3. How does Terra Draw maintain the relationship between features and modes?
4. What additional properties could you add to features?

## Expected Results

After this exercise, you should understand:

- How to access Terra Draw's feature data using `getSnapshot()`
- The GeoJSON structure Terra Draw uses
- How to respond to drawing and selection events
- The importance of the `mode` property in Terra Draw features

## What's Next?

Now that you understand Terra Draw basics and data structures, you're ready to explore advanced features like custom styling and event handling.

**Next:** [Advanced Features](../advanced.md)