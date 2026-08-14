# 演習 7: 元に戻す / やり直す

元に戻す / やり直す (undo/redo) は Terra Draw に最も多く要望が寄せられた機能の 1 つで、**v1.26** で追加されました。この演習では履歴機能を有効にし、UI のボタンとキーボードショートカットに結び付けます。

## Terra Draw の履歴機能の仕組み

履歴機能はオプトイン方式で、`TerraDraw` コンストラクタの `undoRedo` オプションで設定します。2 つのレベルがあります。

- **モードレベル** (`TerraDrawModeUndoRedo`): *フィーチャーを描いている最中*の操作を記録します。たとえばポリゴンモードで元に戻すと、最後にクリックした座標が取り消されます。
- **セッションレベル** (`TerraDrawSessionUndoRedo`): *確定した変更*を記録します。たとえば元に戻すと、描き終えたフィーチャーがまるごと取り消されます。

---

どちらか一方だけ、あるいは両方を有効にできます。キーボードショートカット用のハンドラー (`TerraDrawUndoRedoKeyboardShortcuts`) も用意されており、既定では `Ctrl/Cmd + Z` で元に戻す、`Ctrl/Cmd + Shift + Z` でやり直す、が割り当てられます。

```ts
import {
    TerraDraw,
    TerraDrawModeUndoRedo,
    TerraDrawSessionUndoRedo,
    TerraDrawUndoRedoKeyboardShortcuts
} from 'terra-draw';

const draw = new TerraDraw({
    adapter,
    modes,
    undoRedo: {
        modeLevel: new TerraDrawModeUndoRedo({ maxStackSize: 100 }),
        sessionLevel: new TerraDrawSessionUndoRedo({ maxStackSize: 100 }),
        keyboardShortcuts: new TerraDrawUndoRedoKeyboardShortcuts()
    }
});
```

---

有効にすると、Terra Draw インスタンスで次のメソッドが使えるようになります。

| メソッド | 説明 |
| --- | --- |
| `draw.undo()` | 直前の変更を元に戻す。何かを取り消せた場合は `true` を返す |
| `draw.redo()` | 直前に元に戻した変更をやり直す |
| `draw.canUndo()` | 元に戻せる操作があるかどうか |
| `draw.canRedo()` | やり直せる操作があるかどうか |
| `draw.clearUndoRedoHistory()` | 両方のスタックを空にする (フィーチャーは残る) |

## `history` イベント

undo/redo のスタックが変化するたびに、Terra Draw は `history` イベントを発行します。Undo/Redo ボタンの有効・無効を切り替えるには、ここが適した場所です。

```ts
draw.on('history', (event) => {
    // event.cause is 'push', 'undo' or 'redo'
    // event.stack is 'mode' or 'session'
    undoButton.disabled = !draw.canUndo();
    redoButton.disabled = !draw.canRedo();
});
```

## ライブエディタで試す

3 つの TODO を埋めてください。履歴機能を有効にし、**Undo** / **Redo** ボタンを追加し、`history` イベントでボタンの状態を同期します。その後、ポリゴンをいくつか描き、描いている最中 (モードレベル) と描き終えた後 (セッションレベル) の両方で `Ctrl/Cmd + Z` を試してみましょう。

<terra-draw-editor start="../../code/exercise-7/start.ts" answer="../../code/exercise-7/answer.ts" height="520"></terra-draw-editor>

### 動作確認

1. **描画中に元に戻します** — ポリゴンを描き始め、座標をいくつかクリックしてから `Ctrl/Cmd + Z` を押すと、最後の座標が取り消されます
1. **確定したフィーチャーを元に戻します** — ポリゴンを描き終えてから `Undo` をクリックすると、ポリゴン全体が消えます
1. **やり直します** — `Redo` (または `Ctrl/Cmd + Shift + Z`) で元に戻します
1. **ボタンの状態を確認します** — 元に戻す / やり直す対象がないときにボタンが無効になることを確かめてください
1. **履歴を消去します** — `Clear history` をクリックし、描いたフィーチャーは残ったまま両方のボタンが無効になることを確かめてください

### 発展課題

- `maxStackSize` を `3` のような小さな値にして、古い履歴がどうなるか観察してみましょう。
- セッションレベル**だけ**を有効にして、描画中の元に戻す操作がどう振る舞うか観察してみましょう。

## 次のステップ

これで MapLibre GL JS における Terra Draw の中心的な機能をひととおり習得しました。次は、maplibre-gl-terradraw プラグインを使って、ここまでの内容をわずか数行のコードで実現する方法を見ていきましょう。

[MapLibre Terra Draw プラグイン に進む](../maplibre-gl-terradraw.md)
