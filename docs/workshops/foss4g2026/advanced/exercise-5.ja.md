# 演習 5: イベント処理

Terra Draw は [公式のイベントドキュメント](https://github.com/JamesLMilner/terra-draw/blob/main/guides/6.EVENTS.md) に沿った、充実したイベント処理の仕組みを備えています。

## Terra Draw のイベント

Terra Draw は `change`、`finish`、`select`、`deselect`、そして undo/redo 機能の追加以降は `history` ([演習 7](./exercise-7.md) で扱います) というイベントを発行します。

イベントは `on` メソッドで購読できます。

```ts
draw.on("change", () => {
  // Do something
});
```

### `change` イベント

`change` イベントは `ids` と `type` を返します。

- `ids` はイベントの影響を受けた Terra Draw のフィーチャー ID のリストです
- `type` は変更の種類で、`create`、`update`、`delete`、`styling` のいずれかです

```ts
draw.on("change", (ids, type) => {
  // After creating a feature
  if (type === "create") {
    for (const id of ids) {
        const feature = draw.getSnapshotFeature(id)
        // Do something
    }
  }
});
```

!!! note
    `delete` イベントの時点で、そのフィーチャーはすでに Terra Draw のストアから削除されています。そのため、削除されたフィーチャーを ID から取得することはできません。

### `finish` イベント

`finish` イベントはフィーチャーへの操作が完了したときに発行され、`id` と `context` を返します。

- `id` はイベントの影響を受けた Terra Draw のフィーチャー ID です
- `context` は次を含むオブジェクトです。
  - `mode`: 完了したフィーチャーのモード名
  - `action`: 以下の 4 種類のアクションのいずれか

```ts
draw.on("finish", (id: string, context: { action: string, mode: string }) => {
  if (context.action === 'draw') {
    // Do something for draw finish event for a feature
  } else if (context.action === 'dragFeature') {
    // Do something for a drag finish event for a feature
  } else if (context.action === 'dragCoordinate') {
    // Do something for a drag finish event for a coordinate
  } else if (context.action === 'dragCoordinateResize') {
    // Do something for a drag finish event for resizing a feature
  }
});
```

### `select` / `deselect` イベント

`select` イベントは `TerraDrawSelectMode` でフィーチャーが選択されたときに、`deselect` は選択が解除されたときに発行されます。

```ts
draw.on("select", (id: string) => {
  // Do something
});

draw.on("deselect", () => {
  // Do something
});
```

### モードの状態

`getModeState()` を使うと、Terra Draw インスタンスが今どういう状態にあるかを取得できます。`registered`、`started`、`drawing` などの状態が返ります。現在の操作状況に応じて UI を切り替えたい場合に便利です。

```ts
console.log(draw.getMode());      // e.g. "polygon"
console.log(draw.getModeState()); // e.g. "drawing"
```

## ライブエディタで試す

`map.once('load')` の中にある 4 つの TODO を埋めてください。`change` と `finish` のイベントをコンソールに出力し、選択したフィーチャーの GeoJSON をサイドバーのテキストエリアに表示します。ブラウザの開発者コンソール (またはプレビュー下部のコンソール欄) でログを確認してください。

<terra-draw-editor start="../../code/exercise-5/start.ts" answer="../../code/exercise-5/answer.ts" height="560"></terra-draw-editor>

## ローカルの SvelteKit テンプレートでは

テンプレートでは、テキストエリアの値を直接設定するのではなく、`<textarea>` にバインドしたリアクティブな `$state` 変数を使います。

```diff
let draw: TerraDraw | undefined = $state();

+let selectedFeature: string = $state('');
```

```html
<!-- Add text area for selected feature here -->
<hr />
<label for="selected-feature-geojson">Selected Feature GeoJSON:</label>
<textarea
    id="selected-feature-geojson"
    bind:value={selectedFeature}
    style="width: 100%; resize: vertical;"
    rows="10"
    readonly
></textarea>
```

```ts
draw?.on('select', (id: TerraDrawExtend.FeatureId) => {
    const feature = draw?.getSnapshotFeature(id);
    selectedFeature = feature ? JSON.stringify(feature, null, 2) : '';
});

draw?.on('deselect', () => {
    selectedFeature = '';
});
```

### 動作確認

1. **コンソールを開き**、どの Terra Draw イベントが発行されるか観察してください
1. **フィーチャーを描いて**、Terra Draw のイベントログを確認してください
1. **フィーチャーを選択・選択解除して**、Terra Draw のストアに実際に保存されている GeoJSON を確認してください

## 次のステップ

イベントが理解できたところで、次は Terra Draw のデータ管理機能を見ていきましょう。

[演習 6 に進む](./exercise-6.md)
