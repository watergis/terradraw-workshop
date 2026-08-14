# Leaflet に切り替える

[Leaflet](https://leafletjs.com/) は最も広く使われているウェブ地図ライブラリの 1 つです。この演習では、演習で作った描画アプリを MapLibre GL JS から Leaflet へ移行します。Terra Draw 側のコードはまったく変わらないことが分かるはずです。

## 出発点: MapLibre

移行元となるアプリです。これまでの演習と違い、以下のコードは*地図の作成*も行っています。まさにそこがライブラリごとに異なる部分だからです。ライブラリ固有の箇所にはコメントを付けています。

<terra-draw-editor start="../../code/other-libraries/maplibre/start.ts" boilerplate="none" height="480"></terra-draw-editor>

## 変更点

ローカル環境で Terra Draw を Leaflet と一緒に使うには、Leaflet とそのアダプターをインストールします。

```bash
pnpm install -D leaflet @types/leaflet terra-draw-leaflet-adapter
```

変わるのは 3 か所だけです。それ以外 — モード、スタイル、イベント、データ管理、UI のボタン — はまったく同じままです。

### 1. import 文

```diff
-import { Map as MapLibreMap } from 'maplibre-gl';
-import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
+import L from 'leaflet';
+import { TerraDrawLeafletAdapter } from 'terra-draw-leaflet-adapter';
```

(ローカルのプロジェクトでは CSS の import も差し替えます: `maplibre-gl/dist/maplibre-gl.css` → `leaflet/dist/leaflet.css`。ライブエディタでは CSS は自動的に読み込まれます。)

### 2. 地図の作成

```diff
-const map = new MapLibreMap({
-    container: 'map',
-    style: 'https://tiles.openfreemap.org/styles/bright',
-    center: [132.4553, 34.3966],
-    zoom: 12
-});
+const map = L.map('map').setView([34.3966, 132.4553], 12);
+L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
+    maxZoom: 19,
+    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
+}).addTo(map);
```

!!! warning "座標の順序"
    MapLibre は `[lng, lat]` の順、Leaflet は `[lat, lng]` の順です。この 2 つを行き来するときに最もよくある間違いです。

### 3. アダプター — と描画開始のタイミング

```diff
 const draw = new TerraDraw({
-    adapter: new TerraDrawMapLibreGLAdapter({ map }),
+    adapter: new TerraDrawLeafletAdapter({ map, lib: L }),
     modes: [ /* unchanged! */ ]
 });

-map.once('load', () => {
-    draw.start();
-});
+// Leaflet is ready synchronously — no `load` event to wait for.
+draw.start();
```

## 結果: Leaflet

上の 3 つの変更を適用した後の、同じアプリです。今度は **Leaflet** で動いています。ページ上部の MapLibre 版と比べてみてください。Terra Draw の部分は 1 バイトも違いません。コードを編集して**実行 ▶** を押し、いろいろ試してみましょう。

<terra-draw-editor start="../../code/other-libraries/leaflet/start.ts" lib="leaflet" height="480"></terra-draw-editor>

!!! note "Leaflet v1 + SvelteKit での TypeScript"
    ローカルの SvelteKit プロジェクトでは、Leaflet v1 が既定の設定で TypeScript のエラーを出すことがあります。その場合は `tsconfig.json` の `module` と `moduleResolution` を `nodenext` に変更してください。

## 次のステップ

同じ 3 ステップの手順が、他のどのライブラリでも通用します。次は [OpenLayers](./openlayers.md) です。
