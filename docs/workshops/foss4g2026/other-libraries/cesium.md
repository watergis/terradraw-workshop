# CesiumJS

[CesiumJS](https://cesium.com/platform/cesiumjs/) is a 3D globe — the only non-flat map in this section. Even so, the Terra Draw code is exactly the same as everywhere else: you draw on a globe instead of a plane, and only the adapter changes. The adapter is [`@watergis/terra-draw-cesium-adapter`](https://github.com/watergis/terra-draw-cesium-adapter), a brand-new package outside the core Terra Draw repository.

To use it locally:

```bash
pnpm install -D cesium @watergis/terra-draw-cesium-adapter
```

!!! warning "Cesium adapter is still in beta"
	The Cesium adapter is a new package just released a few days ago before FOSS4G 2026, and its API may change. If you find any issues, please [file an issue](https://github.com/watergis/terra-draw-cesium-adapter/issues).
	
	Furthermore, welcome any contributions to the adapter (eg, making a pull request to add a feature, or to fix a bug). The adapter is open source and MIT licensed.


## What changes vs MapLibre

### 1. Imports

Cesium is imported as a whole namespace, because the adapter takes it as `lib`:

```ts
import * as Cesium from 'cesium';
import { TerraDrawCesiumAdapter } from '@watergis/terra-draw-cesium-adapter';
```

### 2. Map creation

Cesium calls its map a `Viewer`. Its imagery and terrain come from [Cesium ion](https://ion.cesium.com/), so it needs an access token. The viewer ships with its own controls — home, scene mode (3D / 2D / Columbus view), base layer picker, navigation help, timeline — and they are all on by default:

```ts
Cesium.Ion.defaultAccessToken = 'YOUR_CESIUM_ION_ACCESS_TOKEN';

const viewer = new Cesium.Viewer('map', {
	terrain: Cesium.Terrain.fromWorldTerrain(),
	infoBox: false,
	selectionIndicator: false,
	geocoder: false
});

viewer.camera.setView({
	destination: Cesium.Cartesian3.fromDegrees(132.4553, 34.28, 25000),
	orientation: {
		heading: 0,
		pitch: Cesium.Math.toRadians(-50),
		roll: 0
	}
});
```

!!! info "About the token in this live editor"
    The example below expects a token to be baked in when this site is built (locally: set `CESIUM_ION_ACCESS_TOKEN` in `.env` and run `uv run python scripts/generate_keys.py`; on Cloudflare Pages it comes from a build environment variable). If no token was provided, the preview shows a notice instead of a globe. A free ion account gives you a default token — [create one here](https://ion.cesium.com/tokens).

!!! warning "Camera height, not zoom level"
    Cesium has no `zoom` level. The camera is positioned in 3D space, so `Cartesian3.fromDegrees(lng, lat, height)` takes a height **in metres** — here 25 km, south of the city — and `orientation.pitch` tilts the view down 50° so the terrain is visible. Coordinate order is `[lng, lat]` — the same as MapLibre, unlike Leaflet.

!!! note "Which widgets are switched off"
    Only three, and each for a reason: `infoBox` and `selectionIndicator` both react to clicking a feature, which fights with drawing, and the `geocoder` needs a token with the `geocode` scope. Everything else is Cesium's default set — try the scene mode picker to draw in 2D and 3D with the same code.

### 3. The adapter — and when to start

The adapter never imports Cesium itself; you inject the namespace via `lib`, and `map` is the **viewer**:

```ts
adapter: new TerraDrawCesiumAdapter({
	map: viewer,
	lib: Cesium
})
```

A Cesium `Viewer` is usable as soon as it is constructed, so unlike MapLibre there is no load event to wait for:

```ts
draw.start();
```

!!! note "3D-specific behaviour"
    - Every feature is rendered as a Cesium entity **clamped to the ground**, so drawings drape over the imagery and follow the terrain — tilt the globe and you can see a polygon bend over a hillside. This is also what makes Terra Draw's `zIndex` styling work: Cesium only honours `zIndex` on clamped geometry.
    - Keyboard shortcuts (`Escape` to cancel, `Delete` to remove a selection) only fire once the Cesium canvas has focus, so click the globe once first.
    - `setDoubleClickToZoom` is a no-op: Cesium has no double-click-to-zoom, and the adapter removes Cesium's default double-click entity tracking because it conflicts with double-click-to-finish.
    - In a local project, Cesium's static assets (`Workers/`, `Assets/`, `Widgets/`) have to be served alongside your bundle — use `vite-plugin-cesium`, or copy them yourself and set `window.CESIUM_BASE_URL`.

## Live example

<terra-draw-editor start="../../code/other-libraries/cesium/start.ts" lib="cesium" boilerplate="none" height="480"></terra-draw-editor>

## What's Next?

That's the end of the hands-on content — seven mapping libraries, 2D and 3D, one Terra Draw API. Head over to the [Q&A page](../support.md) for how to stay in touch with the Terra Draw community.
