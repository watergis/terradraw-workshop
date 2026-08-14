# 演習 3: TerraDrawSelectMode

`TerraDrawSelectMode` を追加して、フィーチャーの選択と編集ができるようにしましょう。

## ライブエディタで試す

フィーチャーと座標の編集を有効にした選択モードと、**Select** ボタンを追加してください。

<terra-draw-editor start="../../code/exercise-3/start.ts" answer="../../code/exercise-3/answer.ts" height="520"></terra-draw-editor>

## 解説

まず `TerraDrawSelectMode` を import します。

```ts
import {
    TerraDraw,
    TerraDrawPointMode,
    TerraDrawLineStringMode,
    TerraDrawPolyLineMode,
    TerraDrawPolygonMode,
    TerraDrawSelectMode // add here
} from 'terra-draw';
```

---

次に `modes` 配列に `TerraDrawSelectMode` を追加します。`flags` オプションで、モード名ごとに何を編集できるかを制御します。

```ts
new TerraDrawSelectMode({
    // Allow selecting a feature just by clicking it (added in v1.27)
    allowManualSelection: true,
    flags: {
        point: {
            feature: {
                draggable: true
            }
        },
        linestring: {
            feature: {
                draggable: true,
                rotateable: true,
                coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true
                }
            }
        },
        // Features drawn with polyline mode keep `mode: 'polyline'`,
        // so they need their own flags to be editable
        polyline: {
            feature: {
                draggable: true,
                rotateable: true,
                coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true
                }
            }
        },
        polygon: {
            feature: {
                draggable: true,
                rotateable: true,
                coordinates: {
                    midpoints: true,
                    draggable: true,
                    deletable: true
                }
            }
        }
    }
})
```

---

最後に **Select** ボタンを追加します。

```ts
addButton('Select', () => handleModeClick('select'));
```

SvelteKit のサイドバーの場合は次のようになります。

```html
<hr>
<button onclick={() => handleModeClick('select')}>Select</button>
```

これで、描画したフィーチャーを選択し、ドラッグしたり編集したりできるようになりました。

### 動作確認

1. **選択モードを試します** — `Select` ボタンをクリックし、描いたフィーチャーをドラッグしたり編集したりしてください
1. **座標の編集を試します** — ポリゴンの中点をドラッグして、新しい座標を挿入してみてください
1. **選択モードのパラメーターを調整します** — 選択モードのパラメーターを変更して、挙動がどう変わるか確かめてください

### 発展課題

`TerraDrawSelectMode` の `flags` では次のオプションが使えます。オプションを変更・追加して、選択モードの挙動がどう変わるか確かめてみましょう。

```ts
polygon: {
    feature: {
        draggable: true, // you can drag a polygon
        rotateable: true, // you can rotate with ctrl+r (ctrl+command+r in mac)
        coordinates: {
            midpoints: true,
            // Can be moved
            draggable: true,
            // Can be deleted
            deletable: true,
            // Can snap to other coordinates from geometries _of the same mode_
            snappable: true,
            // Allow resizing of the geometry from a given origin.
            // center will allow resizing of the aspect ratio from the center
            // and opposite allows resizing from the opposite corner of the
            // bounding box of the geometry.
            resizable: 'center', // can also be 'opposite', 'center-fixed', 'opposite-fixed'
        }
    }
}
```

## 次のステップ

これで Terra Draw の基本は身につきました。ここで休憩を取り、その後は応用機能に進みましょう。

[応用機能 に進む](../advanced/index.md)
