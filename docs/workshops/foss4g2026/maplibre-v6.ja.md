# MapLibre GL JS v5 から v6 へ

このワークショップでは、**MapLibre GL JS v6** を Terra Draw v1.32.2 および `terra-draw-maplibre-gl-adapter` v1.4.1 と組み合わせて使います。アダプター自体は v6 対応のための変更を必要とせず、v4・v5・v6 のすべてに対応しています ([terra-draw#912](https://github.com/JamesLMilner/terra-draw/issues/912) 参照)。ただし MapLibre v6 では*ライブラリの配布形式*が変わったため、コードを書き始める前に知っておく価値があります。

!!! note
    このページは背景知識です。各演習ページのライブエディタではすべて対応済みなので、**トラック A** で進めている方は [Terra Draw の基本](./basics/index.md) に飛んで、後から戻ってきてもかまいません。**トラック B** (ローカルの SvelteKit テンプレート) で進めている方は、テンプレートにここで説明する設定がそのまま入っているので、読み進めてください。

## ESM のみ: UMD バンドルは廃止

v6 での最大の変更は配布形式です。MapLibre GL JS v6 は **ES モジュールのみ**で配布されます。UMD バンドル (`maplibre-gl.js`) と個別の CSP バンドル (`maplibre-gl-csp.js`) は公開されなくなりました。

| | v5 | v6 |
| --- | --- | --- |
| メインバンドル | `dist/maplibre-gl.js` (UMD) | `dist/maplibre-gl.mjs` (ESM) |
| CSP 向けビルド | `dist/maplibre-gl-csp.js` | 廃止 (不要になりました) |
| ワーカー | インライン / blob | `dist/maplibre-gl-worker.mjs` |
| `package.json` | `main` + `module` | `"type": "module"`、`import` のみ |

そのため、従来の script タグは動作しません。

```html
<!-- v5: UMD、グローバル変数 `maplibregl` を公開する -->
<script src="https://unpkg.com/maplibre-gl@^5/dist/maplibre-gl.js"></script>
```

代わりに module スクリプトを使います。

```html
<link rel="stylesheet" href="https://unpkg.com/maplibre-gl@^6.0.0/dist/maplibre-gl.css" />
<div id="map" style="height: 400px"></div>
<script type="module">
	import * as maplibregl from 'https://unpkg.com/maplibre-gl@^6.0.0/dist/maplibre-gl.mjs';

	const map = new maplibregl.Map({
		container: 'map',
		style: 'https://tiles.openfreemap.org/styles/bright',
		center: [132.4553, 34.3966],
		zoom: 12
	});
</script>
```

グローバル変数 `maplibregl` はもう存在しません。必ず import して使います。

## import の書き方

すでに**名前付き import** を使っている場合、変更は不要です。

```ts
// v5 でも v6 でも動作する
import { Map, NavigationControl } from 'maplibre-gl';
```

更新が必要なのは**デフォルト import** だけです。ESM ビルドにはデフォルトエクスポートがありません。

```ts
// 変更前 (v5)
import maplibregl from 'maplibre-gl';

// 変更後 (v6) — 名前空間 import
import * as maplibregl from 'maplibre-gl';

// または必要なものだけを取り込む
import { Map, setWorkerUrl } from 'maplibre-gl';
```

ワークショップのテンプレート (`template/src/routes/+page.svelte`) もライブエディタも名前付き import を使っており、演習全体でこのスタイルに統一しています。

## Web Worker について

MapLibre はタイルのパースを Web Worker で行います。v6 ではこのワーカーが実際のモジュールファイル `dist/maplibre-gl-worker.mjs` になり、隣接するファイル `dist/maplibre-gl-shared.mjs` を*相対*パスで import します。

**CDN から読み込む場合。** ワーカーの URL は `import.meta.url` から自動的に導出されるため、設定は不要です。ただしワーカーが隣接ファイルを相対パスで解決するため、`dist/` ディレクトリ全体が到達可能である必要があります。フルパスを指定してください。

```js
// 良い例: 隣接ファイル (ワーカーと共有チャンク) に到達できる
import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.5.0/dist/maplibre-gl.mjs';
```

モジュールパスを書き換えて再バンドルする CDN ではこれが壊れます。メインモジュールは読み込めるものの、ワーカーのリクエストが 404 になり、エラーも出ないまま地図が固まります。このワークショップのライブエディタが unpkg の `dist/maplibre-gl.mjs` の URL をそのまま固定しているのは、このためです。

**Content Security Policy。** MapLibre を CDN からクロスオリジンで読み込むと、ワーカーは同一オリジンの blob URL から生成されるため、CSP に次の設定が必要です。

```
worker-src 'self' blob: ;
img-src data: blob: 'self' ;
```

ワーカーを自分でホストする場合 (このテンプレートを含め、バンドラーを使う構成すべて) はワーカーの URL が同一オリジンになるため、`blob:` は不要です。

## Vite で MapLibre v6 を使う

バンドラーの中では `import.meta.url` がワーカーファイルを確実に解決できないため、プロジェクトごとに一度だけ `setWorkerUrl()` を呼ぶ必要があります。Vite では `?worker&url` クエリを使って、バンドル済みで自己完結したワーカーの URL を取得します。

```ts
import { Map, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

setWorkerUrl(workerUrl);

const map = new Map({
	/* … */
});
```

単なる `?url` ではなく `?worker&url` を使ってください。dist のワーカーは隣接する `maplibre-gl-shared.mjs` を import しますが、`?url` は本番ビルドでワーカーファイルをそのまま出力し、隣接ファイルを含めません。その結果、ワーカーは最初の import で失敗し、ベクタータイルが一切読み込まれなくなります。`?worker&url` は Vite のワーカーパイプラインを通し、自己完結したチャンクを出力します。

さらにワークショップのテンプレートでは、Vite の依存関係の事前バンドルから MapLibre を除外しています。この処理の途中でワーカーのバンドルが失敗することがあるためです。

```ts
// template/vite.config.ts
export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		// MapLibre v6 worker bundling can fail during dependency pre-bundling.
		exclude: ['maplibre-gl']
	}
});
```

これは上流の要求ではなく、このテンプレート独自の回避策です。設定なしで動くプロジェクトであれば不要です。

!!! tip "他のバンドラー"
    webpack 5 以降、rspack、rsbuild でも同じ `setWorkerUrl()` を、通常の URL を渡して呼びます: `setWorkerUrl(new URL('maplibre-gl/dist/maplibre-gl-worker.mjs', import.meta.url).toString());` 変更点の全体は [v5 から v6 への移行ガイド](https://github.com/maplibre/maplibre-gl-js/blob/main/docs/guides/v5-to-v6-migration-guide.md) を参照してください。

## 次のステップ

MapLibre v6 での違いが分かったところで、Terra Draw の基本を学んでいきましょう。

[Terra Draw の基本 に進む](./basics/index.md)
