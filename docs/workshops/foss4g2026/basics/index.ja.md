# コアコンセプト

このセクションでは、Terra Draw の中心となる概念を学び、最初の描画アプリケーションを作ります。

Terra Draw は、その強力さと柔軟性を支えるいくつかの重要な概念で構成されています。

## ストア (Store)

ストアはライブラリの中核であり、地図に追加されたすべてのフィーチャーの状態を管理します。ストアは Terra Draw のインスタンス化時に作成されます。

```ts
// Create a Terra Draw instance and assign it to a variable called `draw`
const draw = new TerraDraw({ adapter, modes });
```

!!! note
    このワークショップのドキュメントでは、Terra Draw のインスタンスを指す変数名として `draw` を使います。

フィーチャーは、利用可能な描画モード (`TerraDrawRectangleMode` や `TerraDrawPolygonMode` など) を使って地図を操作したときにストアへ追加されます。

ストアの内容は `getSnapshot` メソッドで取得でき、ストア内のすべてのフィーチャージオメトリの配列が返ります。

```ts
// Get an Array of all Features in the Store
const features = draw.getSnapshot();
```

## アダプター (Adapters)

アダプターは、地図ライブラリ固有のロジック — 地図ライブラリが描画するレイヤーの作成と更新 — を包む薄いラッパーです。Terra Draw はモノレポ内の複数のパッケージとして、標準でいくつかのアダプターを提供しています。現在対応しているのは Leaflet、OpenLayers、Mapbox GL JS、MapLibre GL JS、Google Maps JS API、ArcGIS JS SDK です。

このワークショップでは地図ライブラリとして MapLibre GL JS を使います。MapLibre 用のアダプター (`TerraDrawMapLibreGLAdapter`) は次のようにインストールできます。

```bash
npm install terra-draw-maplibre-gl-adapter
```

```ts
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

// Create an Adapter for MapLibre GL JS
const adapter = new TerraDrawMapLibreGLAdapter({ map });
```

公式ドキュメントの [Adapters](https://github.com/JamesLMilner/terra-draw/blob/main/guides/3.ADAPTERS.md) のセクションも参照してください。

## モード (Modes)

モードは、特定の描画ツールのロジックを表します。たとえば `TerraDrawRectangleMode`、`TerraDrawPolygonMode`、`TerraDrawLineStringMode` を使うと、それぞれ地図上に矩形、ポリゴン、線を描けます。

`TerraDrawSelectMode` は地図上のフィーチャーの選択と編集を可能にし、`TerraDrawRenderMode` は編集できないフィーチャー (背景となる参考データなど) の表示に使います。

モードは次のようにインスタンス化します。

```ts
const polygonMode = new TerraDrawPolygonMode();
const rectangleMode = new TerraDrawRectangleMode();
const renderMode = new TerraDrawRenderMode({
  modeName: "auniquename",
});
```

---

現在 Terra Draw が対応している描画モードは次のとおりです (v1.31 時点)。

| モード | クラス | モード名 |
| --- | --- | -- |
| 傾いた矩形 | `TerraDrawAngledRectangleMode` | `angled-rectangle` |
| 円 | `TerraDrawCircleMode` | `circle` |
| フリーハンド | `TerraDrawFreehandMode` | `freehand` |
| フリーハンド (ライン) | `TerraDrawFreehandLineStringMode` | `freehand-linestring` |
| 線 | `TerraDrawLineStringMode` | `linestring` |
| マーカー | `TerraDrawMarkerMode` | `marker` |
| ポイント | `TerraDrawPointMode` | `point` |
| ポリゴン | `TerraDrawPolygonMode` | `polygon` |
| ポリライン | `TerraDrawPolyLineMode` | `polyline` |
| 矩形 | `TerraDrawRectangleMode` | `rectangle` |
| セクター | `TerraDrawSectorMode` | `sector` |
| センサー | `TerraDrawSensorMode` | `sensor` |

!!! tip "Terra Draw v1.31 の新機能"
    **ポリライン**モードは最も新しく追加されたモードの 1 つです。linestring モードと同じように描き始めますが、最初の点をもう一度クリックすると形が閉じてポリゴンになります。[演習 2](./exercise-2.md) で試します。

公式ドキュメントの [Modes](https://github.com/JamesLMilner/terra-draw/blob/main/guides/4.MODES.md) のセクションも参照してください。

## Terra Draw のセットアップ

ローカルのプロジェクトには次のようにインストールします。

```bash
npm install terra-draw terra-draw-maplibre-gl-adapter
```

---

npm でインストールしたら、プロジェクト内で次のように使えます。

```ts
import { TerraDraw, TerraDrawRectangleMode } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';

const draw = new TerraDraw({
  // Using the MapLibre Adapter
  adapter: new TerraDrawMapLibreGLAdapter({ map }),

  // Add the Rectangle Mode
  modes: [new TerraDrawRectangleMode()],
});

map.once('load', () => {
    // Start drawing
    draw.start();
    draw.setMode("rectangle");
})
```

!!! note
    このワークショップのライブエディタでは、Terra Draw とアダプターがあらかじめ利用可能になっています。各演習の先頭にある `import` 文はそのまま動作し、インストールは不要です。

## 次のステップ

コアコンセプトを理解したところで、最初の Terra Draw の実装を作ってみましょう。

[演習 1 を始める](./exercise-1.md)
