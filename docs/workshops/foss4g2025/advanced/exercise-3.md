# Exercise 3: Advanced Styling

**Objective**: Create a drawing application with property-based dynamic styling.

## Step 1: Add Feature Type Selector

Add a feature type selector to your HTML:

```html
<div class="feature-controls">
    <label for="feature-type">Feature Type:</label>
    <select id="feature-type">
        <option value="default">Default</option>
        <option value="building">Building</option>
        <option value="park">Park</option>
        <option value="road">Road</option>
    </select>
</div>
```

## Step 2: Implement Dynamic Styling

Update your Terra Draw configuration with dynamic styling:

```typescript
const polygonMode = new TerraDrawPolygonMode({
    styles: {
        fillColor: (feature) => {
            const type = feature.properties.type || 'default';
            const colors = {
                'building': '#8B5CF680',
                'park': '#10B98140',
                'road': '#6B728080',
                'default': '#9CA3AF40'
            };
            return colors[type as keyof typeof colors];
        },
        outlineColor: (feature) => {
            const type = feature.properties.type || 'default';
            const colors = {
                'building': '#8B5CF6',
                'park': '#10B981', 
                'road': '#6B7280',
                'default': '#9CA3AF'
            };
            return colors[type as keyof typeof colors];
        },
        outlineWidth: 2
    }
});
```

## Step 3: Feature Type Assignment

Implement feature type assignment:

```typescript
let currentFeatureType = 'default';

const typeSelector = document.getElementById('feature-type') as HTMLSelectElement;
typeSelector?.addEventListener('change', (e) => {
    currentFeatureType = (e.target as HTMLSelectElement).value;
});

// Listen for draw events to assign type
draw.on('draw', (event) => {
    if (currentFeatureType !== 'default') {
        const features = draw.getSnapshot();
        const newFeature = features[features.length - 1];
        
        if (newFeature && newFeature.id) {
            draw.removeFeatures([newFeature.id]);
            newFeature.properties.type = currentFeatureType;
            draw.addFeatures([newFeature]);
        }
    }
});
```

## Step 4: Test Dynamic Styling

1. **Select different feature types** before drawing
2. **Draw polygons** with different types
3. **Observe the color changes** based on feature type
4. **Switch to select mode** and see how selected features look different

## Expected Results

- Different colored polygons based on selected type
- Visual differentiation between building, park, and road features
- Dynamic color changes when switching feature types

## What's Next?

**Next:** [Exercise 4 - Event-Driven App](exercise-4.md)