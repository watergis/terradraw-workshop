# Getting Started

There are two ways to follow this workshop. You can use both at the same time.

- **Track A - Browser only (recommended to start):** every exercise page has a
  built-in live editor. Write TypeScript on the left, click **Run ▶** (or
  press `Ctrl+Enter` / `Cmd+Enter`) and see the result on the right.
  Nothing to install.
- **Track B - Local development:** build the same application locally with
  SvelteKit so you can take a working project home.

## Track A: Using the live editor

Each exercise embeds an editor like the one below. Try it now!

<terra-draw-editor start="../code/exercise-1/answer.ts" height="420"></terra-draw-editor>

- The **Exercise** tab contains the starter code. Edit it freely and click
  **Run ▶** to execute it.
- The **Answer** tab shows the solution (read-only). You can copy it into
  your editor with **Copy answer to editor**.
- **Reset** restores the original starter code.
- Your edits are kept while the browser tab stays open, even if you move
  between pages.

A MapLibre GL JS map is already created for you in the preview and exposed as
the variable `map` — the same `map` variable you will create yourself in the
local template below. The narrow area on the left of the map is a *sidebar*
(`<div id="sidebar">`): some exercises add buttons to it.

!!! note
    The live editor loads Terra Draw and MapLibre from a CDN, so it needs an
    internet connection. If the venue network is unreliable, follow Track B
    and copy the plain code blocks from each page instead.

## Track B: Local project setup with SvelteKit

We use [SvelteKit](https://svelte.dev/docs/kit) for the local development
environment as it provides an excellent developer experience with fast builds
and hot reload.

### Prerequisites

- **Node.js v24 LTS** or **v22** ([download](https://nodejs.org/) or install via [nvm](https://github.com/nvm-sh/nvm))
- **pnpm** (`npm install -g pnpm`) — npm also works
- **VS Code** or your preferred editor

### 1. Clone this repository

Everything for this workshop, including the template project, is in a single
repository:

```bash
git clone https://github.com/watergis/terradraw-workshop.git
cd terradraw-workshop/template
```

### 2. Install dependencies and launch

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173` in your browser. You should see a map of
Hiroshima — the FOSS4G 2026 host city.

### 3. Project structure

```bash
template/
├── package.json
├── src
│   ├── app.d.ts
│   ├── app.html
│   └── routes
│       ├── +page.svelte  <- We use this file in the workshop
│       └── +page.ts
├── static
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

We mainly edit `src/routes/+page.svelte` during the workshop. It already
contains the MapLibre map setup:

- the map is created in `onMount()` and stored in the `map` variable
- an empty `<aside class="sidebar">` is prepared for the buttons we will add
- `+page.ts` disables server-side rendering (`export const ssr = false;`)

??? example "Show the full initial +page.svelte"

    ```html
    <script lang="ts">
    	import {
    		AttributionControl,
    		FullscreenControl,
    		GeolocateControl,
    		GlobeControl,
    		Map,
    		NavigationControl,
    		ScaleControl
    	} from 'maplibre-gl';
    	import { onMount } from 'svelte';
    	import 'maplibre-gl/dist/maplibre-gl.css';

    	let mapContainer: HTMLDivElement | undefined = $state();
    	let map: Map | undefined = $state();

    	onMount(() => {
    		if (!mapContainer) return;
    		map = new Map({
    			container: mapContainer,
    			// Keyless OpenFreeMap vector style
    			style: 'https://tiles.openfreemap.org/styles/bright',
    			center: [132.4553, 34.3966],
    			zoom: 12,
    			hash: true,
    			attributionControl: false
    		});
    		map.addControl(new NavigationControl(), 'top-right');
    		map.addControl(new GlobeControl(), 'top-right');
    		map.addControl(new FullscreenControl(), 'top-right');
    		map.addControl(
    			new GeolocateControl({
    				positionOptions: { enableHighAccuracy: true },
    				trackUserLocation: true
    			}),
    			'top-right'
    		);
    		map.addControl(new ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');
    		map.addControl(new AttributionControl({ compact: true }), 'bottom-right');
    	});
    </script>

    <div class="main">
    	<aside class="sidebar">
    		<!-- Use this space for adding additional elements for workshop -->
    	</aside>
    	<div class="map" bind:this={mapContainer}></div>
    </div>

    <style lang="scss">
    	.main {
    		display: flex;
    		height: 100vh;
    		width: 100vw;

    		.sidebar {
    			width: 260px;
    			background: #f4f4f4;
    			border-right: 1px solid #ddd;
    			padding: 1rem;
    			box-sizing: border-box;
    			overflow-y: auto;
    		}
    		.map {
    			flex: 1;
    			height: 100%;
    			width: 100%;
    		}
    	}
    </style>
    ```

### Moving code between the live editor and SvelteKit

The exercise code is written to be almost identical in both environments:

| Live editor | SvelteKit template |
| --- | --- |
| `map` is provided as a global variable | `map` is created in `onMount()` |
| Code runs at the top level | Terra Draw setup goes inside `onMount()` |
| Buttons are added with the `addButton()` helper | Buttons are `<button>` elements in the sidebar `<aside>` |

## What's Next?

With your environment ready, let's learn the Terra Draw fundamentals.

[Continue to Terra Draw Basics](./basics/index.md)
