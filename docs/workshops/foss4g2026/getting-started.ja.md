# はじめよう

このワークショップの進め方は 2 通りあります。両方を同時に使ってもかまいません。

- **トラック A - ブラウザのみ (まずはこちらがおすすめ):** すべての演習ページにライブエディタが組み込まれています。左側に TypeScript を書き、**実行 ▶** をクリック (または `Ctrl+Enter` / `Cmd+Enter`) すると、右側に結果が表示されます。インストールは不要です。
- **トラック B - ローカル開発:** 同じアプリケーションを SvelteKit でローカルに構築します。動くプロジェクトを持ち帰れます。

## トラック A: ライブエディタを使う

各演習には、下のようなエディタが埋め込まれています。さっそく試してみましょう!

<terra-draw-editor start="../code/exercise-1/answer.ts" height="420"></terra-draw-editor>

- **演習**タブには最初のコードが入っています。自由に編集して**実行 ▶** で動かしてください。
- **解答**タブには解答が表示されます (読み取り専用)。**解答をエディタにコピー**で自分のエディタに取り込めます。
- **リセット**で最初のコードに戻ります。
- 編集内容はブラウザのタブを開いている間は保持され、ページを移動しても残ります。

プレビューには MapLibre GL JS の地図があらかじめ作られており、変数 `map` として使えます。これは後述のローカルテンプレートで自分で作る `map` 変数と同じものです。地図の左側にある細い領域は*サイドバー* (`<div id="sidebar">`) で、演習によってはここにボタンを追加します。

!!! note
    ライブエディタは Terra Draw と MapLibre を CDN から読み込むため、インターネット接続が必要です。会場のネットワークが不安定な場合は、トラック B に従い、各ページのプレーンなコードブロックをコピーして進めてください。

## トラック B: SvelteKit でローカル環境を構築する

ローカル開発環境には [SvelteKit](https://svelte.dev/docs/kit) を使います。ビルドが速くホットリロードも効くため、開発体験が非常に良いためです。

### 事前準備

- **Node.js v24 LTS** または **v22** ([ダウンロード](https://nodejs.org/)、または [nvm](https://github.com/nvm-sh/nvm) 経由でインストール)
- **pnpm** (`npm install -g pnpm`) — npm でも動作します
- **VS Code** またはお好みのエディタ

### 1. このリポジトリをクローンする

テンプレートプロジェクトを含め、このワークショップに必要なものはすべて 1 つのリポジトリにあります。

```bash
git clone https://github.com/watergis/terradraw-workshop.git
cd terradraw-workshop/template
```

### 2. 依存関係をインストールして起動する

```bash
pnpm install
pnpm dev
```

ブラウザで `http://localhost:5173` を開いてください。FOSS4G 2026 の開催地である広島の地図が表示されるはずです。

### 3. プロジェクトの構成

```bash
template/
├── package.json
├── src
│   ├── app.d.ts
│   ├── app.html
│   └── routes
│       ├── +page.svelte  <- ワークショップではこのファイルを使います
│       └── +page.ts
├── static
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

ワークショップ中は主に `src/routes/+page.svelte` を編集します。このファイルには MapLibre の地図のセットアップがすでに書かれています。

- 地図は `onMount()` の中で作成され、変数 `map` に格納されます
- これから追加するボタン用に、空の `<aside class="sidebar">` が用意されています
- `+page.ts` はサーバーサイドレンダリングを無効化しています (`export const ssr = false;`)

---

??? example "+page.svelte の初期状態の全体を表示"

    ```html
    <script lang="ts">
    	import {
    		AttributionControl,
    		FullscreenControl,
    		GeolocateControl,
    		GlobeControl,
    		Map,
    		NavigationControl,
    		ScaleControl
    	} from 'maplibre-gl';
    	import { onMount } from 'svelte';
    	import 'maplibre-gl/dist/maplibre-gl.css';

    	let mapContainer: HTMLDivElement | undefined = $state();
    	let map: Map | undefined = $state();

    	onMount(() => {
    		if (!mapContainer) return;
    		map = new Map({
    			container: mapContainer,
    			// Keyless OpenFreeMap vector style
    			style: 'https://tiles.openfreemap.org/styles/bright',
    			center: [132.4553, 34.3966],
    			zoom: 12,
    			hash: true,
    			attributionControl: false
    		});
    		map.addControl(new NavigationControl(), 'top-right');
    		map.addControl(new GlobeControl(), 'top-right');
    		map.addControl(new FullscreenControl(), 'top-right');
    		map.addControl(
    			new GeolocateControl({
    				positionOptions: { enableHighAccuracy: true },
    				trackUserLocation: true
    			}),
    			'top-right'
    		);
    		map.addControl(new ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');
    		map.addControl(new AttributionControl({ compact: true }), 'bottom-right');
    	});
    </script>

    <div class="main">
    	<aside class="sidebar">
    		<!-- Use this space for adding additional elements for workshop -->
    	</aside>
    	<div class="map" bind:this={mapContainer}></div>
    </div>

    <style lang="scss">
    	.main {
    		display: flex;
    		height: 100vh;
    		width: 100vw;

    		.sidebar {
    			width: 260px;
    			background: #f4f4f4;
    			border-right: 1px solid #ddd;
    			padding: 1rem;
    			box-sizing: border-box;
    			overflow-y: auto;
    		}
    		.map {
    			flex: 1;
    			height: 100%;
    			width: 100%;
    		}
    	}
    </style>
    ```

### ライブエディタと SvelteKit の間でコードを移す

演習のコードは、どちらの環境でもほぼ同じになるように書かれています。

| ライブエディタ | SvelteKit テンプレート |
| --- | --- |
| `map` はグローバル変数として提供される | `map` は `onMount()` の中で作成する |
| コードはトップレベルで実行される | Terra Draw のセットアップは `onMount()` の中に書く |
| ボタンは `addButton()` ヘルパーで追加する | ボタンはサイドバーの `<aside>` 内の `<button>` 要素 |

## 次のステップ

環境が整ったところで、このワークショップで使う MapLibre GL JS のバージョンでの変更点を簡単に見ておきましょう。

[MapLibre GL JS v5 から v6 へ に進む](./maplibre-v6.md)
