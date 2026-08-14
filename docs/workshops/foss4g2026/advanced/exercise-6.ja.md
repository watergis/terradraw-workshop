# 演習 6: データ管理

Terra Draw は [公式のストアのドキュメント](https://github.com/JamesLMilner/terra-draw/blob/main/guides/2.STORE.md) に沿った、強力なデータ管理機能を備えています。

## GeoJSON フィーチャーを Terra Draw のストアに追加する

`draw.addFeatures()` を使うと、プログラムからフィーチャーを追加できます。

ページの初期表示時に、広島の**原爆ドーム** — FOSS4G 2026 の会場エリアのすぐ近くにあるユネスコ世界遺産 — の位置に既定のポイントを追加してみましょう。

```ts
// Add a default point feature at the Atomic Bomb Dome in Hiroshima
draw.addFeatures([
    {
        id: '39d86739-6012-40ae-bb8c-3cb0f0694b92',
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [132.45361, 34.39556]
        },
        properties: {
            mode: 'point'
        }
    }
]);
```

!!! note
    GeoJSON の properties には `mode` プロパティが必要で、対応するモードがあらかじめ Terra Draw インスタンスに登録されている必要があります。

`addFeatures` は検証結果を返すので、GeoJSON が受け入れられたかどうかを確認できます。

```ts
const results = draw.addFeatures(features);
const invalid = results.filter((result) => !result.valid);
```

## Terra Draw のストアからフィーチャーを取得する

演習 5 ですでに使いました。

```ts
// get all features from store
const features = draw.getSnapshot();

// get feature by ID from store
const feature = draw.getSnapshotFeature(id);
```

## プログラムからフィーチャーを更新する

新しいバージョンの Terra Draw では、保存済みのフィーチャーを直接変更することもできます。

```ts
// Replace the geometry of a feature
draw.updateFeatureGeometry(id, {
    type: 'Point',
    coordinates: [132.4553, 34.3966]
});

// Rotate or scale a feature around an origin
draw.transformFeatureGeometry(id, {
    origin: [132.4553, 34.3966],
    type: 'rotate',
    options: { angle: 45 }
});
```

## UI から選択中のフィーチャーを削除する

`draw.removeFeatures()` を使って、現在選択されているフィーチャーを削除する **Delete** ボタンを追加しましょう。

## ライブエディタで試す

2 つの TODO を埋めてください。初期表示のポイントの追加と、Delete ボタンの追加です。

<terra-draw-editor start="../../code/exercise-6/start.ts" answer="../../code/exercise-6/answer.ts" height="520"></terra-draw-editor>

## ローカルの SvelteKit テンプレートでは

```ts
const handleDeleteClick = () => {
    const targetFeature = selectedFeature ? JSON.parse(selectedFeature) : null;
    if (targetFeature && targetFeature.id) {
        draw?.removeFeatures([targetFeature.id]);
    }
};
```

```html
<!-- Add delete mode button here -->
<hr />
<button onclick={handleDeleteClick} disabled={!selectedFeature}>Delete</button>
```

### 動作確認

1. **初期表示のポイントを確認します** — 原爆ドームの位置にポイントが表示されていることを確かめてください
1. **Delete ボタンを試します** — フィーチャーを選択し、選択したフィーチャーだけがストアから削除されることを確かめてください

## 次のステップ

Terra Draw でデータを読み込み、取得し、更新し、削除できるようになりました。次は Terra Draw の最新機能の 1 つである、元に戻す / やり直す を試してみましょう。

[演習 7 に進む](./exercise-7.md)
