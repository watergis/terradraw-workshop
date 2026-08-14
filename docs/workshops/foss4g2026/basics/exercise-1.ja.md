# 演習 1: はじめての Terra Draw 実装

まずは UI 操作を伴わない、基本的な Terra Draw のセットアップを MapLibre GL JS で作ってみましょう。

## ライブエディタで試す

下の最初のコードには TODO コメントが 2 つあります。それらを埋めてから**実行 ▶** をクリックしてください。行き詰まったら**解答**タブを開いてみましょう。

<terra-draw-editor start="../../code/exercise-1/start.ts" answer="../../code/exercise-1/answer.ts" height="480"></terra-draw-editor>

## 解説

まず、Terra Draw と MapLibre アダプターを import します。

```ts
import { TerraDraw, TerraDrawRectangleMode } from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
```

---

次に Terra Draw のインスタンスを作り、アダプター経由で地図を接続し、矩形モードを登録します。

```ts
const draw = new TerraDraw({
    // Using the MapLibre Adapter
    adapter: new TerraDrawMapLibreGLAdapter({ map }),

    // Add the Rectangle Mode
    modes: [new TerraDrawRectangleMode()],
});
```

---

最後に、MapLibre が地図スタイルを読み込むのを待ってから描画を開始します。

```ts
// Have to wait for MapLibre to load the map style before starting to draw
map.once('load', () => {
    // Start drawing
    draw.start();
    draw.setMode("rectangle");
});
```

これで、地図をクリックして矩形のポリゴンを描けるようになりました。1 回目のクリックで矩形が始まり、2 回目のクリックで確定します。

## ローカルの SvelteKit テンプレートでは

`src/routes/+page.svelte` を開き、既存の import の下に import を追加して、Terra Draw のセットアップを `onMount()` 関数の末尾、地図の初期化の後に書きます。

```ts
onMount(() => {
    // ... existing map initialization ...

    const draw = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map }),
        modes: [new TerraDrawRectangleMode()],
    });

    map.once('load', () => {
        draw.start();
        draw.setMode("rectangle");
    });
});
```

### 動作確認

1. **変更を保存**すると、Vite の開発サーバーが自動的にリロードします
1. ブラウザで `http://localhost:5173` を**開きます**
1. **描画を試します** — 地図をクリックして矩形を作成してください

## 次のステップ

UI なしで動く Terra Draw の実装ができたので、次は UI ボタンを使って複数の描画モードを追加してみましょう。

[演習 2 に進む](./exercise-2.md)
