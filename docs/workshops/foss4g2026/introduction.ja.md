# Terra Draw とは

何かをインストールする前に、Terra Draw がどういうものか、どんな課題を解決するのか、そして 2026 年時点でプロジェクトがどこまで進んでいるのかを見ていきましょう。

## Terra Draw とは?

[Terra Draw](https://terradraw.io) は、**ウェブ地図上にジオメトリを描画する**ための、MIT ライセンス・依存関係ゼロの JavaScript ライブラリです。特定の地図ライブラリに縛られることなく、MapLibre GL JS、Leaflet、OpenLayers、Mapbox GL JS、Google Maps、ArcGIS Maps SDK という 6 つのライブラリで共通して使える単一の API を提供します。

作者・メンテナは [James Milner](https://github.com/JamesLMilner) さんで、ソースコードは [JamesLMilner/terra-draw](https://github.com/JamesLMilner/terra-draw) にあります。

```bash
npm install terra-draw
```

## なぜ必要なのか?

ウェブ地図上で描画すること自体は昔から可能でしたが、これまでは地図ライブラリごとに専用の描画プラグインがあり、それぞれ独自の API と癖を持ち、いくつかはメンテナンスが止まっているという状況でした。

![Leaflet.draw、FreeDraw、@mapbox/mapbox-gl-draw: 地図ライブラリごとに 1 つの描画プラグイン](./assets/introduction/existing-drawing-plugins.png)

*Terra Draw 登場以前の状況: Leaflet 向けの FreeDraw と Leaflet.draw、Mapbox GL JS 向けの `@mapbox/mapbox-gl-draw`。James Milner さんの [FOSS4G Europe 2026 の講演](https://talks.osgeo.org/foss4g-europe-2026/talk/SVK98A/) のスライドより。*

つまり、ベースとなる地図ライブラリを乗り換えると — Google Maps や Mapbox のライセンス変更をきっかけに多くのプロジェクトがそうしました — 描画部分をまるごと書き直す必要がありました。Terra Draw はこの結び付きを取り除きます。描画のロジックはそのままに、変えるのはアダプターだけです。

## 設計方針

Terra Draw は次の 4 つの方針に沿って作られています。

- **地図ライブラリ横断の対応** — 同じコードが対応するどのライブラリでも動く
- **カスタムモード** — 組み込みのモードを使うだけでなく、独自の描画ツールも書ける
- **細かなスタイル制御** — フィーチャー単位を含め、あらゆるジオメトリのスタイルを指定できる
- **依存関係ゼロ** — バンドルに余計なパッケージが入らない

## アーキテクチャ

![Terra Draw のアーキテクチャ: ブラウザがアダプター (Leaflet、MapLibre、Google) とやり取りし、アダプターが Polygon、Point、LineString といったモードを動かし、モードがストアを読み書きする](./assets/introduction/terra-draw-architecture.png)

*Terra Draw のアーキテクチャ。James Milner さんの [FOSS4G Europe 2026 の講演](https://talks.osgeo.org/foss4g-europe-2026/talk/SVK98A/) のスライドより。*

---

このワークショップのすべての演習を通じて、次の 3 つの概念が登場します。

| 概念 | 役割 |
| --- | --- |
| **アダプター (Adapter)** | Terra Draw を特定の地図ライブラリに結び付ける。例: `TerraDrawMapLibreGLAdapter` |
| **モード (Modes)** | 現在使っている描画ツール。例: `TerraDrawPolygonMode`、`TerraDrawPointMode`、`TerraDrawSelectMode` |
| **ストア (Store)** | 描画した GeoJSON フィーチャー。読み書きの対象となる唯一の情報源 |

これらを組み合わせると、必ず次のような形になります。

```ts
const draw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map }),
    modes: [new TerraDrawPolygonMode()]
});

draw.start();
draw.setMode('polygon');
```

それぞれの概念については、[コアコンセプト](./basics/index.md) と [演習 1](./basics/exercise-1.md) で詳しく見ていき、実際にこのコードを動かします。

## 対応している地図ライブラリ

![OpenLayers、Leaflet、ArcGIS Maps SDK for JavaScript、Google Maps Platform、Mapbox GL JS、MapLibre GL JS](./assets/introduction/supported-map-libraries.png)

*Terra Draw が対応する 6 つの地図ライブラリ。James Milner さんの [FOSS4G Europe 2026 の講演](https://talks.osgeo.org/foss4g-europe-2026/talk/SVK98A/) のスライドより。*

---

ライブラリごとに専用のアダプターパッケージが用意されています。

- **MapLibre GL JS** — `TerraDrawMapLibreGLAdapter` (このワークショップで使います)
- **Leaflet** — `TerraDrawLeafletAdapter`
- **OpenLayers** — `TerraDrawOpenLayersAdapter`
- **Mapbox GL JS** — `TerraDrawMapboxGLAdapter`
- **Google Maps** — `TerraDrawGoogleMapsAdapter`
- **ArcGIS Maps SDK for JavaScript** — `TerraDrawArcGISMapsSDKAdapter`

[他の地図ライブラリ](./other-libraries/index.md) では、同じ演習をそれぞれのライブラリで書き直します。

## 2026 年の新機能

2025 年版のワークショップ以降、Terra Draw は急速に進化しました。以下のハイライトは、FOSS4G Europe 2026 での James Milner さんの講演 [**Terra Draw: What's new for 2026?**](https://talks.osgeo.org/foss4g-europe-2026/talk/SVK98A/) に沿ったものです。

- **元に戻す / やり直す (v1.26)** — 長らく要望のあった、実装の難しい機能です。2 段階の仕組みになっており、*モードレベル*の undo/redo は 1 つのフィーチャーを描いている最中に、*セッションレベル*の undo/redo はモードをまたいで確定済みの変更に対して働きます。両方を併用することも、片方だけ使うこともできます。→ [演習 7](./advanced/exercise-7.md)
- **スタイル機能の強化** — ポイント、ラインストリング、ポリゴンの輪郭に対するフィーチャー単位の不透明度 (v1.24)、破線のサポート (v1.30、v1.32 でスタイル関数に対応)。→ [演習 4](./advanced/exercise-4.md)
- **ポリラインモード (v1.31)** — 線を描いて LineString として確定することも、最初の点をもう一度クリックして閉じ、ポリゴンにすることもできます。多くのデスクトップ GIS と同じ操作感です。→ [演習 2](./basics/exercise-2.md)
- **同じモードの複数インスタンス (v1.19)** — インスタンスごとに `modeName` を指定することで、設定やスタイルの異なるポリゴンモードを 2 つ並べて動かす、といったことができます。→ [コアコンセプト](./basics/index.md)
- **クリック & ドラッグでの描画** — 矩形モードと円モードは、角ごとにクリックする代わりにドラッグで描けるようになりました。[モードのガイド](https://github.com/JamesLMilner/terra-draw/blob/main/guides/4.MODES.md) を参照してください。

!!! tip
    講演の詳細と元のスライドは [FOSS4G Europe 2026 のプログラムページ](https://talks.osgeo.org/foss4g-europe-2026/talk/SVK98A/) にあります。

## プロジェクトに参加するには

Terra Draw はオープンソースプロジェクトであり、貢献を歓迎しています。

- [JamesLMilner/terra-draw](https://github.com/JamesLMilner/terra-draw) にスターを付ける
- バグを見つけたら、再現手順の明確な [issue](https://github.com/JamesLMilner/terra-draw/issues) を作成する
- issue トラッカーで議論し、プルリクエストを送る

## 次のステップ

Terra Draw がどういうものか分かったところで、開発環境を整えましょう。

[はじめよう に進む](./getting-started.md)
