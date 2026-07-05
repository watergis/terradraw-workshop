import type { Map } from 'maplibre-gl';
import { TerraDraw, TerraDrawRectangleMode } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

// The MapLibre map is already created for you as `map` (see Getting Started).
declare const map: Map;

// 1. Create a Terra Draw instance with the MapLibre adapter and
//    the rectangle mode.

// 2. Wait until the map style has loaded, then start Terra Draw
//    and switch to "rectangle" mode.
