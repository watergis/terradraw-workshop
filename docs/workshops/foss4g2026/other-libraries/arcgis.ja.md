# ArcGIS Maps SDK

[ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/) は Esri の地図ライブラリです。OpenLayers と同様に完全にモジュール化されているため、Terra Draw のアダプターは必要なクラスを `lib` 経由で受け取ります。

ローカルで使う場合は次のようにインストールします。

```bash
pnpm install -D @arcgis/core terra-draw-arcgis-adapter
```

## MapLibre との違い

### 1. import 文

```ts
import EsriMap from '@arcgis/core/Map.js';
import MapView from '@arcgis/core/views/MapView.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
// ...plus the geometry/symbol classes the adapter needs (see below)
import { TerraDrawArcGISMapsSDKAdapter } from 'terra-draw-arcgis-adapter';
```

### 2. 地図の作成

ArcGIS では*マップ* (データ) と*ビュー* (描画) が分かれています。

```ts
const map = new EsriMap({ basemap });
const view = new MapView({
	container: 'map',
	map,
	center: [132.4553, 34.3966],
	zoom: 12
});
```

!!! note "ベースマップと API キー"
    Esri 自身のベースマップ (`basemap: 'topo-vector'` など) には ArcGIS の API キーが必要です。以下のサンプルでは代わりに、`WebTileLayer` を使って CARTO のラスタータイルからキー不要のベースマップを構成しているため、キーなしで動作します。

### 3. アダプター — と描画開始のタイミング

アダプターがラップするのはマップではなく**ビュー**です。

```ts
adapter: new TerraDrawArcGISMapsSDKAdapter({
	lib: {
		GraphicsLayer, Graphic, Point, Polyline, Polygon,
		SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol,
		PictureMarkerSymbol, Color
	},
	map: view
})
```

```ts
view.when(() => {
	draw.start();
});
```

## 動くサンプル

<terra-draw-editor start="../../code/other-libraries/arcgis/start.ts" lib="arcgis" boilerplate="none" height="480"></terra-draw-editor>

## 次のステップ

残るライブラリはあと 1 つ、しかも平面の地図ではありません。3D 地球儀の [CesiumJS](./cesium.md) です。
