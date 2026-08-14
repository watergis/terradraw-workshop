# Mapbox GL JS

[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) は、MapLibre がもともとフォークした元の商用ライブラリです。そのため API はほぼ同一で、移行はこの中で最も簡単です。

ローカルで使う場合は次のようにインストールします。

```bash
pnpm install -D mapbox-gl terra-draw-mapbox-gl-adapter
```

## MapLibre との違い

### 1. import 文とアクセストークン

Mapbox にはアクセストークンが必要です ([こちらから無料で作成できます](https://console.mapbox.com/))。

```diff
-import { Map } from 'maplibre-gl';
-import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
+import mapboxgl from 'mapbox-gl';
+import { TerraDrawMapboxGLAdapter } from 'terra-draw-mapbox-gl-adapter';
+
+mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';
```

!!! info "このライブエディタでのトークンについて"
    以下の例では、このサイトのビルド時にトークンが埋め込まれていることを前提としています (ローカルでは `.env` に `MAPBOX_ACCESS_TOKEN` を設定して `uv run python scripts/generate_keys.py` を実行します。Cloudflare Pages ではビルド時の環境変数から取得します)。トークンが設定されていない場合、プレビューには地図の代わりに案内が表示されます。

### 2. 地図の作成

MapLibre と同じ形です。違うのはスタイル URL の形式だけです。

```ts
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v12',
	center: [132.4553, 34.3966], // [lng, lat], like MapLibre
	zoom: 12
});
```

### 3. アダプター

```diff
-    adapter: new TerraDrawMapLibreGLAdapter({ map }),
+    adapter: new TerraDrawMapboxGLAdapter({ map }),
```

描画開始の方法も同じで、`load` イベントを待ちます。

## 動くサンプル

<terra-draw-editor start="../../code/other-libraries/mapbox/start.ts" lib="mapbox" boilerplate="none" height="480"></terra-draw-editor>

## 次のステップ

[Google Maps](./google-maps.md) です。
