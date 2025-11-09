# Intergation with Leaflet

[Leaflet](https://leafletjs.com/) is one of the most popular mappling library used everywhere.

We are going to use the last example 6's code to switch maplibre to leaflet with minimal changes.

You can know how TerraDraw's unified API works across different mapping libraries.

## Create Leaflet folder

In Sveltekit, let's create `leaflet` folder under routes, then copy following files:

- copy `src/routes/+page.svelte` to `src/routes/leaflet/+page.svelte`.
- copy `src/routes/+page.ts` to `src/routes/leaflet/+page.ts`.

Now you can access to new leaflet page through http://localhost:5173/leaflet.

However, everything on leaflet page is still using maplibre. We are going to replace maplibre to leaflet.

## Install Leaflet

Install Leaflet to dependencies.

```bash
pnpm install -D leaflet @types/leaflet terra-draw-leaflet-adapter 
```


## Replace maplibre with leaflet

You only need to change `<script>` tag section. The below is how you can change the code.

```diff
<script lang="ts">
-	import {
-		AttributionControl,
-		GeolocateControl,
-		GlobeControl,
-		Map,
-		NavigationControl,
-		ScaleControl
-	} from 'maplibre-gl';
	import { onMount } from 'svelte';
-	import 'maplibre-gl/dist/maplibre-gl.css';
	import {
		TerraDraw,
		TerraDrawPointMode,
		TerraDrawLineStringMode,
		TerraDrawPolygonMode,
		TerraDrawSelectMode,
		TerraDrawExtend
	} from 'terra-draw';
-	import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
    // import leaflet and TerraDrawLeafletAdapter
+   import { TerraDrawLeafletAdapter } from 'terra-draw-leaflet-adapter';
+	import L from 'leaflet';

	let mapContainer: HTMLDivElement | undefined = $state();
    let map: Map | undefined = $state();
	let draw: TerraDraw | undefined = $state();

	let selectedFeature: string = $state('');

	onMount(() => {
		if (!mapContainer) return;
-		map = new Map({
-			container: mapContainer,
-			style: {
-				version: 8,
-				name: 'OpnenStreetMap Raster',
-				sources: {
-					osm: {
-						type: 'raster',
-						tiles: ['https://tile.openstreetmap.jp/{z}/{x}/{y}.png'],
-						tileSize: 256,
-						maxzoom: 19,
-						attribution:
-							'<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
-					}
-				},
-				layers: [
-					{
-						id: 'osm',
-						type: 'raster',
-						source: 'osm'
-					}
-				]
-			},
-			center: [174.7629, -36.8587],
-			zoom: 11,
-			hash: true,
-			attributionControl: false
-		});
-		map.addControl(new NavigationControl(), 'top-right');
-		map.addControl(new GlobeControl(), 'top-right');
-		map.addControl(
-			new GeolocateControl({
-				positionOptions: { enableHighAccuracy: true },
-				trackUserLocation: true
-			}),
-			'top-right'
-		);
-		map.addControl(new ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');
-		map.addControl(new AttributionControl({ compact: true }), 'bottom-right');

        // create Leaflet map object
+		map = L.map(mapContainer).setView([-36.8587, 174.7629], 11);
+
+		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
+			maxZoom: 19,
+			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
+		}).addTo(map);

		draw = new TerraDraw({
            // Use TerraDrawLeafletAdapter instead of TerraDrawMapLibreGLAdapter
+           adapter: new TerraDrawLeafletAdapter({ map, lib: L }),
-			// Using the MapLibre Adapter
-			adapter: new TerraDrawMapLibreGLAdapter({ map }),

			// Add the Point, LineString, Polygon and Select Mode
			modes: [
				new TerraDrawPointMode({
					styles: {
						pointColor: '#FFFFFF',
						pointWidth: 5,
						pointOutlineColor: '#FF0000',
						pointOutlineWidth: 1
					}
				}),
				new TerraDrawLineStringMode({
					styles: {
						lineStringColor: '#FF0000',
						lineStringWidth: 2,
						closingPointColor: '#FFFFFF',
						closingPointWidth: 3,
						closingPointOutlineColor: '#FF0000',
						closingPointOutlineWidth: 1
					}
				}),
				new TerraDrawPolygonMode({
					styles: {
						fillColor: '#FFFFFF',
						fillOpacity: 0.7,
						outlineColor: '#FF0000',
						outlineWidth: 2,
						closingPointColor: '#FFFFFF',
						closingPointWidth: 3,
						closingPointOutlineColor: '#FF0000',
						closingPointOutlineWidth: 1
					}
				}),
				// Add Select mode with feature and coordinate editing enabled
				new TerraDrawSelectMode({
					styles: {
						// Point colour
						selectedPointColor: '#FF0000',
						selectedPointWidth: 7,
						selectedPointOutlineColor: '#FFFF00',
						selectedPointOutlineWidth: 2,
						// LineString colour
						selectedLineStringColor: '#FFFF00',
						selectedLineStringWidth: 4,
						// Polygon colour
						selectedPolygonColor: '#FF0000',
						selectedPolygonFillOpacity: 0.7,
						selectedPolygonOutlineColor: '#FFFF00',
						selectedPolygonOutlineWidth: 4,
						// Selection point colour
						selectionPointColor: '#FF0000',
						selectionPointWidth: 8,
						selectionPointOutlineColor: '#FFFF00',
						selectionPointOutlineWidth: 2,
						// Midpoint colour
						midPointColor: '#FF0000',
						midPointWidth: 6,
						midPointOutlineColor: '#FFFF00',
						midPointOutlineWidth: 2
					},
					flags: {
						point: {
							feature: {
								draggable: true
							}
						},
						linestring: {
							feature: {
								draggable: true,
								rotateable: true,
								coordinates: {
									midpoints: true,
									draggable: true,
									deletable: true
								}
							}
						},
						polygon: {
							feature: {
								draggable: true,
								rotateable: true,
								coordinates: {
									midpoints: true,
									draggable: true,
									deletable: true
								}
							}
						}
					}
				})
			]
		});

        // leaflet does not need `load` event.
-		map.once('load', () => {
			// Start drawing
			draw?.start();

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

			// Add a default point feature at Auckland University of Technology
			draw?.addFeatures([
				{
					id: '39d86739-6012-40ae-bb8c-3cb0f0694b92',
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [174.766430366, -36.85309055]
					},
					properties: {
						mode: 'point'
					}
				}
			]);
-		});
	});

	const handleModeClick = (mode: string) => {
		draw?.setMode(mode);
	};

	const handleClearClick = () => {
		draw?.clear();
	};

	const handleDeleteClick = () => {
		const targetFeature = selectedFeature ? JSON.parse(selectedFeature) : null;
		if (targetFeature && targetFeature.id) {
			draw?.removeFeatures([targetFeature.id]);
		}
	};
</script>
```

You can see the change is really minumum and everything can work without changing anything on TerraDraw side.

![Leaflet for the exercise 6](./assets/leaflet.png)

## TypeScript error for Leaflet with SvelteKit

Leaflet v1 with Sveltekit may have TypeScript error as default.

you may need to change `module` and `moduleResolution` to `nodenext` on `tsconfig.json`.

```diff
{
    "extends": "./.svelte-kit/tsconfig.json",
    "compilerOptions": {
        "allowJs": true,
        "checkJs": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "skipLibCheck": true,
        "sourceMap": true,
        "strict": true,
+		"module": "nodenext",
+		"moduleResolution": "nodenext"
-       "moduleResolution": "bundler"
}
```

### Example code

The above example code is available at [example/leaflet](https://github.com/watergis/terradraw-workshop-template/tree/example/leaflet) branch.

## What's Next?

Now, you know how TerraDraw's unified API works across different mappling library through an example of Leaflet integration.

In the next step, I am going to introduce a maplibre plugin developed particularly for maplibre intergration easily.
