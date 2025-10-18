# Custom Styling

In this section, you'll learn about Terra Draw's advanced styling capabilities.

Terra Draw provides extensive styling capabilities for all drawing modes. Styling follows the patterns described in the [official styling guide](https://github.com/JamesLMilner/terra-draw/blob/main/guides/5.STYLING.md).

### Static Styling

You can define static styles for each mode:

```typescript
// Point mode with custom styling
const pointMode = new TerraDrawPointMode({
    styles: {
        pointColor: '#FF6B6B',
        pointWidth: 12,
        pointOutlineColor: '#FFFFFF',
        pointOutlineWidth: 3
    }
});

// LineString mode with custom styling
const lineMode = new TerraDrawLineStringMode({
    styles: {
        lineStringColor: '#4ECDC4',
        lineStringWidth: 4,
        closingPointColor: '#45B7AF',
        closingPointWidth: 10,
        closingPointOutlineColor: '#FFFFFF',
        closingPointOutlineWidth: 2
    }
});

// Polygon mode with custom styling
const polygonMode = new TerraDrawPolygonMode({
    styles: {
        fillColor: '#FFE66D80', // Semi-transparent yellow
        outlineColor: '#FF6B6B',
        outlineWidth: 3,
        closingPointColor: '#FF6B6B',
        closingPointWidth: 10
    }
});
```

### Dynamic Styling

You can create dynamic styles based on feature properties or interaction state:

```typescript
const polygonMode = new TerraDrawPolygonMode({
    styles: {
        fillColor: (feature, state) => {
            // Style based on feature properties
            if (feature.properties.type === 'building') {
                return '#8B5CF680';
            }
            if (feature.properties.type === 'park') {
                return '#10B98140';
            }
            // Style based on interaction state
            if (state === 'selected') {
                return '#F59E0B80';
            }
            return '#6B728080';
        },
        outlineColor: (feature, state) => {
            if (state === 'selected') {
                return '#F59E0B';
            }
            return feature.properties.type === 'building' ? '#8B5CF6' : '#10B981';
        },
        outlineWidth: 3
    }
});
```

### Styling Examples from Official Documentation

Here are practical styling examples for each mode:

#### Point Mode Styling
```typescript
const styledPointMode = new TerraDrawPointMode({
    styles: {
        pointColor: (feature) => {
            return feature.properties.urgent ? '#FF0000' : '#0000FF';
        },
        pointWidth: (feature) => {
            return feature.properties.size === 'large' ? 15 : 8;
        },
        pointOutlineColor: '#FFFFFF',
        pointOutlineWidth: 2
    }
});
```

#### LineString Mode Styling
```typescript
const styledLineMode = new TerraDrawLineStringMode({
    styles: {
        lineStringColor: (feature) => {
            const type = feature.properties.roadType;
            switch (type) {
                case 'highway': return '#FF0000';
                case 'arterial': return '#FFA500';
                case 'local': return '#808080';
                default: return '#000000';
            }
        },
        lineStringWidth: (feature) => {
            const type = feature.properties.roadType;
            switch (type) {
                case 'highway': return 6;
                case 'arterial': return 4;
                case 'local': return 2;
                default: return 1;
            }
        }
    }
});
```

#### Rectangle Mode Styling
```typescript
const styledRectangleMode = new TerraDrawRectangleMode({
    styles: {
        fillColor: '#FF000040',
        outlineColor: '#FF0000',
        outlineWidth: 2,
        closingPointColor: '#FF0000',
        closingPointWidth: 8
    }
});
```

## What's Next?

Now that you understand custom styling, let's explore Terra Draw's event handling capabilities.

**Next:** [Event Handling](advanced/events.md)

