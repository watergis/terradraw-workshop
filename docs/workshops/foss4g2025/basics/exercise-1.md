# Exercise 1: Basic Drawing

**Objective**: Create a simple drawing application with multiple modes and practice using Terra Draw.

## Task Overview

In this exercise, you'll enhance your Terra Draw implementation and practice using the different drawing modes.

## Step 1: Update Your Code

Make sure your implementation includes all the modes we've discussed:

```typescript
// Update your TerraDraw configuration to include rectangle mode
draw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map }),
    modes: [
        new TerraDrawPointMode(),
        new TerraDrawLineStringMode(),
        new TerraDrawPolygonMode(),
        new TerraDrawRectangleMode(), // Add rectangle mode
        new TerraDrawSelectMode()
    ]
});
```

Add the rectangle button to your HTML:

```html
<div class="controls">
    <button id="point-mode">Point Mode</button>
    <button id="line-mode">Line Mode</button>
    <button id="polygon-mode">Polygon Mode</button>
    <button id="rectangle-mode">Rectangle Mode</button>
    <button id="select-mode">Select Mode</button>
    <button id="clear">Clear All</button>
</div>
```

Add the event listener for the rectangle mode:

```typescript
const rectangleBtn = document.getElementById('rectangle-mode') as HTMLButtonElement;

rectangleBtn?.addEventListener('click', () => {
    draw.setMode('rectangle');
    updateActiveButton('rectangle-mode');
});
```

## Step 2: Practice Drawing

Test each drawing mode and get familiar with the interactions:

1. **Point Mode**:
   - Click anywhere on the map to create points
   - Try creating several points around Auckland

2. **Line Mode**:
   - Click to start a line
   - Click additional points to add vertices
   - Double-click or press Enter to finish the line

3. **Polygon Mode**:
   - Click to start a polygon
   - Click additional points to create the polygon shape
   - Double-click or click the starting point to close the polygon

4. **Rectangle Mode**:
   - Click and drag to create rectangles
   - Notice how the rectangle is constrained to rectangular shapes

5. **Select Mode**:
   - Click on existing features to select them
   - Try dragging features to move them
   - Try dragging the handles on selected features to modify them

## Step 3: Observe Behavior

Pay attention to the different behaviors:

- **Visual Feedback**: Notice the different colors and styles for each mode
- **Interaction Patterns**: How each mode handles user input differently  
- **Selection Capabilities**: What you can do with features in select mode
- **Mode Switching**: How the active button state changes

## Step 4: Test Clear Functionality

- Create several features with different modes
- Use the "Clear All" button to remove everything
- Verify that all features are removed from the map

## Expected Results

After completing this exercise, you should be able to:

- Switch between different drawing modes
- Create various types of geometric features
- Select and modify existing features
- Clear all features from the map
- Understand the basic Terra Draw workflow

## Troubleshooting

If you encounter issues:

- **Map not loading**: Check the console for errors and ensure MapLibre GL CSS is loaded
- **Buttons not working**: Verify event listeners are set up correctly
- **Drawing not working**: Make sure `draw.start()` is called after map load
- **Select mode issues**: Ensure features exist before trying to select them

## What's Next?

Now that you've practiced basic drawing, let's explore the data structure and learn how to access drawing information.

**Next:** [Exercise 2 - Exploring Data](exercise-2.md)