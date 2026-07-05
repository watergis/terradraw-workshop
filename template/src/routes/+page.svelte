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

<style>
	.main {
		display: flex;
		height: 100vh;
		width: 100vw;
	}

	.main .sidebar {
		width: 260px;
		background: #f4f4f4;
		border-right: 1px solid #ddd;
		padding: 1rem;
		box-sizing: border-box;
		overflow-y: auto;
	}

	.main .map {
		flex: 1;
		height: 100%;
		width: 100%;
	}
</style>
