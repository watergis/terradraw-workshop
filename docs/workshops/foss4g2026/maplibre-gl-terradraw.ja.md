# MapLibre Terra Draw プラグイン

このセクションでは、Terra Draw を MapLibre に簡単に組み込むためのプラグインを紹介します。

## maplibre-gl-terradraw

ここまでの演習で、Terra Draw の仕組みと、どれだけ細かく制御できるかを見てきました。とはいえ、完全な描画 UI を地図アプリケーションに用意するには、まだかなりの量のコードを書く必要があります。

[maplibre-gl-terradraw](https://github.com/watergis/maplibre-gl-terradraw) は、MapLibre への組み込みを簡単にするために開発されました。Terra Draw を、すぐに使えるボタン付きの標準的な MapLibre コントロールとしてラップします。

## インストール

```bash
pnpm add --save-dev @watergis/maplibre-gl-terradraw
```

## 使い方

MapLibre のアプリケーションに数行のコードを追加するだけです。

```ts
import { MaplibreTerradrawControl } from '@watergis/maplibre-gl-terradraw';
import '@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css';

const drawControl = new MaplibreTerradrawControl();
map.addControl(drawControl, 'top-left');
```

## ライブエディタで試す

好きなモードを選んでコントロールを追加してみましょう。このプラグインは `polyline`、`undo`、`redo` のボタンを含むすべての Terra Draw のモードに対応しているほか、`delete` や `download` といった追加のボタンも備えています。

<terra-draw-editor start="../code/maplibre-gl-terradraw/start.ts" answer="../code/maplibre-gl-terradraw/answer.ts" height="500"></terra-draw-editor>

!!! note
    ライブエディタのプレビューでは、プラグインのスタイルシートがすでに読み込まれています。自分のプロジェクトでは `@watergis/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css` の import を忘れないでください。

## 利用できるコントロール

このプラグインには 3 種類のコントロールがあります。

| コントロール | 説明 |
| --- | --- |
| MaplibreTerradrawControl | 描画のための標準的なコントロール |
| MaplibreMeasureControl | 距離・面積・標高を計測するコントロール |
| MaplibreValhallaControl | Valhalla API (ルーティングと到達圏) と連携するコントロール |

---

![距離・面積・標高を計測する MaplibreMeasureControl](./assets/plugin-measure-control.png)
_距離・面積・標高を計測する MaplibreMeasureControl_

---

![Valhalla のルーティング API・到達圏 API と連携する MaplibreValhallaControl](./assets/plugin-valhalla-control.png)
_Valhalla のルーティング API・到達圏 API と連携する MaplibreValhallaControl_

## Terra Draw のすべての API が使える

プラグインのコンストラクタと `getTerraDrawInstance` メソッドを通じて、Terra Draw のすべての API にアクセスできます。

```ts
const drawControl = new MaplibreTerradrawControl({
    modes: ['polygon', 'select', 'delete'], // choose which buttons are needed
    open: true, // set default state either expanded or collapsed
    modeOptions: {}, // pass your own Terra Draw mode options to override default settings
    adapterOptions: {} // pass your own adapter settings
});

// You can get the Terra Draw instance from the plugin to do whatever you want
const draw = drawControl.getTerraDrawInstance();
// do something
```

## デモ

maplibre-gl-terradraw のデモは <https://terradraw.water-gis.com/> で公開しています。

Terra Draw とプラグインの設定方法を示すサンプルが多数用意されています。

## ソースコード

GitHub リポジトリは [watergis/maplibre-gl-terradraw](https://github.com/watergis/maplibre-gl-terradraw) です。

## 次のステップ

最後に、まったく同じ Terra Draw のコードが他の地図ライブラリでどう動くかを見てみましょう。

[他の地図ライブラリ に進む](./other-libraries/index.md)
