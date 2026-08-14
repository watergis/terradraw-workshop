# 演習 2: UI ボタンで描画モードを切り替える

描画モードをさらに登録し、それらを切り替えるボタンを追加しましょう。新しい**ポリライン**モードも使います。

## ポリラインモード (Terra Draw v1.31 の新機能)

`TerraDrawPolyLineMode` は最も新しい描画モードの 1 つです。linestring モードとまったく同じように描き始めますが、ひとひねりあります。

- クリックを続けて線を描き、ダブルクリック (または Enter キー) で **LineString** として確定する — linestring モードと同じ動作
- **または線の最初の点をもう一度クリックして、形を閉じてポリゴンにする**

これは、1 つのツールで線とポリゴンのどちらも作れる多くのデスクトップ GIS の操作感を再現したものです。

## ライブエディタで試す

矩形モードを `point`、`linestring`、`polyline`、`polygon` の各モードに置き換え、ボタンと結び付けてください。最初の点をクリックしてポリラインをポリゴンに閉じる操作もぜひ試してみましょう。

<terra-draw-editor start="../../code/exercise-2/start.ts" answer="../../code/exercise-2/answer.ts" height="520"></terra-draw-editor>

## 解説

モードのクラスを import します (`TerraDrawRectangleMode` は削除している点に注意してください)。

```ts
import {
    TerraDraw,
    TerraDrawPointMode,
    TerraDrawLineStringMode,
    TerraDrawPolyLineMode,
    TerraDrawPolygonMode
} from 'terra-draw';
```

Terra Draw の初期化にある `modes:` の配列を更新します。

```ts
const draw = new TerraDraw({
    adapter: new TerraDrawMapLibreGLAdapter({ map }),
    modes: [
        new TerraDrawPointMode(),
        new TerraDrawLineStringMode(),
        new TerraDrawPolyLineMode(),
        new TerraDrawPolygonMode()
    ]
});
```

---

最初から特定の描画ツールが有効にならないように、`draw.setMode("rectangle");` を削除します。

```diff
map.once('load', () => {
    // Start drawing
    draw.start();
-   draw.setMode("rectangle");
});
```

ハンドラー関数を 2 つ追加します。

```ts
const handleModeClick = (mode: string) => {
    draw.setMode(mode);
};

const handleClearClick = () => {
    draw.clear();
};
```

---

最後に、モードごとにボタンを 1 つずつ追加します。ライブエディタでは `addButton()` ヘルパーを使います。

```ts
addButton('Point', () => handleModeClick('point'));
addButton('Line', () => handleModeClick('linestring'));
addButton('Polyline', () => handleModeClick('polyline'));
addButton('Polygon', () => handleModeClick('polygon'));
addButton('Clear', () => draw.clear());
```

## ローカルの SvelteKit テンプレートでは

`+page.svelte` では、ハンドラーは閉じタグ `</script>` の直前に、ボタンはサイドバーの `<aside>` の中に書きます。

```html
<aside class="sidebar">
    <button onclick={() => handleModeClick('point')}>Point</button>
    <button onclick={() => handleModeClick('linestring')}>Line</button>
    <button onclick={() => handleModeClick('polyline')}>Polyline</button>
    <button onclick={() => handleModeClick('polygon')}>Polygon</button>
    <button onclick={handleClearClick}>Clear</button>
</aside>
```

### 動作確認

1. **描画を試します** — 対応するボタンをクリックして、ポイント・線・ポリゴンを作成してください
1. **ポリラインモードを試します** — 線を 1 本描いて確定し、もう 1 本描いて最初の点をクリックし、ポリゴンに閉じてみてください
1. **フィーチャーを削除します** — `Clear` ボタンをクリックしてすべてのフィーチャーを削除してください

### 発展課題

他の Terra Draw のモードも追加してみましょう。`TerraDrawCircleMode`、`TerraDrawFreehandMode`、`TerraDrawAngledRectangleMode`、`TerraDrawMarkerMode` など。手順はいつも同じです。`modes` 配列にモードを登録し、`draw.setMode('<モード名>')` を呼ぶボタンを追加するだけです。

## 次のステップ

ポイント・線・ポリゴンを追加したり削除したりできるようになりました。次はフィーチャーの選択と編集を学びましょう。

[演習 3 に進む](./exercise-3.md)
