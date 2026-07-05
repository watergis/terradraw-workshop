# One API, Many Mapping Libraries

Everything you learned in this workshop was written against MapLibre GL JS —
but Terra Draw's biggest strength is that the very same code works with all
major web mapping libraries. Only the **adapter** changes.

| Library | Adapter package | Adapter class |
| --- | --- | --- |
| MapLibre GL JS | `terra-draw-maplibre-gl-adapter` | `TerraDrawMapLibreGLAdapter` |
| Leaflet | `terra-draw-leaflet-adapter` | `TerraDrawLeafletAdapter` |
| OpenLayers | `terra-draw-openlayers-adapter` | `TerraDrawOpenLayersAdapter` |
| Mapbox GL JS | `terra-draw-mapbox-gl-adapter` | `TerraDrawMapboxGLAdapter` |
| Google Maps JS API | `terra-draw-google-maps-adapter` | `TerraDrawGoogleMapsAdapter` |
| ArcGIS JS SDK | `terra-draw-arcgis-adapter` | `TerraDrawArcGISMapsSDKAdapter` |

Each of the following pages shows the same small drawing app — the one you
built in the exercises — running on a different mapping library, live in your
browser:

- **[Leaflet](./leaflet.md)** — a hands-on migration exercise we will do
  together in the workshop.
- **[OpenLayers](./openlayers.md)**, **[Mapbox GL JS](./mapbox.md)**,
  **[Google Maps](./google-maps.md)** and **[ArcGIS Maps SDK](./arcgis.md)** —
  completed examples you can explore at your own pace after the workshop.

In every example the modes, styles, events and data management code is
**byte-for-byte identical**. The only parts that change are:

1. the imports,
2. how the map is created, and
3. which adapter is passed to `new TerraDraw({ ... })`.

## What's Next?

Let's start with the migration exercise:
[Switching to Leaflet](./leaflet.md).
