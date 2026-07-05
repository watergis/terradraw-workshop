# Google Maps

The [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
is loaded differently from the other libraries — through a loader — but once
the map exists, Terra Draw works the same way.

To use it locally:

```bash
pnpm install -D @googlemaps/js-api-loader terra-draw-google-maps-adapter
```

## What changes vs MapLibre

### 1. Loading the API

Google Maps needs an API key
([create one in the Google Cloud console](https://console.cloud.google.com/)
with the *Maps JavaScript API* enabled) and is loaded asynchronously:

```ts
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

setOptions({ key: 'YOUR_GOOGLE_MAPS_API_KEY', v: 'weekly' });
const { Map } = await importLibrary('maps');
```

!!! info "About the key in this live editor"
    The example below expects a key to be baked in when this site is built
    (locally: set `GOOGLE_MAPS_API_KEY` in `.env` and run
    `uv run python scripts/generate_keys.py`; on Cloudflare Pages it comes
    from a build environment variable). If no key was provided, the preview
    shows a notice instead of a map.

### 2. Map creation

```ts
const map = new Map(document.getElementById('map') as HTMLElement, {
	center: { lat: 34.3966, lng: 132.4553 }, // Google uses { lat, lng }
	zoom: 12,
	clickableIcons: false
});
```

!!! warning "Coordinate order"
    Google Maps uses `{ lat, lng }` objects — again the opposite order of
    MapLibre's `[lng, lat]` arrays.

### 3. The adapter — and when to start

The adapter receives the `google.maps` namespace via `lib`, and drawing can
start once the map projection is ready:

```ts
adapter: new TerraDrawGoogleMapsAdapter({ lib: google.maps, map })
```

```ts
map.addListener('projection_changed', () => {
	draw.start();
});
```

## Live example

<terra-draw-editor start="../../code/other-libraries/google-maps/start.ts" lib="google" boilerplate="none" height="480"></terra-draw-editor>

## What's Next?

[ArcGIS Maps SDK](./arcgis.md) — the last one.
