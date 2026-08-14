# 演習 4: スタイルのカスタマイズ

このセクションでは、Terra Draw の高度なスタイル設定機能を学びます。

Terra Draw は、すべての描画モードに対して豊富なスタイル設定機能を提供しています。スタイルの指定方法は [公式のスタイルガイド](https://github.com/JamesLMilner/terra-draw/blob/main/guides/5.STYLING.md) に記載されたパターンに従います。

## ポイントのスタイル

`TerraDrawPointMode` は次のプロパティでスタイルを設定します。

| プロパティ            | 型      | 値の例 | 説明                    |
| ------------------- | --------- | ------------- | ------------------------------ |
| `pointColor`        | 16 進カラー | `#00FFFF`     | ポイントの塗りつぶし色    |
| `pointWidth`        | 整数   | `2`           | ポイントの大きさ         |
| `pointOpacity`      | 数値 (0-1) | `0.8`      | ポイントの塗りつぶしの不透明度 (v1.24 で追加) |
| `pointOutlineColor` | 16 進カラー | `#00FFFF`     | ポイントの輪郭の色 |
| `pointOutlineWidth` | 整数   | `2`           | ポイントの輪郭の太さ |

## LineString のスタイル

`TerraDrawLineStringMode` は次のプロパティでスタイルを設定します。

| プロパティ                   | 型         | 値の例 | 説明                            |
| -------------------------- | ------------ | ------------- | -------------------------------------- |
| `lineStringColor`          | 16 進カラー    | `#00FFFF`     | 線の色            |
| `lineStringWidth`          | 整数      | `2`           | 線の太さ            |
| `lineStringOpacity`        | 数値 (0-1) | `0.8`         | 線の不透明度 (v1.24 で追加) |
| `lineStringDash`           | [破線, 間隔]  | `[2, 2]`      | 破線パターン (ピクセル単位、v1.30 で追加) |
| `closingPointColor`        | 16 進カラー    | `#00FFFF`     | 終端点の塗りつぶし色    |
| `closingPointWidth`        | 整数      | `1`           | 終端点の大きさ         |
| `closingPointOutlineColor` | 16 進カラー    | `#00FF00`     | 終端点の輪郭の色 |
| `closingPointOutlineWidth` | 整数      | `2`           | 終端点の輪郭の太さ |

`TerraDrawFreehandLineStringMode` と `TerraDrawPolyLineMode` も、これらのスタイルプロパティの多くを共有しています。

!!! tip "Terra Draw v1.30 の新機能"
    `lineStringDash` はピクセル単位のタプル `[破線の長さ, 間隔の長さ]` を取ります。`[2, 2]` は破線に、`[1, 3]` は点線のような見た目になります。

## ポリゴンのスタイル

`TerraDrawPolygonMode` は次のプロパティでスタイルを設定します。

| プロパティ                   | 型         | 値の例 | 説明                            |
| -------------------------- | ------------ | ------------- | -------------------------------------- |
| `fillColor`                | 16 進カラー    | `#00FFFF`     | ポリゴンの塗りつぶし色          |
| `fillOpacity`              | 数値 (0-1) | `0.7`         | ポリゴンの塗りつぶしの不透明度        |
| `outlineColor`             | 16 進カラー    | `#00FFFF`     | ポリゴンの輪郭の色       |
| `outlineWidth`             | 整数      | `2`           | ポリゴンの輪郭の太さ       |
| `outlineOpacity`           | 数値 (0-1) | `0.9`         | ポリゴンの輪郭の不透明度 (v1.24 で追加) |
| `closingPointColor`        | 16 進カラー    | `#00FFFF`     | 終端点の塗りつぶし色    |
| `closingPointWidth`        | 整数      | `1`           | 終端点の大きさ         |
| `closingPointOutlineColor` | 16 進カラー    | `#00FF00`     | 終端点の輪郭の色 |
| `closingPointOutlineWidth` | 整数      | `2`           | 終端点の輪郭の太さ |

`TerraDrawFreehandMode` や `TerraDrawCircleMode` など、ポリゴンを描く他のモードも同じプロパティでスタイルをカスタマイズできます。

## ライブエディタで試す

演習 3 のコードを出発点に、各モードに `styles` オブジェクトを追加してください。解答では、ポイントを白地に赤い輪郭、線を赤の半透明な破線、ポリゴンを白地に赤い輪郭にし、さらに選択時のスタイルもカスタマイズしています。

<terra-draw-editor start="../../code/exercise-4/start.ts" answer="../../code/exercise-4/answer.ts" height="520"></terra-draw-editor>

## 解説

各描画モードに `styles` オプションを追加します。

```ts
draw = new TerraDraw({
    modes: [
        new TerraDrawPointMode({
            styles: {
                pointColor: '#FFFFFF',
                pointWidth: 5,
                pointOutlineColor: '#FF0000',
                pointOutlineWidth: 1
            }
        }),
        new TerraDrawLineStringMode({
            styles: {
                lineStringColor: '#FF0000',
                lineStringWidth: 2,
                // Semi-transparent line (added in v1.24)
                lineStringOpacity: 0.8,
                // Dashed line: 2px dash followed by a 2px gap (added in v1.30)
                lineStringDash: [2, 2],
                closingPointColor: '#FFFFFF',
                closingPointWidth: 3,
                closingPointOutlineColor: '#FF0000',
                closingPointOutlineWidth: 1
            }
        }),
        new TerraDrawPolygonMode({
            styles: {
                fillColor: '#FFFFFF',
                fillOpacity: 0.7,
                outlineColor: '#FF0000',
                outlineWidth: 2,
                closingPointColor: '#FFFFFF',
                closingPointWidth: 3,
                closingPointOutlineColor: '#FF0000',
                closingPointOutlineWidth: 1
            }
        }),
    ]
})
```

## 選択モードのスタイルをカスタマイズする

ただし、`TerraDrawSelectMode` でフィーチャーを選択したときのスタイルは、まだ既定のままです。次のように `TerraDrawSelectMode` に `styles` プロパティを追加しましょう。

```ts
new TerraDrawSelectMode({
    // Add custom style for select mode
    styles: {
        // Point colour
        selectedPointColor: "#FF0000",
        selectedPointWidth: 7,
        selectedPointOutlineColor: "#FFFF00",
        selectedPointOutlineWidth: 2,
        // LineString colour
        selectedLineStringColor: "#FFFF00",
        selectedLineStringWidth: 4,
        // Polygon colour
        selectedPolygonColor: "#FF0000",
        selectedPolygonFillOpacity: 0.7,
        selectedPolygonOutlineColor: "#FFFF00",
        selectedPolygonOutlineWidth: 4,
        // Selection point colour
        selectionPointColor: "#FF0000",
        selectionPointWidth: 8,
        selectionPointOutlineColor: "#FFFF00",
        selectionPointOutlineWidth: 2,
        // Midpoint colour
        midPointColor: "#FF0000",
        midPointWidth: 6,
        midPointOutlineColor: "#FFFF00",
        midPointOutlineWidth: 2
    },
    flags: {
        // keep flags settings from previous exercise
    }
})
```

### 動作確認

1. **描画のスタイルを確認します** — ポイント・線・ポリゴンを描いて、色が変わっているか確かめてください
1. **破線を確認します** — 線が破線になり、少し透けているはずです
1. **選択モードのスタイルを確認します** — ポイント・線・ポリゴンを選択して、カスタムスタイルが正しく適用されるか確かめてください

### 発展課題

固定値の代わりに、スタイルを返す*関数*を渡すこともできます。

```ts
import { TerraDrawExtend } from 'terra-draw';

// Function to generate a random hex color - can adjust as needed
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Cache for each feature id mapped to a hex color string
let colorCache: Record<TerraDrawExtend.FeatureId, string> = {};

new TerraDrawPolygonMode({
    styles: {
        fillColor: ({ id }) => {
            // Get the color from the cache or generate a new one
            colorCache[id] = colorCache[id] || getRandomColor();
            return colorCache[id];
        },
    },
}),
```

上の例では、ポリゴンごとに塗りつぶしの色がランダムに変わります。

## 次のステップ

スタイルのカスタマイズが分かったところで、次は Terra Draw のイベント処理を見ていきましょう。

[演習 5 に進む](./exercise-5.md)
