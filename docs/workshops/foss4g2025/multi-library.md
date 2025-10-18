# Multi-library Support

In this section, you'll learn about Terra Draw's adapter pattern and how to use the same drawing code across different mapping libraries.

## Understanding Adapters

Terra Draw's adapter pattern allows the same drawing code to work across different mapping libraries. This follows the official [adapters documentation](https://github.com/JamesLMilner/terra-draw/blob/main/guides/3.ADAPTERS.md).

### What are Adapters?

Adapters are bridge components that translate Terra Draw's unified API calls into library-specific operations. Each supported mapping library has its own adapter that handles:

- **Rendering** - How features are displayed on the map
- **Event handling** - How user interactions are processed
- **Coordinate systems** - How geographic coordinates are managed
- **Layer management** - How drawing layers are added/removed

### Available Adapters

| Library | Adapter Package | Import |
|---------|----------------|---------|
| MapLibre GL JS | `terra-draw-maplibre-gl-adapter` | `TerraDrawMapLibreGLAdapter` |
| Leaflet | `terra-draw-leaflet-adapter` | `TerraDrawLeafletAdapter` |
| OpenLayers | `terra-draw-openlayers-adapter` | `TerraDrawOpenLayersAdapter` |
| Mapbox GL JS | `terra-draw-mapbox-gl-adapter` | `TerraDrawMapboxGLAdapter` |
| Google Maps | `terra-draw-google-maps-adapter` | `TerraDrawGoogleMapsAdapter` |
| ArcGIS JS API | `terra-draw-arcgis-adapter` | `TerraDrawArcGISAdapter` |

## What's Next?

Let's explore Terra Draw with different mapping libraries.

**Next:** [Leaflet Example](multi-library/leaflet.md)

