# Exercise 6: Multi-library Implementation

**Objective**: Experience Terra Draw's universal API by implementing the same drawing functionality with different mapping libraries.

## Step 1: Choose a Different Library

Pick either Leaflet or OpenLayers to implement alongside your MapLibre example.

### Option A: Leaflet Setup

```bash
npm install leaflet terra-draw-leaflet-adapter
npm install --save-dev @types/leaflet
```

Create `leaflet-example.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Terra Draw with Leaflet</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</head>
<body>
    <div id="map" style="height: 500px;"></div>
    <div class="controls">
        <button onclick="draw.setMode('point')">Point</button>
        <button onclick="draw.setMode('polygon')">Polygon</button>
        <button onclick="draw.setMode('select')">Select</button>
    </div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script type="module" src="./leaflet-draw.js"></script>
</body>
</html>
```

### Option B: OpenLayers Setup

```bash
npm install ol terra-draw-openlayers-adapter
```

## Step 2: Implement Drawing

Use the examples from previous sections to implement drawing with your chosen library.

## Step 3: Compare Implementations

Create side-by-side implementations and note:

1. **What changes** between libraries?
   - Map initialization code
   - Adapter imports and usage
   - CSS/styling setup

2. **What stays the same**?
   - Terra Draw configuration
   - Mode setup and usage
   - Event handling
   - Drawing API calls

## Step 4: Test Functionality

Verify that the same drawing features work across libraries:
- Point creation
- Polygon drawing
- Feature selection and editing
- Data export/import

## Expected Results

After this exercise, you should understand:
- How Terra Draw provides consistent functionality across libraries
- The minimal changes needed to switch between mapping libraries
- The power of the adapter pattern for cross-platform development

## Conclusion

Congratulations! You've completed the Terra Draw workshop and learned:
- Terra Draw fundamentals and core concepts
- Advanced styling and event handling
- MapLibre integration with the specialized plugin
- Multi-library support and universal drawing patterns

You're now ready to integrate Terra Draw into your own mapping applications!

**Next:** [Troubleshooting](../troubleshooting.md)