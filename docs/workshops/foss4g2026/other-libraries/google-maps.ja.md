# Google Maps

[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript) は、他のライブラリとは違ってローダー経由で読み込みます。ただし地図さえできてしまえば、Terra Draw の使い方は同じです。

ローカルで使う場合は次のようにインストールします。

```bash
pnpm install -D @googlemaps/js-api-loader terra-draw-google-maps-adapter
```

## MapLibre との違い

### 1. API の読み込み

Google Maps には API キーが必要で ([Google Cloud コンソール](https://console.cloud.google.com/) で *Maps JavaScript API* を有効にして作成します)、非同期に読み込まれます。

```ts
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

setOptions({ key: 'YOUR_GOOGLE_MAPS_API_KEY', v: 'weekly' });
const { Map } = await importLibrary('maps');
```

!!! info "このライブエディタでのキーについて"
    以下の例では、このサイトのビルド時にキーが埋め込まれていることを前提としています (ローカルでは `.env` に `GOOGLE_MAPS_API_KEY` を設定して `uv run python scripts/generate_keys.py` を実行します。Cloudflare Pages ではビルド時の環境変数から取得します)。キーが設定されていない場合、プレビューには地図の代わりに案内が表示されます。

### 2. 地図の作成

```ts
const map = new Map(document.getElementById('map') as HTMLElement, {
	center: { lat: 34.3966, lng: 132.4553 }, // Google uses { lat, lng }
	zoom: 12,
	clickableIcons: false
});
```

!!! warning "座標の順序"
    Google Maps は `{ lat, lng }` のオブジェクトを使います。これも MapLibre の `[lng, lat]` の配列とは逆の順序です。

### 3. アダプター — と描画開始のタイミング

アダプターは `lib` 経由で `google.maps` 名前空間を受け取ります。描画は地図の投影法の準備ができてから開始できます。

```ts
adapter: new TerraDrawGoogleMapsAdapter({ lib: google.maps, map })
```

```ts
map.addListener('projection_changed', () => {
	draw.start();
});
```

## 動くサンプル

<terra-draw-editor start="../../code/other-libraries/google-maps/start.ts" lib="google" boilerplate="none" height="480"></terra-draw-editor>

## 次のステップ

[ArcGIS Maps SDK](./arcgis.md) — 最後の 1 つです。
