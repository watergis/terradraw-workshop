# OpenLayers

[OpenLayers](https://openlayers.org/) は強力で、完全にモジュール化された地図ライブラリです。このページでは、同じ描画アプリを OpenLayers で動かします。下の**実行 ▶** を押して、MapLibre 版とコードを比べてみてください。Terra Draw の部分は同一です。

ローカルで使う場合は次のようにインストールします。

```bash
pnpm install -D ol terra-draw-openlayers-adapter
```

## MapLibre との違い

### 1. import 文

OpenLayers はモジュール化されているため、必要なクラスを 1 つずつ import します。

```ts
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import { fromLonLat, toLonLat, getUserProjection } from 'ol/proj.js';
// ...plus the style/vector classes the adapter needs (see below)
import { TerraDrawOpenLayersAdapter } from 'terra-draw-openlayers-adapter';
```

### 2. 地図の作成

```ts
const map = new Map({
	target: 'map',
	layers: [new TileLayer({ source: new OSM() })],
	view: new View({ center: fromLonLat([132.4553, 34.3966]), zoom: 12 })
});
```

!!! warning "投影法"
    OpenLayers は内部的に Web メルカトル (EPSG:3857) を使うため、`[lng, lat]` の座標は `fromLonLat()` で変換します。Terra Draw 自体は常に GeoJSON の `[lng, lat]` を扱い、変換はアダプターが行います。

### 3. アダプター

OpenLayers はモジュール化されているため、アダプターは必要なクラスを自分で import するのではなく、`lib` 経由で受け取ります。

```ts
adapter: new TerraDrawOpenLayersAdapter({
	lib: {
		Circle, Feature, GeoJSON, Style, VectorLayer, VectorSource,
		Stroke, Fill, Icon, getUserProjection, Projection, fromLonLat, toLonLat
	},
	map
})
```

最初のフレームが描画されたら描画を開始します。

```ts
map.once('rendercomplete', () => {
	draw.start();
});
```

## 動くサンプル

<terra-draw-editor start="../../code/other-libraries/openlayers/start.ts" lib="openlayers" boilerplate="none" height="480"></terra-draw-editor>

## 次のステップ

[Mapbox GL JS](./mapbox.md) — MapLibre に最も近い親戚です。
